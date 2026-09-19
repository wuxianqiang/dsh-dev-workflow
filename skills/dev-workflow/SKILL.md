---
name: dev-workflow
description: Orchestrate a structured software development workflow from requirement clarification through specification, design, tasks, implementation, and review. Use when the user asks to develop, modify, or implement a non-trivial software feature and wants a repeatable engineering process.
---

# Development Workflow

Use this Skill as the entry point for the development workflow:

`Specify → Design → Tasks → Implement → Review`

The workflow is intentionally built on DSH native Skills and agent capabilities. Do not create a second workflow engine, custom state machine, or custom CLI command.

## Core rules

1. Work inside the current project.
2. Persist workflow artifacts under:
   `.dev/workflows/<workflow-id>/`
3. Keep a small `workflow.json` in that directory as business state.
4. Each stage has one purpose and one artifact.
5. Do not silently skip a stage.
6. After completing a planning stage, summarize the result and wait for the user's next instruction before starting the next stage.
7. A user can revise the current stage instead of continuing.
8. If the user asks to continue, resume from the next incomplete stage.
9. If the user asks to revise, update the current stage artifact and remain at that stage.
10. Never treat the DSH Workflow Engine's internal run state as persistent business state.

## Workflow directory

Create:

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

Use a short stable workflow id derived from the feature request, for example `add-modal-component`.

Initial `workflow.json`:

```json
{
  "id": "<workflow-id>",
  "status": "in-progress",
  "currentStage": "specify",
  "artifacts": {}
}
```

Update it whenever a stage is completed or the current stage changes.

## Stage selection

When the user starts a new development request:

1. Check whether a matching active workflow exists under `.dev/workflows/`.
2. If one exists, inspect its `workflow.json` and artifacts before creating a new workflow.
3. Otherwise create a new workflow directory and begin Specify.
4. Load only the Skill needed for the current stage:
   - `specify`
   - `design`
   - `tasks`
   - `implement`
   - `review`

Do not load all stage Skills unnecessarily.

## Stage transitions

### Specify → Design

After `spec.md` is complete:

- update `workflow.json` to `currentStage: "design"` only when the user chooses to continue;
- if the user requests changes, keep `currentStage: "specify"` and revise `spec.md`;
- otherwise ask the user whether to continue or revise.

### Design → Tasks

Design may produce multiple viable approaches. If the boundary or architecture cannot be decided from the request and repository evidence, present the alternatives and ask the user to choose or revise.

Do not force a design choice just to keep the workflow moving.

### Tasks → Implement

Only begin implementation after the task list is sufficiently concrete. Implementation should use the repository's existing conventions rather than introducing unnecessary infrastructure.

### Implement → Review

After implementation, verify the changed files and run the most relevant available checks before review.

### Review → Complete

Review findings must be actionable. For each finding, preserve whether it is pending, fixed, or skipped.

If findings exist, ask the user which findings to fix or skip. Do not automatically modify code for every finding.

## Native DSH capabilities

Use DSH's native capabilities where they provide value:

- Skills for stage instructions.
- Subagents for isolated analysis or parallel review work.
- Workflow Engine for bounded fan-out/orchestration inside a stage when useful.
- Normal agent turns for human decision points.

Do not block a native Workflow Engine run waiting for a browser approval. Human approval is represented by the next agent turn.

## First response behavior

For a new request, do not dump the entire workflow plan and then execute every stage automatically.

Start Specify, produce `spec.md`, report the key decisions, and ask the user whether to continue or revise.

## Resume behavior

When the user says things such as:

- "继续"
- "继续下一步"
- "没问题"
- "按这个方案做"

continue from `workflow.json.currentStage`.

When the user says:

- "修改一下"
- "这个方案不对"
- "重新设计"

revise the current stage rather than advancing.

When the user asks to skip a stage, explain what artifact or guarantee would be lost and only skip if the user explicitly confirms.

## Completion

A completed workflow has:

```json
{
  "status": "completed",
  "currentStage": "review",
  "artifacts": {
    "spec": ".dev/workflows/<id>/artifacts/spec.md",
    "design": ".dev/workflows/<id>/artifacts/design.md",
    "tasks": ".dev/workflows/<id>/artifacts/tasks.md",
    "review": ".dev/workflows/<id>/findings/review.json"
  }
}
```
