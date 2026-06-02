// Shared helpers for the pipeline telemetry tools.
// No external deps — fs/path/os only.
import * as os from 'os';
import * as path from 'path';

export const PROJECT_DIR = path.join(
  os.homedir(),
  '.claude',
  'projects',
  '-Users-don-Projects-community',
);
export const AUDIT_DIR = __dirname;

// One telemetry record per Claude API call. Mirrors the JSONL schema in _audit/README.md.
export interface CallRecord {
  timestamp: string;
  f_number: string;
  skill: string | null;
  parent_skill: string | null;
  surface: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
  duration_ms: number;
  request_id: string;
  is_sidechain: boolean;
  notes: string;
  // attribution context — not part of the required schema but handy for reports
  session: string;
}

// Current Claude pricing, USD per 1M tokens (Jan 2026). Keyed by model family.
// cache_write priced at the 5-minute ephemeral rate (1.25× input); cache_read at 0.1× input.
interface Price {
  input: number;
  output: number;
  cache_write: number;
  cache_read: number;
}
const PRICING: Record<string, Price> = {
  opus: { input: 15, output: 75, cache_write: 18.75, cache_read: 1.5 },
  sonnet: { input: 3, output: 15, cache_write: 3.75, cache_read: 0.3 },
  haiku: { input: 1, output: 5, cache_write: 1.25, cache_read: 0.1 },
};

export function priceFor(model: string): Price {
  const m = (model || '').toLowerCase();
  if (m.includes('opus')) return PRICING.opus;
  if (m.includes('haiku')) return PRICING.haiku;
  if (m.includes('sonnet')) return PRICING.sonnet;
  return PRICING.opus; // default to most expensive — conservative estimate
}

export function costOf(r: {
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
}): number {
  const p = priceFor(r.model);
  return (
    (r.input_tokens * p.input +
      r.output_tokens * p.output +
      r.cache_creation_input_tokens * p.cache_write +
      r.cache_read_input_tokens * p.cache_read) /
    1_000_000
  );
}

export function totalTokens(r: {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
}): number {
  return (
    r.input_tokens +
    r.output_tokens +
    r.cache_creation_input_tokens +
    r.cache_read_input_tokens
  );
}

export function fmtUSD(n: number): string {
  return '$' + n.toFixed(n < 1 ? 4 : 2);
}

export function fmtInt(n: number): string {
  return n.toLocaleString('en-US');
}

export function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)} s`;
  const m = Math.floor(s / 60);
  return `${m}m ${Math.round(s % 60)}s`;
}

export function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Skill → which tool it runs in (the hard firewall from CLAUDE.md).
const COWORK_SKILLS = new Set([
  'orient', 'explore', 'scope', 'weigh', 'review', 'memo', 'tidy', 'loop-designer',
]);
const CLAUDE_CODE_SKILLS = new Set(['atomize', 'ticket', 'test', 'build']);

export function isPluginSkill(skill: string): boolean {
  return skill.includes(':'); // engineering:code-review, design:accessibility-review, etc.
}

// Surface for a pipeline skill; plugin/M-gate skills inherit their parent's surface.
export function surfaceForSkill(skill: string | null, entrypoint: string): string {
  if (skill && CLAUDE_CODE_SKILLS.has(skill)) return 'claude-code';
  if (skill && COWORK_SKILLS.has(skill)) return 'cowork';
  // fall back to entrypoint: claude-desktop is the Cowork surface
  if (entrypoint && entrypoint.includes('desktop')) return 'cowork';
  if (entrypoint && entrypoint.includes('code')) return 'claude-code';
  return 'claude-code';
}

export function readJsonl<T = any>(text: string): T[] {
  const out: T[] = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    try {
      out.push(JSON.parse(t));
    } catch {
      // skip malformed lines
    }
  }
  return out;
}
