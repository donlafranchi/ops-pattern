#!/usr/bin/env tsx
// Cross-bucket totals report. Reads every _audit/*/run.jsonl (F### + unattributed)
// and renders _audit/totals.html with three pivots: Surface, Skill, Time (DD/WW/MM).
//
// Surface taxonomy (derived in collect.ts from transcript source path):
//   code      Claude Code CLI sessions
//   cowork    Cowork desktop sessions (foreground main agent)
//   dispatch  subagent dispatches inside either Code or Cowork (Task tool, sidechains)
//
// Claude Desktop chat is NOT captured locally — it has no jsonl, so it is intentionally
// absent from this report.
//
// Usage: tsx totals.ts

import * as fs from 'fs';
import * as path from 'path';
import {
  AUDIT_DIR,
  CallRecord,
  readJsonl,
  costOf,
  totalTokens,
  fmtUSD,
  fmtInt,
  fmtDuration,
  esc,
} from './lib';

interface Agg { calls: number; tokens: number; cost: number; duration: number; }
const emptyAgg = (): Agg => ({ calls: 0, tokens: 0, cost: 0, duration: 0 });
function add(a: Agg, r: CallRecord) {
  a.calls++;
  a.tokens += totalTokens(r);
  a.cost += costOf(r);
  a.duration += r.duration_ms;
}

// ---- ISO week label: YYYY-Www. Week starts Monday; week 1 contains Jan 4th. ----
function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const yearStart = new Date(Date.UTC(y, 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${y}-W${String(week).padStart(2, '0')}`;
}

// ---- gather all records across every bucket ----
const all: CallRecord[] = [];
for (const name of fs.readdirSync(AUDIT_DIR)) {
  if (name.startsWith('.') || name === 'node_modules') continue;
  const p = path.join(AUDIT_DIR, name, 'run.jsonl');
  if (!fs.existsSync(p)) continue;
  for (const r of readJsonl<CallRecord>(fs.readFileSync(p, 'utf8'))) all.push(r);
}

if (!all.length) {
  console.error('No records found. Run collect.ts first.');
  process.exit(1);
}

// ---- grand totals + dataset window ----
const grand = emptyAgg();
let minTs = '';
let maxTs = '';
for (const r of all) {
  add(grand, r);
  if (r.timestamp) {
    if (!minTs || r.timestamp < minTs) minTs = r.timestamp;
    if (!maxTs || r.timestamp > maxTs) maxTs = r.timestamp;
  }
}
const datasetWindow = minTs && maxTs ? `${minTs.slice(0, 10)} → ${maxTs.slice(0, 10)}` : '—';

// ---- pivot helpers ----
function pivot(keyFn: (r: CallRecord) => string): [string, Agg][] {
  const buckets: Record<string, Agg> = {};
  for (const r of all) add((buckets[keyFn(r)] ||= emptyAgg()), r);
  return Object.entries(buckets).sort((a, b) => b[1].tokens - a[1].tokens);
}

const bySurface = pivot((r) => r.surface || 'unknown');
const bySkill = pivot((r) => r.skill ?? '(none)');
const byDay = pivot((r) => (r.timestamp || '').slice(0, 10) || '?').sort((a, b) =>
  a[0].localeCompare(b[0]),
);
const byWeek = pivot((r) => (r.timestamp ? isoWeek(new Date(r.timestamp)) : '?')).sort((a, b) =>
  a[0].localeCompare(b[0]),
);
const byMonth = pivot((r) => (r.timestamp || '').slice(0, 7) || '?').sort((a, b) =>
  a[0].localeCompare(b[0]),
);

// ---- render ----
const cell = (n: number) => `<td class="num">${fmtInt(n)}</td>`;
function pctOf(part: number, whole: number): string {
  return whole ? `${((part / whole) * 100).toFixed(1)}%` : '—';
}

function table(
  rows: [string, Agg][],
  keyHeader: string,
  opts: { showPct?: boolean; mono?: boolean } = {},
): string {
  const body = rows
    .map(([k, a]) => {
      const pct = opts.showPct ? `<td class="num">${pctOf(a.tokens, grand.tokens)}</td>` : '';
      const klabel = opts.mono ? `<code>${esc(k)}</code>` : esc(k);
      return `<tr>
        <td>${klabel}</td>
        ${cell(a.calls)}${cell(a.tokens)}
        <td class="num">${fmtUSD(a.cost)}</td>
        <td class="num">${fmtDuration(a.duration)}</td>
        ${pct}
      </tr>`;
    })
    .join('\n');
  const pctTh = opts.showPct ? '<th class="num">% tokens</th>' : '';
  return `<table><thead><tr>
    <th>${esc(keyHeader)}</th><th class="num">Calls</th><th class="num">Tokens</th>
    <th class="num">Cost</th><th class="num">Time</th>${pctTh}
  </tr></thead><tbody>${body}</tbody></table>`;
}

const surfaceTable = table(bySurface, 'Surface', { showPct: true });
const skillTable = table(bySkill, 'Skill', { showPct: true });
const dayTable = table(byDay, 'Day', { mono: true });
const weekTable = table(byWeek, 'ISO week', { mono: true });
const monthTable = table(byMonth, 'Month', { mono: true });

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Pipeline telemetry — totals</title>
<style>
  body{font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#f6f7f9;color:#1a1a1a}
  .wrap{max-width:1000px;margin:0 auto;padding:32px 24px 80px}
  h1{font-size:24px;margin:0 0 4px} h2{font-size:16px;margin:32px 0 12px;border-bottom:1px solid #e2e4e8;padding-bottom:6px}
  .sub{color:#666;margin:0 0 24px}
  .cards{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
  .card{background:#fff;border:1px solid #e2e4e8;border-radius:8px;padding:14px 18px;flex:1;min-width:150px}
  .card .k{color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
  .card .v{font-size:22px;font-weight:600;margin-top:4px}
  table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e4e8;border-radius:8px;overflow:hidden;margin-bottom:4px}
  th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #eef0f3}
  th{background:#fafbfc;font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:#555;cursor:pointer;user-select:none}
  th:hover{background:#f0f2f5}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
  tr:last-child td{border-bottom:none}
  a{color:#2563eb;text-decoration:none} a:hover{text-decoration:underline}
  code{background:#f3f4f6;padding:1px 5px;border-radius:3px;font-size:12.5px}
  .tabs{display:flex;gap:4px;margin-bottom:8px}
  .tab{background:#fff;border:1px solid #e2e4e8;border-bottom:none;border-radius:6px 6px 0 0;padding:6px 14px;cursor:pointer;font-size:13px;color:#555}
  .tab.active{background:#eef6ff;color:#1d4ed8;border-color:#cfe3fb}
  .pane{display:none} .pane.active{display:block}
  .note{background:#fff8e6;border:1px solid #f5d98a;border-radius:6px;padding:8px 12px;margin:8px 0;color:#6b5400;font-size:13px}
  footer{margin-top:40px;color:#999;font-size:12px}
</style></head><body><div class="wrap">
<h1>Pipeline telemetry — totals</h1>
<p class="sub">Every call across every session, ${all.length.toLocaleString()} records · dataset window <strong>${esc(datasetWindow)}</strong> · see <a href="summary.html">summary.html</a> for the per-feature view</p>

<div class="cards">
  <div class="card"><div class="k">Total tokens</div><div class="v">${fmtInt(grand.tokens)}</div></div>
  <div class="card"><div class="k">Total cost</div><div class="v">${fmtUSD(grand.cost)}</div></div>
  <div class="card"><div class="k">Total wall time</div><div class="v">${fmtDuration(grand.duration)}</div></div>
  <div class="card"><div class="k">Total calls</div><div class="v">${fmtInt(grand.calls)}</div></div>
</div>

<h2>By surface</h2>
<p class="sub" style="margin:-6px 0 12px;font-size:13px">
  <code>code</code> = Claude Code CLI · <code>cowork</code> = Cowork desktop · <code>dispatch</code> = subagent dispatches inside either.
  Claude Desktop chat is not captured in local jsonl and is excluded.
</p>
${surfaceTable}

<h2>By skill</h2>
<p class="sub" style="margin:-6px 0 12px;font-size:13px"><code>(none)</code> = raw conversation / pre-skill turns. Plugin / M-gate skills are flagged by their <code>family:name</code> shape.</p>
${skillTable}

<h2>By time</h2>
<div class="tabs">
  <div class="tab active" data-pane="day">Day (DD)</div>
  <div class="tab" data-pane="week">Week (WW)</div>
  <div class="tab" data-pane="month">Month (MM)</div>
</div>
<div class="pane active" id="pane-day">${dayTable}</div>
<div class="pane" id="pane-week">${weekTable}</div>
<div class="pane" id="pane-month">${monthTable}</div>

<footer>Generated from _audit/*/run.jsonl across both <code>~/.claude/projects/-Users-don-Projects-community/</code> (Code) and <code>~/Library/Application Support/Claude/local-agent-mode-sessions/</code> (Cowork). Pricing: Opus $15/$75, Sonnet $3/$15, Haiku $1/$5 per 1M in/out (cache write 1.25×, read 0.1×).</footer>
</div>
<script>
// Tab switcher for the Time section
document.querySelectorAll('.tab').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});
    document.querySelectorAll('.pane').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    document.getElementById('pane-'+t.dataset.pane).classList.add('active');
  });
});
// Click-to-sort for every table
document.querySelectorAll('table').forEach(function(tbl){
  tbl.querySelectorAll('th').forEach(function(th,idx){
    th.addEventListener('click',function(){
      var tb=tbl.querySelector('tbody');
      var rows=[].slice.call(tb.querySelectorAll('tr'));
      var asc=th._asc=!th._asc;
      rows.sort(function(a,b){
        var x=a.children[idx].textContent.replace(/[$,\\smsMK%]/g,'');
        var y=b.children[idx].textContent.replace(/[$,\\smsMK%]/g,'');
        var nx=parseFloat(x), ny=parseFloat(y);
        if(!isNaN(nx)&&!isNaN(ny)) return asc?nx-ny:ny-nx;
        return asc?x.localeCompare(y):y.localeCompare(x);
      });
      rows.forEach(function(r){tb.appendChild(r)});
    });
  });
});
</script>
</body></html>`;

fs.writeFileSync(path.join(AUDIT_DIR, 'totals.html'), html);
console.log(
  `totals.html written — ${all.length.toLocaleString()} calls, ${fmtInt(grand.tokens)} tokens, ${fmtUSD(grand.cost)}, window ${datasetWindow}`,
);
