#!/usr/bin/env tsx
// Transcript-parsing collector.
// Reads Claude Code transcript JSONL files, segments by Skill tool-call markers,
// attributes each Claude API call to an F-number + skill + surface, and writes
// _audit/F###/run.jsonl (one record per call).
//
// Attribution is SEGMENT-LEVEL (two-pass per file). Each top-level Skill marker opens
// a segment; per segment we collect the strongest local F-signal:
//   high   — F### in the Skill's args
//   high   — a single scenario-F###/review-F### file referenced in the segment
//   medium — the segment-local dominant F (the F most-mentioned inside this segment)
//   low    — the session-dominant F (most-mentioned across the whole transcript)
//   none   — no signal -> bucketed as "unattributed" (we do NOT guess)
//
// Usage:
//   tsx collect.ts                       # scan every transcript, bucket by F-number
//   tsx collect.ts --f F035              # only write the F035 bucket (still scans all)
//   tsx collect.ts --sessions a.jsonl,b.jsonl   # restrict input to named session files
//   tsx collect.ts --exclude 9b5e64d7    # drop session(s) whose filename matches (comma-sep)
//
// Re-runnable: overwrites existing run.jsonl for every F-number it emits.
//
// NOTE on self-attribution: the collector scans the live project transcript dir, which
// includes any in-progress session. A session doing audit/tooling work mentions feature
// F-numbers heavily and would be session-dominant-attributed to whichever feature it
// references most. Use --exclude to drop the audit's own session from a backfill snapshot.

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
// scenario-F###-… and review-F### file references are the strongest non-arg signal
// that a segment is *about* a given feature.
const SCENARIO_RE = /(?:scenario|review)-(F0\d{2})/g;
const args = process.argv.slice(2);

function flag(name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

const onlyF = flag('--f');
const sessionFilter = flag('--sessions')?.split(',').map((s) => s.trim());
const excludeFilter = flag('--exclude')?.split(',').map((s) => s.trim()).filter(Boolean);

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
  let out = files;
  if (sessionFilter) {
    out = out.filter((f) => sessionFilter.some((s) => f.includes(s)));
  }
  if (excludeFilter) {
    out = out.filter((f) => !excludeFilter.some((s) => f.includes(s)));
  }
  return out;
}

// Pull all visible text out of a transcript record (for F-number detection).
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

function countF(s: string, into: Record<string, number>): void {
  for (const f of s.match(F_RE) || []) into[f] = (into[f] || 0) + 1;
}

function top1(counts: Record<string, number>): [string, number] | null {
  const e = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return e.length ? (e[0] as [string, number]) : null;
}

interface Segment {
  skill: string | null;
  skillArgsF: string | null;
  scenarioF: string | null; // single clear scenario/review file F in this segment
  localCounts: Record<string, number>;
}

interface Resolved {
  f: string;
  confidence: string;
  basis: string;
}

// Resolve a segment's F-number with a confidence tier. Never guesses past `low`.
function resolveSegment(
  seg: Segment,
  sessionDom: [string, number] | null,
): Resolved {
  if (seg.skillArgsF) {
    return { f: seg.skillArgsF, confidence: 'high', basis: 'skill-args' };
  }
  if (seg.scenarioF) {
    return { f: seg.scenarioF, confidence: 'high', basis: 'scenario/review-file' };
  }
  const local = top1(seg.localCounts);
  if (local) {
    const total = Object.values(seg.localCounts).reduce((a, b) => a + b, 0);
    const distinct = Object.keys(seg.localCounts).length;
    if (distinct === 1) {
      return { f: local[0], confidence: 'medium', basis: 'segment-sole-mention' };
    }
    if (local[1] >= 2 && local[1] / total > 0.5) {
      return { f: local[0], confidence: 'medium', basis: 'segment-dominant' };
    }
  }
  if (sessionDom && sessionDom[1] >= 3) {
    return { f: sessionDom[0], confidence: 'low', basis: 'session-dominant' };
  }
  return { f: 'unattributed', confidence: 'none', basis: 'no-local-or-session-signal' };
}

const ambiguities: string[] = [];
const allRecords: CallRecord[] = [];
const driftNotes: string[] = [];

for (const file of listTranscripts()) {
  const isSubagent = file.includes(path.join('subagents', ''));
  const sessionName =
    path.basename(path.dirname(file)) === path.basename(PROJECT_DIR)
      ? path.basename(file, '.jsonl')
      : `${path.basename(path.dirname(path.dirname(file)))}/${path.basename(file, '.jsonl')}`;

  const raw = fs.readFileSync(file, 'utf8');
  const recs = readJsonl(raw);
  if (!recs.length) continue;

  // ---- schema-drift probe (surfaced in the report, never auto-fixed) ----
  let usageRecs = 0;
  let usageMissingReqId = 0;
  let usageMissingModel = 0;
  let usageMissingTs = 0;
  for (const r of recs as any[]) {
    if (r?.type === 'assistant' && r?.message?.usage) {
      usageRecs++;
      if (!r.requestId) usageMissingReqId++;
      if (!r.message.model) usageMissingModel++;
      if (!r.timestamp) usageMissingTs++;
    }
  }
  if (usageMissingReqId || usageMissingModel || usageMissingTs) {
    driftNotes.push(
      `[${sessionName}] ${usageRecs} usage-bearing turns; missing fields: ` +
        `requestId×${usageMissingReqId}, model×${usageMissingModel}, timestamp×${usageMissingTs} ` +
        `(parsed anyway, defaulted)`,
    );
  }

  // ---- PASS 1: segment the transcript and collect per-segment F-signals ----
  const segments: Segment[] = [{ skill: null, skillArgsF: null, scenarioF: null, localCounts: {} }];
  const recSeg: number[] = new Array(recs.length).fill(0);
  let segIdx = 0;
  const sessionCounts: Record<string, number> = {};

  for (let i = 0; i < recs.length; i++) {
    const rec: any = recs[i];
    const txt = textOf(rec);
    countF(txt, sessionCounts);

    // a top-level (non-plugin) Skill marker opens a new segment
    if (rec?.type === 'assistant' && Array.isArray(rec?.message?.content)) {
      for (const b of rec.message.content) {
        if (b?.type === 'tool_use' && b?.name === 'Skill') {
          const skill: string = b.input?.skill || b.input?.command || 'unknown';
          if (!isPluginSkill(skill)) {
            segments.push({ skill, skillArgsF: null, scenarioF: null, localCounts: {} });
            segIdx = segments.length - 1;
            const argText = [b.input?.args, b.input?.command].filter(Boolean).join(' ');
            segments[segIdx].skillArgsF = firstF(argText);
          }
        }
      }
    }

    recSeg[i] = segIdx;
    const seg = segments[segIdx];
    countF(txt, seg.localCounts);
    // scenario/review file references inside this segment
    for (const m of txt.matchAll(SCENARIO_RE)) {
      (seg as any)._scen ||= {};
      (seg as any)._scen[m[1]] = ((seg as any)._scen[m[1]] || 0) + 1;
    }
  }

  // finalize scenarioF per segment: only a SINGLE clearly-dominant scenario/review file
  // counts as a high-confidence signal (a backlog scan that reads many is NOT "about" one F)
  for (const seg of segments) {
    const scen: Record<string, number> | undefined = (seg as any)._scen;
    if (scen) {
      const e = Object.entries(scen).sort((a, b) => b[1] - a[1]);
      if (e.length === 1) seg.scenarioF = e[0][0];
      else if (e.length > 1 && e[0][1] > e[1][1] * 2) seg.scenarioF = e[0][0]; // one dominates 2:1
    }
  }

  const sessionDom = top1(sessionCounts);

  // ---- PASS 2: emit one record per usage-bearing assistant turn ----
  const stack: { skill: string; isPlugin: boolean }[] = [];
  let lastTs: number | null = null;

  for (let i = 0; i < recs.length; i++) {
    const rec: any = recs[i];
    const ts = rec?.timestamp ? Date.parse(rec.timestamp) : null;

    // maintain the skill stack for skill / parent_skill / surface
    if (rec?.type === 'assistant' && Array.isArray(rec?.message?.content)) {
      for (const b of rec.message.content) {
        if (b?.type === 'tool_use' && b?.name === 'Skill') {
          const skill: string = b.input?.skill || b.input?.command || 'unknown';
          if (isPluginSkill(skill)) {
            const parent = [...stack].reverse().find((s) => !s.isPlugin);
            stack.push({ skill, isPlugin: true });
            ambiguities.push(
              `[${sessionName}] nested skill "${skill}" fired inside "${
                parent?.skill ?? 'none'
              }" (M-gate) — attributed as sidechain of parent`,
            );
          } else {
            stack.length = 0;
            stack.push({ skill, isPlugin: false });
          }
        }
      }
    }

    if (rec?.type === 'assistant' && rec?.message?.usage) {
      const u = rec.message.usage;
      const topEntry = stack[stack.length - 1] ?? null;
      const pipeline = [...stack].reverse().find((s) => !s.isPlugin) ?? null;
      const skill = topEntry?.skill ?? null;
      const parent_skill = topEntry?.isPlugin ? pipeline?.skill ?? null : null;

      const seg = segments[recSeg[i]];
      const resolved = resolveSegment(seg, sessionDom);

      const entrypoint = rec.entrypoint || '';
      const surface = topEntry?.isPlugin
        ? surfaceForSkill(parent_skill, entrypoint)
        : surfaceForSkill(skill, entrypoint);

      let duration_ms = 0;
      if (ts != null && lastTs != null) duration_ms = Math.max(0, ts - lastTs);

      const notes: string[] = [];
      notes.push(`attribution: ${resolved.confidence} (${resolved.basis})`);
      if (resolved.confidence === 'low') {
        notes.push(`session-dominant fallback (${sessionDom?.[0]}) — low confidence`);
      }
      if (!skill) notes.push('no active skill segment — raw conversation / pre-skill turn');
      if (topEntry?.isPlugin) notes.push(`nested M-gate skill under "${parent_skill}"`);
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
        f_number: resolved.f,
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
        attribution_confidence: resolved.confidence,
        attribution_basis: resolved.basis,
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
  const conf = records.reduce(
    (acc, r) => ((acc[r.attribution_confidence] = (acc[r.attribution_confidence] || 0) + 1), acc),
    {} as Record<string, number>,
  );
  const confStr = Object.entries(conf)
    .map(([k, v]) => `${k}:${v}`)
    .join(' ');
  console.log(`  ${f}: ${records.length} calls [${confStr}]`);
}

// dedupe + persist segmentation ambiguities + drift notes for the reports
const uniqAmbig = Array.from(new Set(ambiguities)).sort();
fs.writeFileSync(
  path.join(AUDIT_DIR, 'segmentation-notes.json'),
  JSON.stringify(uniqAmbig, null, 2),
);
fs.writeFileSync(
  path.join(AUDIT_DIR, 'drift-notes.json'),
  JSON.stringify(Array.from(new Set(driftNotes)).sort(), null, 2),
);

console.log(
  `\nCollected ${allRecords.length} calls across ${written} F-bucket(s); ` +
    `${uniqAmbig.length} segmentation ambiguities, ${driftNotes.length} drift note(s) logged.`,
);
