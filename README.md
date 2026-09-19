# dsh-dev-workflow

A Skill-based development workflow plugin for DeepSeek Harness.

The plugin uses DSH's native Skill system as the primary workflow surface. It does not introduce a second workflow engine or custom state-machine runtime.

## Workflow

```text
Specify → Design → Tasks → Implement → Review
```

Each stage has a dedicated Skill and writes project-local artifacts:

```text
.dev/
└── workflows/
    └── <workflow-id>/
        ├── workflow.json
        ├── artifacts/
        │   ├── spec.md
        │   ├── design.md
        │   └── tasks.md
        └── findings/
            └── review.json
```

Human decision points happen between agent turns:

```text
Specify
  ↓
spec.md
  ↓
User: continue / revise
  ↓
Design
  ↓
design.md
  ↓
User: continue / revise
  ↓
Tasks
  ↓
tasks.md
  ↓
User: continue / revise
  ↓
Implement
  ↓
code + checks
  ↓
User: continue to review
  ↓
Review
  ↓
findings
  ↓
User: fix selected / skip selected
```

A native DSH Workflow run should not be held open waiting for browser approval. The durable business state lives in `.dev/workflows/<workflow-id>/workflow.json`, while DSH Workflow remains an execution/orchestration capability used inside a stage when appropriate.

## Plugin structure

```text
dsh-dev-workflow/
├── package.json
├── cordis.patch.yml
├── index.js
├── README.md
└── skills/
    ├── dev-workflow/
    │   └── SKILL.md
    ├── specify/
    │   └── SKILL.md
    ├── design/
    │   └── SKILL.md
    ├── tasks/
    │   └── SKILL.md
    ├── implement/
    │   └── SKILL.md
    └── review/
        └── SKILL.md
```

The bundle registers `@deepseek-ai/dsh-skill-filesystem` with the packaged Skill directory. This follows the Skill-only DSH bundle pattern used by existing open-source integrations.

## Local development

Assuming:

```text
~/project/
├── deepseek-harness/
└── dsh-dev-workflow/
```

Build the Harness first:

```bash
cd ~/project/deepseek-harness
pnpm install
pnpm run build
```

Create a Web-based custom profile:

```bash
pnpm dsh --profile dev-workflow-demo --from-default-profile web
```

Install the local bundle:

```bash
pnpm dsh plugin --profile dev-workflow-demo add ../dsh-dev-workflow
```

Inspect the composed configuration:

```bash
pnpm dsh --profile dev-workflow-demo --dump-config
```

Then start:

```bash
pnpm dsh --profile dev-workflow-demo --no-open
```

## First test

Open the Web UI and ask:

> 开始开发一个 Modal 组件，需要支持 loading 和 error 两种状态。

The expected first turn is:

1. DSH discovers `dev-workflow`.
2. The Skill creates a workflow directory.
3. `specify` is loaded.
4. `spec.md` is created.
5. The agent summarizes the specification and waits for the user's next instruction.

Then send:

> 继续

The workflow should load `design`, create `design.md`, and wait again.

To revise instead, send something like:

> 修改一下，Modal 还需要支持关闭动画。

The current stage should be revised instead of advancing.

## Design principles

- **Skills are the workflow instructions.**
- **DSH Workflow is orchestration, not persistent business state.**
- **The filesystem is the initial artifact/state boundary.**
- **Human decisions happen across agent turns.**
- **Subagents are used only where they materially improve a stage.**
- **Custom Web UI is a later phase, not an MVP dependency.**

## Roadmap

### Phase 1 — Skill workflow

- Specify
- Design
- Tasks
- Implement
- Review
- Project-local state
- User-controlled continuation/revision

### Phase 2 — Native DSH UI integration

Add Conversation Node definitions for richer stage cards and actions such as:

- Continue
- Revise
- Fix selected findings
- Skip selected findings

This phase should build on DSH's conversation/session event model instead of creating a parallel frontend protocol.
