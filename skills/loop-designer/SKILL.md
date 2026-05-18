---
name: loop-designer
description: Translate a vague "I want this to improve itself" idea into a runnable self-improvement loop spec, project-agnostic. Use when the user describes a system that could optimize itself (pricing, ranking, matching, classification, routing, fraud detection, prompt or harness tuning), mentions iteration cycles being too slow for humans, references the Karpathy Loop / auto-agent / meta-agent / local hard takeoff ideas, or says "this should keep getting better on its own." Forces concrete answers to the four components — Loop, Harness, Bounded Domain, Observability — and refuses to ship the spec until four hard gates pass. Produces a Loop Spec document; does not write the agent.
---

# loop-designer

Project-agnostic loop architect. Converts "this should improve itself" into a concrete Loop Spec a build agent can implement.

Grounded in four ideas (from Karpathy's auto-research loop, meta-agent harness engineering, local hard takeoff, and trace-driven evals): a loop needs **one editable surface, one scored metric, a meta/task split, and a trace substrate** — or it doesn't actually loop, it just runs.

## When to use
- User describes a recurring optimization (pricing, ranking, matching, routing, prompts).
- User mentions a manual cycle that humans can't keep up with.
- User wants an agent to tune another agent (prompt-eng, tool-choice, orchestration).
- User says "compounding," "improve over time," "self-tuning," "auto-prompt," "meta-agent."

Do not use for: one-shot generations, deterministic pipelines, anything without a quality signal.

## Hard gates (refuse to deliver the spec until each passes)

**G1 — One objective metric.** Numeric, automatable, no human judgment in the inner loop. "Better matches" fails. "Vendor-click rate per consumer search, 7-day window" passes.

**G2 — Bounded editable surface.** One file, one config, one prompt, one heuristic table. If anything can change, nothing can be attributed.

**G3 — Scoring function before agent.** The eval harness exists and runs on a fixed benchmark set *before* the optimizing agent is built. You cannot automate what you cannot score.

**G4 — Meta/task pairing decided.** Default same-model on both sides (model-empathy effect). Cross-model requires a stated reason.

If a gate can't pass, stop. Surface the gap to the user, do not paper over it.

## Workflow

Walk the user through the four components in order. Refuse to skip ahead.

### 1. The Loop (Karpathy core)
- **Editable surface**: which exact file/config/prompt does the agent touch? (One.)
- **Metric**: what number moves? Direction? Measurement window?
- **Time budget**: how long is one experiment? (Bounded — minutes, not days.)
- **Commit/revert rule**: when does a change stick? Threshold? Statistical significance?

### 2. The Harness
- **Task agent**: job, tools, prompt surface.
- **Meta-agent**: what does it read (failure traces, not just outcomes), what does it edit (the harness, not the task).
- **Pairing**: same model or cross-model? If cross, why?

### 3. The Bounded Domain (local hard takeoff)
- **Boundary**: where does the loop's authority end? Be explicit — pricing engine yes, pricing strategy no.
- **Compounding mechanism**: how does iteration N make iteration N+1 cheaper or better? (If it doesn't, it's not a takeoff, it's a treadmill.)
- **Human-speed baseline**: current manual cycle time.
- **Agent-speed target**: target cycle time. The gap is the moat.

### 4. Observability Substrate
- **Trace schema**: what's captured per run beyond the outcome? Reasoning steps, tool calls, intermediate decisions.
- **Eval harness**: where do experiments run safely? What's the benchmark set? How is it versioned?
- **Scoring function**: the code that turns a trace into a number. This is G3.

Then run the gates explicitly. Then produce the spec.

## Output template

Produce exactly this, filled in. No preamble.

```markdown
# Loop Spec: <domain or project name>

## 1. Loop
- Editable surface: <single file/config/prompt path>
- Metric: <name + direction + window>
- Time budget per experiment: <minutes>
- Commit rule: <when a change sticks>

## 2. Harness
- Task agent: <role + tools + prompt source>
- Meta-agent: <what it reads, what it edits>
- Pairing: <same-model | cross-model + reason>

## 3. Bounded domain
- Boundary: <what the loop may touch / what it may not>
- Compounding mechanism: <how N improves N+1>
- Baseline (human-speed cycle): <duration>
- Target (agent-speed cycle): <duration>

## 4. Observability
- Trace schema: <fields captured per run>
- Eval harness: <sandbox + benchmark set + versioning>
- Scoring function: <function name + path>

## Gates
- [ ] G1 single objective metric
- [ ] G2 bounded editable surface
- [ ] G3 scoring function exists and runs
- [ ] G4 meta/task pairing decided

## Open risks
- <one-line risk + mitigation, max 3>
```

## Constraints (hard)
- Do not write the task agent, meta-agent, or scoring function. That is a build task.
- Do not accept compound metrics. One loop, one metric. Parallel loops if more is needed.
- Do not let "the user is in a hurry" justify skipping G3. Hurry is why the gate exists.
- Do not propose cross-model pairings without a stated reason — same-model is the default.
- Do not mistake "we'll observe outcomes" for trace infrastructure. Traces capture *why*, not *what*.

## Hand off

**Produced:** a single Loop Spec markdown document. Hand to a build agent (or to `pipeline-ticket` if the project uses a ticket pipeline) for implementation.

**The build agent expects:** all four gates checked, the scoring function referenced as existing code (not as a TODO), the editable surface specified as a real path.

## Related concepts
- **Karpathy Loop** — minimalist auto-research: one file, one metric, fixed time budget.
- **Meta-agent / task-agent split** — the meta-agent edits the harness; the task agent does the work.
- **Model empathy** — same-model meta/task pairings outperform cross-model.
- **Local hard takeoff** — bounded-domain compounding improvement, faster than the org's manual cycle.
- **Trace infrastructure** — captures reasoning trajectories, not just outcomes. Prerequisite to a meta-agent that can diagnose.
