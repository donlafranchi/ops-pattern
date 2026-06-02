#!/usr/bin/env tsx
// Transcript-parsing collector.
// Reads Claude Code transcript JSONL files, segments by Skill tool-call markers,
// attributes each Claude API call to an F-number + skill + surface, and writes
// _audit/F###/run.jsonl (one record per call).
//
// Usage:
//   tsx collect.ts                       # scan every transcript, bucket by F-number
//   tsx collect.ts --f F035              # only write the F035 bucket (still scans all)
//   tsx collect.ts --sessions a.jsonl,b.jsonl   # restrict input to named session files
//
// Re-runnable: overwrites existing run.jsonl for every F-number it emits.

import * as fs from 'fs';
import * as path from 'path';
import {
  PROJECT_DIR,
  AUDIT_DIR,
  CallRecord,
  readJsonl,
  isPluginSkill,
  surfaceForSkill,
} from './lib';

const F_RE = /F0\d{2}\b/g;
const args = process.argv.slice(2);

function flag(name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

const onlyF = flag('--f');
const sessionFilter = flag('--sessions')?.split(',').map((s) => s.trim());

// ---- collect transcript files (top-level sessions + subagent sidechains) ----
function listTranscripts(): string[] {
  const files: string[] = [];
  for (const name of fs.readdirSync(PROJECT_DIR)) {
    const full = path.join(PROJECT_DIR, name);
    if (name.endsWith('.jsonl') && fs.statSync(full).isFile()) files.push(full);
    else if (fs.statSync(full).isDirectory()) {
      // subagent sidechain transcripts live in <session>/subagents/*.jsonl
      const sub = path.join(full, 'subagents');
      if (fs.existsSync(sub)) {
        for (const s of fs.readdirSync(sub)) {
          if (s.endsWith('.jsonl')) files.push(path.join(sub, s));
        }
      }
    }
  }
  if (sessionFilter) {
    return files.filter((f) => sessionFilter.some((s) => f.includes(s)));
  }
  return files;
}

// Pull all visible text out of a transcript record (for rolling F-number detection).
function textOf(rec: any): string {
  const parts: string[] = [];
  const msg = rec?.message;
  const c = msg?.content ?? rec?.content;
  if (typeof c === 'string') parts.push(c);
  else if (Array.isArray(c)) {
    for (const b of c) {
      if (typeof b === 'string') parts.push(b);
      else if (b && typeof b === 'object') {
        if (typeof b.text === 'string') parts.push(b.text);
        if (typeof b.thinking === 'string') parts.push(b.thinking);
        if (b.input) parts.push(JSON.stringify(b.input));
        if (typeof b.content === 'string') parts.push(b.content);
      }
    }
  }
  if (rec?.toolUseResult) parts.push(JSON.stringify(rec.toolUseResult).slice(0, 2000));
  return parts.join('\n');
}

function firstF(s: string): string | null {
  if (!s) return null;
  const m = s.match(F_RE);
  return m ? m[0] : null;
}

interface StackEntry {
  skill: string;
  fFromArgs: string | null;
  isPlugin: boolean;
}

const ambiguities: string[] = [];
const allRecords: CallRecord[] = [];

for (const file of listTranscripts()) {
  const isSubagent = file.includes(path.join('subagents', ''));
  const sessionName = path.basename(path.dirname(file)) === path.basename(PROJECT_DIR)
    ? path.basename(file, '.jsonl')
    : `${path.basename(path.dirname(path.dirname(file)))}/${path.basename(file, '.jsonl')}`;

  const raw = fs.readFileSync(file, 'utf8');
  const recs = readJsonl(raw);
  if (!recs.length) continue;

  // session-dominant F-number (most-mentioned across the whole transcript)
  const counts: Record<string, number> = {};
  const allText = raw.match(F_RE) || [];
  for (const f of allText) counts[f] = (counts[f] || 0) + 1;
  const dominantF =
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const stack: StackEntry[] = [];
  let rollingF: string | null = null;
  let lastTs: number | null = null;

  for (const rec of recs) {
    const ts = rec?.timestamp ? Date.parse(rec.timestamp) : null;

    // update rolling F-number from any visible text
    const f = firstF(textOf(rec));
    if (f) rollingF = f;

    // handle Skill tool-call markers — they open a new segment
    if (rec?.type === 'assistant' && Array.isArray(rec?.message?.content)) {
      for (const b of rec.message.content) {
        if (b?.type === 'tool_use' && b?.name === 'Skill') {
          const skill: string = b.input?.skill || b.input?.command || 'unknown';
          const fFromArgs = firstF(
            [b.input?.args, b.input?.command].filter(Boolean).join(' '),
          );
          if (isPluginSkill(skill)) {
            // M-gate / plugin skill nested inside the active pipeline skill
            const parent = [...stack].reverse().find((s) => !s.isPlugin);
            stack.push({ skill, fFromArgs, isPlugin: true });
            ambiguities.push(
              `[${sessionName}] nested skill "${skill}" fired inside "${
                parent?.skill ?? 'none'
              }" (M-gate) — attributed as sidechain of parent`,
            );
          } else {
            // a top-level pipeline skill replaces whatever pipeline skill was active
            stack.length = 0;
            stack.push({ skill, fFromArgs, isPlugin: false });
          }
        }
      }
    }

    // emit one record per assistant message that carries usage
    if (rec?.type === 'assistant' && rec?.message?.usage) {
      const u = rec.message.usage;
      const top = stack[stack.length - 1] ?? null;
      const pipeline = [...stack].reverse().find((s) => !s.isPlugin) ?? null;
      const skill = top?.skill ?? null;
      const parent_skill = top?.isPlugin ? pipeline?.skill ?? null : null;

      // F-number attribution priority: skill-args > session-dominant > rolling > unknown
      const segF = top?.fFromArgs ?? null;
      let f_number: string;
      let attrNote = '';
      if (segF) {
        f_number = segF;
      } else if (dominantF) {
        f_number = dominantF;
        if (rollingF && rollingF !== dominantF) {
          attrNote = `f-number from session-dominant (${dominantF}); local context mentions ${rollingF}`;
        } else {
          attrNote = `f-number from session-dominant (${dominantF})`;
        }
      } else if (rollingF) {
        f_number = rollingF;
        attrNote = `f-number from rolling context (${rollingF})`;
      } else {
        f_number = 'unknown';
        attrNote = 'f-number unresolved — no F-marker in session';
      }

      const entrypoint = rec.entrypoint || '';
      const surface = top?.isPlugin
        ? surfaceForSkill(parent_skill, entrypoint)
        : surfaceForSkill(skill, entrypoint);

      // duration ≈ gap from the previous transcript line to this assistant turn
      let duration_ms = 0;
      if (ts != null && lastTs != null) duration_ms = Math.max(0, ts - lastTs);

      const notes: string[] = [];
      if (attrNote) notes.push(attrNote);
      if (!skill) notes.push('no active skill segment — raw conversation / pre-skill turn');
      if (top?.isPlugin) notes.push(`nested M-gate skill under "${parent_skill}"`);
      if (isSubagent) notes.push('subagent sidechain transcript');
      if (rec.isSidechain) notes.push('isSidechain=true');
      if (duration_ms > 10 * 60 * 1000) {
        notes.push('large gap (>10m) — duration likely includes idle time');
        ambiguities.push(
          `[${sessionName}] ${duration_ms}ms gap before ${rec.requestId} — idle time, not pure request latency`,
        );
      }

      allRecords.push({
        timestamp: rec.timestamp ?? '',
        f_number,
        skill,
        parent_skill,
        surface,
        model: rec.message.model ?? 'unknown',
        input_tokens: u.input_tokens ?? 0,
        output_tokens: u.output_tokens ?? 0,
        cache_creation_input_tokens: u.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: u.cache_read_input_tokens ?? 0,
        duration_ms,
        request_id: rec.requestId ?? '',
        is_sidechain: Boolean(rec.isSidechain || isSubagent),
        notes: notes.join('; '),
        session: sessionName,
      });
    }

    if (ts != null) lastTs = ts;
  }
}

// ---- bucket by F-number and write run.jsonl files ----
const byF: Record<string, CallRecord[]> = {};
for (const r of allRecords) {
  if (onlyF && r.f_number !== onlyF) continue;
  (byF[r.f_number] ||= []).push(r);
}

let written = 0;
for (const [f, records] of Object.entries(byF)) {
  records.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const dir = path.join(AUDIT_DIR, f);
  fs.mkdirSync(dir, { recursive: true });
  const out = records.map((r) => JSON.stringify(r)).join('\n') + '\n';
  fs.writeFileSync(path.join(dir, 'run.jsonl'), out);
  written++;
  console.log(`  ${f}: ${records.length} calls -> ${path.relative(AUDIT_DIR, path.join(dir, 'run.jsonl'))}`);
}

// dedupe + persist segmentation ambiguities for the report's notes section
const uniqAmbig = Array.from(new Set(ambiguities)).sort();
fs.writeFileSync(
  path.join(AUDIT_DIR, 'segmentation-notes.json'),
  JSON.stringify(uniqAmbig, null, 2),
);

console.log(
  `\nCollected ${allRecords.length} calls across ${written} F-bucket(s); ` +
    `${uniqAmbig.length} segmentation ambiguities logged.`,
);
