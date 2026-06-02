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
}

const rows: Row[] = [];

for (const name of fs.readdirSync(AUDIT_DIR).sort()) {
  if (!/^F0\d{2}$/.test(name)) continue;
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

  rows.push({
    f: name,
    tokens,
    cost,
    duration,
    skills: Object.keys(tokBySkill).length,
    domTokSkill: domTok,
    domTimeSkill: domTime,
    calls: records.length,
  });
}

rows.sort((a, b) => b.tokens - a.tokens);

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
    <td>${esc(r.domTimeSkill)}</td>
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
  footer{margin-top:40px;color:#999;font-size:12px}
</style></head><body><div class="wrap">
<h1>Pipeline telemetry — summary</h1>
<p class="sub">${rows.length} F-number(s) · click a column to sort, click an F-number for its full report</p>
<div class="cards">
  <div class="card"><div class="k">Total tokens</div><div class="v">${fmtInt(grand.tokens)}</div></div>
  <div class="card"><div class="k">Total cost</div><div class="v">${fmtUSD(grand.cost)}</div></div>
  <div class="card"><div class="k">Total wall time</div><div class="v">${fmtDuration(grand.duration)}</div></div>
  <div class="card"><div class="k">Total calls</div><div class="v">${fmtInt(grand.calls)}</div></div>
</div>
<table id="t"><thead><tr>
  <th>F-number</th><th class="num">Calls</th><th class="num">Total tokens</th><th class="num">Total cost</th>
  <th class="num">Wall time</th><th class="num">Skill count</th><th>Dominant (tokens)</th><th>Dominant (time)</th>
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
