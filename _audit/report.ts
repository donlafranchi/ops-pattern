#!/usr/bin/env tsx
// Per-F report generator. Reads _audit/F###/run.jsonl, renders _audit/F###/report.html.
//
// Usage:
//   tsx report.ts F035        # one F-number
//   tsx report.ts             # every F-number that has a run.jsonl

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

function loadNotes(): string[] {
  const p = path.join(AUDIT_DIR, 'segmentation-notes.json');
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
}

interface Agg {
  calls: number;
  tokens: number;
  cost: number;
  duration: number;
}
function emptyAgg(): Agg {
  return { calls: 0, tokens: 0, cost: 0, duration: 0 };
}
function add(a: Agg, r: CallRecord) {
  a.calls++;
  a.tokens += totalTokens(r);
  a.cost += costOf(r);
  a.duration += r.duration_ms;
}

function buildReport(fNum: string): boolean {
  const dir = path.join(AUDIT_DIR, fNum);
  const runPath = path.join(dir, 'run.jsonl');
  if (!fs.existsSync(runPath)) {
    console.error(`  ${fNum}: no run.jsonl — run collect.ts first`);
    return false;
  }
  const records = readJsonl<CallRecord>(fs.readFileSync(runPath, 'utf8'));
  if (!records.length) {
    console.error(`  ${fNum}: run.jsonl is empty`);
    return false;
  }

  const total = emptyAgg();
  const bySkill: Record<string, Agg> = {};
  const bySurface: Record<string, Agg> = {};
  for (const r of records) {
    add(total, r);
    const sk = r.skill ?? '(none)';
    add((bySkill[sk] ||= emptyAgg()), r);
    add((bySurface[r.surface] ||= emptyAgg()), r);
  }

  const skillRows = Object.entries(bySkill).sort((a, b) => b[1].tokens - a[1].tokens);

  // Pareto: how many skills account for 80% of tokens
  let cum = 0;
  let paretoCount = 0;
  for (const [, a] of skillRows) {
    cum += a.tokens;
    paretoCount++;
    if (cum >= total.tokens * 0.8) break;
  }
  const topSkill = skillRows[0];

  // committed output: which skills produced a commit (proxy = appears in git log) —
  // we cannot read git here, so flag skills with tokens but zero output_tokens as
  // "no generated output" (pure read/observation).
  const skillOutput: Record<string, number> = {};
  for (const r of records) {
    const sk = r.skill ?? '(none)';
    skillOutput[sk] = (skillOutput[sk] || 0) + r.output_tokens;
  }

  const notesAll = loadNotes().filter((n) => n.includes(fNum) || !/F0\d{2}/.test(n));
  const recordNotes = Array.from(
    new Set(records.map((r) => r.notes).filter(Boolean)),
  );

  const cell = (n: number) => `<td class="num">${fmtInt(n)}</td>`;

  const skillTableRows = skillRows
    .map(([sk, a]) => {
      const perInvoke = Math.round(a.tokens / a.calls);
      const noOutput = (skillOutput[sk] || 0) === 0;
      const flag = noOutput
        ? '<span class="flag">no generated output</span>'
        : '';
      return `<tr data-tokens="${a.tokens}" data-perinvoke="${perInvoke}">
        <td>${esc(sk)} ${flag}</td>
        ${cell(a.calls)}${cell(a.tokens)}
        <td class="num">${fmtUSD(a.cost)}</td>
        <td class="num">${fmtDuration(a.duration)}</td>
        ${cell(perInvoke)}
      </tr>`;
    })
    .join('\n');

  const surfaceRows = Object.entries(bySurface)
    .sort((a, b) => b[1].tokens - a[1].tokens)
    .map(
      ([s, a]) =>
        `<tr><td>${esc(s)}</td>${cell(a.calls)}${cell(a.tokens)}<td class="num">${fmtUSD(
          a.cost,
        )}</td><td class="num">${fmtDuration(a.duration)}</td></tr>`,
    )
    .join('\n');

  // bottleneck distribution bars (by tokens)
  const maxTok = Math.max(...skillRows.map(([, a]) => a.tokens));
  const bars = skillRows
    .map(([sk, a]) => {
      const pct = ((a.tokens / total.tokens) * 100).toFixed(1);
      const w = ((a.tokens / maxTok) * 100).toFixed(1);
      return `<div class="barrow"><div class="barlabel">${esc(sk)}</div>
        <div class="bartrack"><div class="bar" style="width:${w}%"></div></div>
        <div class="barval">${fmtInt(a.tokens)} (${pct}%)</div></div>`;
    })
    .join('\n');

  const notesSection =
    recordNotes.length || notesAll.length
      ? `<ul>${[...new Set([...notesAll, ...recordNotes])]
          .map((n) => `<li>${esc(n)}</li>`)
          .join('')}</ul>`
      : '<p class="muted">No segmentation ambiguities recorded.</p>';

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>${fNum} — pipeline telemetry</title>
<style>
  body{font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#f6f7f9;color:#1a1a1a}
  .wrap{max-width:960px;margin:0 auto;padding:32px 24px 80px}
  h1{font-size:24px;margin:0 0 4px} h2{font-size:16px;margin:32px 0 12px;border-bottom:1px solid #e2e4e8;padding-bottom:6px}
  .sub{color:#666;margin:0 0 24px}
  .cards{display:flex;gap:12px;flex-wrap:wrap}
  .card{background:#fff;border:1px solid #e2e4e8;border-radius:8px;padding:14px 18px;flex:1;min-width:150px}
  .card .k{color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
  .card .v{font-size:22px;font-weight:600;margin-top:4px}
  table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e4e8;border-radius:8px;overflow:hidden}
  th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #eef0f3}
  th{background:#fafbfc;font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:#555;cursor:pointer;user-select:none}
  th:hover{background:#f0f2f5}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
  tr:last-child td{border-bottom:none}
  .flag{display:inline-block;background:#fde8e8;color:#b42318;font-size:11px;padding:1px 6px;border-radius:4px;margin-left:6px}
  .pareto{background:#eef6ff;border:1px solid #cfe3fb;border-radius:8px;padding:12px 16px;margin:12px 0}
  .barrow{display:flex;align-items:center;gap:10px;margin:5px 0}
  .barlabel{width:170px;font-size:13px;text-align:right;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .bartrack{flex:1;background:#eef0f3;border-radius:4px;height:16px;overflow:hidden}
  .bar{background:#3b82f6;height:100%}
  .barval{width:160px;font-size:12px;color:#555;font-variant-numeric:tabular-nums}
  .muted{color:#888}
  .notes li{margin:3px 0}
  footer{margin-top:40px;color:#999;font-size:12px}
</style></head><body><div class="wrap">
<h1>${fNum} — pipeline telemetry</h1>
<p class="sub">${records.length} Claude calls · generated from <code>${esc(
    path.relative(AUDIT_DIR, runPath),
  )}</code></p>

<h2>Cost-per-F</h2>
<div class="cards">
  <div class="card"><div class="k">Total tokens</div><div class="v">${fmtInt(total.tokens)}</div></div>
  <div class="card"><div class="k">Est. cost</div><div class="v">${fmtUSD(total.cost)}</div></div>
  <div class="card"><div class="k">Wall time</div><div class="v">${fmtDuration(total.duration)}</div></div>
  <div class="card"><div class="k">Calls</div><div class="v">${fmtInt(total.calls)}</div></div>
</div>

<h2>By surface</h2>
<table><thead><tr><th>Surface</th><th class="num">Calls</th><th class="num">Tokens</th><th class="num">Cost</th><th class="num">Time</th></tr></thead>
<tbody>${surfaceRows}</tbody></table>

<h2>Bottleneck distribution (tokens by skill)</h2>
<div class="pareto"><strong>Pareto:</strong> ${paretoCount} of ${skillRows.length} skill(s) account for 80% of tokens.
Dominant: <strong>${esc(topSkill[0])}</strong> at ${fmtInt(topSkill[1].tokens)} tokens (${(
    (topSkill[1].tokens / total.tokens) *
    100
  ).toFixed(1)}%).</div>
${bars}

<h2>Skill ROI</h2>
<p class="muted">Click a column header to sort. Skills flagged <span class="flag">no generated output</span> spent tokens but emitted zero output tokens (pure read/observation).</p>
<table id="roi"><thead><tr>
  <th>Skill</th><th class="num" data-sort="num">Calls</th><th class="num" data-sort="num">Tokens</th>
  <th class="num" data-sort="num">Cost</th><th class="num" data-sort="num">Time</th><th class="num" data-sort="num">Tokens / invoke</th>
</tr></thead><tbody>${skillTableRows}</tbody></table>

<h2>Segmentation notes</h2>
<div class="notes">${notesSection}</div>

<footer>Pricing: Opus $15/$75, Sonnet $3/$15, Haiku $1/$5 per 1M in/out (cache write 1.25×, read 0.1×).
Durations approximate request latency from transcript timestamps.</footer>
</div>
<script>
// click-to-sort for any table with sortable headers
document.querySelectorAll('table').forEach(function(t){
  t.querySelectorAll('th').forEach(function(th,idx){
    th.addEventListener('click',function(){
      var tb=t.querySelector('tbody');
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

  fs.writeFileSync(path.join(dir, 'report.html'), html);
  console.log(`  ${fNum}: report.html written (${records.length} calls, ${fmtUSD(total.cost)})`);
  return true;
}

const argF = process.argv[2];
if (argF) {
  buildReport(argF);
} else {
  for (const name of fs.readdirSync(AUDIT_DIR)) {
    if (/^F0\d{2}$/.test(name)) buildReport(name);
  }
}
