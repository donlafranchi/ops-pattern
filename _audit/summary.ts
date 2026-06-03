#!/usr/bin/env tsx
// Summary report generator. Reads all _audit/F###/run.jsonl, renders _audit/summary.html
// with one sortable row per F-number.
//
// Usage: tsx summary.ts

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

interface Row {
  f: string;
  tokens: number;
  cost: number;
  duration: number;
  skills: number;
  domTokSkill: string;
  domTimeSkill: string;
  calls: number;
  conf: string;
  window: string;
}

const rows: Row[] = [];

// Include every bucket that has a run.jsonl — F-numbers AND `unattributed`.
// Anything else (node_modules, top-level files) is skipped by the run.jsonl check.
for (const name of fs.readdirSync(AUDIT_DIR).sort()) {
  if (name.startsWith('.') || name === 'node_modules') continue;
  const runPath = path.join(AUDIT_DIR, name, 'run.jsonl');
  if (!fs.existsSync(runPath)) continue;
  const records = readJsonl<CallRecord>(fs.readFileSync(runPath, 'utf8'));
  if (!records.length) continue;

  let tokens = 0;
  let cost = 0;
  let duration = 0;
  const tokBySkill: Record<string, number> = {};
  const timeBySkill: Record<string, number> = {};
  for (const r of records) {
    tokens += totalTokens(r);
    cost += costOf(r);
    duration += r.duration_ms;
    const sk = r.skill ?? '(none)';
    tokBySkill[sk] = (tokBySkill[sk] || 0) + totalTokens(r);
    timeBySkill[sk] = (timeBySkill[sk] || 0) + r.duration_ms;
  }
  const domTok = Object.entries(tokBySkill).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  const domTime = Object.entries(timeBySkill).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  // attribution-confidence mix + data window for the backfill view
  const confCounts: Record<string, number> = {};
  let minTs = '';
  let maxTs = '';
  for (const r of records) {
    confCounts[r.attribution_confidence || '—'] = (confCounts[r.attribution_confidence || '—'] || 0) + 1;
    if (r.timestamp) {
      if (!minTs || r.timestamp < minTs) minTs = r.timestamp;
      if (!maxTs || r.timestamp > maxTs) maxTs = r.timestamp;
    }
  }
  const conf = ['high', 'medium', 'low', 'none']
    .filter((k) => confCounts[k])
    .map((k) => `${k[0].toUpperCase()} ${Math.round((confCounts[k] / records.length) * 100)}%`)
    .join(' ');
  const window = `${minTs.slice(5, 10)}→${maxTs.slice(5, 10)}`;

  rows.push({
    f: name,
    tokens,
    cost,
    duration,
    skills: Object.keys(tokBySkill).length,
    domTokSkill: domTok,
    domTimeSkill: domTime,
    calls: records.length,
    conf,
    window,
  });
}

rows.sort((a, b) => b.tokens - a.tokens);

// Dataset window — earliest → latest timestamp across every bucket.
let datasetMin = '';
let datasetMax = '';
for (const name of fs.readdirSync(AUDIT_DIR)) {
  const runPath = path.join(AUDIT_DIR, name, 'run.jsonl');
  if (!fs.existsSync(runPath)) continue;
  for (const r of readJsonl<CallRecord>(fs.readFileSync(runPath, 'utf8'))) {
    if (!r.timestamp) continue;
    if (!datasetMin || r.timestamp < datasetMin) datasetMin = r.timestamp;
    if (!datasetMax || r.timestamp > datasetMax) datasetMax = r.timestamp;
  }
}
const datasetWindow = datasetMin && datasetMax
  ? `${datasetMin.slice(0, 10)} → ${datasetMax.slice(0, 10)}`
  : '—';

// Backfill targets requested for F032–F035. Surface any that produced no
// confidently-attributable calls so the gap is documented, not silent.
const BACKFILL_TARGETS = ['F032', 'F033', 'F034', 'F035'];
const gaps = BACKFILL_TARGETS.filter((f) => !rows.some((r) => r.f === f));
const gapLinks = gaps.map((f) => `<a href="${f}/report.html">${f}</a>`).join(', ');
const gapCallout = gaps.length
  ? `<div class="gap"><strong>Backfill gap:</strong> ${gapLinks} produced
     <strong>no confidently-attributable calls</strong> in any scanned transcript
     (2026-05-25 → 2026-06-02). These features remain in <code>planning/backlog/</code>
     with no tickets or dedicated build segments — their F-numbers appear only inside
     backlog-scan / sequence-table contexts dominated by other features, so per the
     "don't guess" rule those calls stayed with their host feature rather than being
     force-bucketed here.</div>`
  : '';

const grand = rows.reduce(
  (acc, r) => {
    acc.tokens += r.tokens;
    acc.cost += r.cost;
    acc.duration += r.duration;
    acc.calls += r.calls;
    return acc;
  },
  { tokens: 0, cost: 0, duration: 0, calls: 0 },
);

const body = rows
  .map(
    (r) => `<tr>
    <td><a href="${esc(r.f)}/report.html">${esc(r.f)}</a></td>
    <td class="num">${fmtInt(r.calls)}</td>
    <td class="num">${fmtInt(r.tokens)}</td>
    <td class="num">${fmtUSD(r.cost)}</td>
    <td class="num">${fmtDuration(r.duration)}</td>
    <td class="num">${r.skills}</td>
    <td>${esc(r.domTokSkill)}</td>
    <td>${esc(r.conf)}</td>
    <td>${esc(r.window)}</td>
  </tr>`,
  )
  .join('\n');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Pipeline telemetry — summary</title>
<style>
  body{font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#f6f7f9;color:#1a1a1a}
  .wrap{max-width:1000px;margin:0 auto;padding:32px 24px 80px}
  h1{font-size:24px;margin:0 0 4px} .sub{color:#666;margin:0 0 24px}
  .cards{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
  .card{background:#fff;border:1px solid #e2e4e8;border-radius:8px;padding:14px 18px;flex:1;min-width:150px}
  .card .k{color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
  .card .v{font-size:22px;font-weight:600;margin-top:4px}
  table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e4e8;border-radius:8px;overflow:hidden}
  th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #eef0f3}
  th{background:#fafbfc;font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:#555;cursor:pointer;user-select:none}
  th:hover{background:#f0f2f5}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
  tr:last-child td{border-bottom:none} a{color:#2563eb;text-decoration:none} a:hover{text-decoration:underline}
  .gap{background:#fff8e6;border:1px solid #f5d98a;border-radius:8px;padding:12px 16px;margin-bottom:20px;color:#6b5400}
  footer{margin-top:40px;color:#999;font-size:12px}
</style></head><body><div class="wrap">
<h1>Pipeline telemetry — summary</h1>
<p class="sub">${rows.length} bucket(s) · dataset window <strong>${datasetWindow}</strong> · click a column to sort, click an F-number for its full report · see <a href="totals.html">totals.html</a> for surface / skill / time pivots</p>
${gapCallout}
<div class="cards">
  <div class="card"><div class="k">Total tokens</div><div class="v">${fmtInt(grand.tokens)}</div></div>
  <div class="card"><div class="k">Total cost</div><div class="v">${fmtUSD(grand.cost)}</div></div>
  <div class="card"><div class="k">Total wall time</div><div class="v">${fmtDuration(grand.duration)}</div></div>
  <div class="card"><div class="k">Total calls</div><div class="v">${fmtInt(grand.calls)}</div></div>
</div>
<table id="t"><thead><tr>
  <th>F-number</th><th class="num">Calls</th><th class="num">Total tokens</th><th class="num">Total cost</th>
  <th class="num">Wall time</th><th class="num">Skill count</th><th>Dominant (tokens)</th><th>Attribution conf.</th><th>Data window</th>
</tr></thead><tbody>${body}</tbody></table>
<footer>Generated from _audit/F###/run.jsonl. Pricing: Opus $15/$75, Sonnet $3/$15, Haiku $1/$5 per 1M in/out.</footer>
</div>
<script>
var t=document.getElementById('t');
t.querySelectorAll('th').forEach(function(th,idx){
  th.addEventListener('click',function(){
    var tb=t.querySelector('tbody'), rows=[].slice.call(tb.querySelectorAll('tr'));
    var asc=th._asc=!th._asc;
    rows.sort(function(a,b){
      var x=a.children[idx].textContent.replace(/[$,\\smsMK%]/g,'');
      var y=b.children[idx].textContent.replace(/[$,\\smsMK%]/g,'');
      var nx=parseFloat(x),ny=parseFloat(y);
      if(!isNaN(nx)&&!isNaN(ny))return asc?nx-ny:ny-nx;
      return asc?x.localeCompare(y):y.localeCompare(x);
    });
    rows.forEach(function(r){tb.appendChild(r)});
  });
});
</script>
</body></html>`;

fs.writeFileSync(path.join(AUDIT_DIR, 'summary.html'), html);
console.log(`summary.html written — ${rows.length} F-numbers, ${fmtInt(grand.tokens)} tokens, ${fmtUSD(grand.cost)}`);
