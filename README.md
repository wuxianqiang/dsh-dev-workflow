# dsh-dev-workflow

A minimal proof-of-concept development workflow plugin for DeepSeek Harness.

## What this demo validates

The plugin intentionally keeps the scope small:

1. Exposes a `dev_workflow` model-facing tool.
2. Starts a native DSH `ctx.workflowEngine` run.
3. Runs two workflow phases:
   - Specify
   - Design
4. Uses two subagents through the native workflow `agent()` hook.
5. Returns the final structured workflow result to the parent agent.

It does **not** implement persistence, approvals, Tasks, Implement, Review, or custom UI yet.

## Install from GitHub

Create or use a DSH profile and install the bundle:

```bash
dsh plugin --profile demo add github:wuxianqiang/dsh-dev-workflow
```

Then start the Web UI:

```bash
dsh --profile demo web
```

Ask the agent something concrete, for example:

> Start the development workflow for adding a modal component with loading and error states.

The agent should call `dev_workflow`, and the Web UI should show the workflow run with Specify and Design phases.

## Local development

From a local checkout:

```bash
dsh plugin --profile demo add ./dsh-dev-workflow
```

Or, when running a DSH source checkout, the same plugin can be loaded through a patch during development.

## Next steps

The intended evolution is:

```text
Goal
  |
  v
Specify
  |
  v
Design
  |
  v
Tasks
  |
  v
Implement
  |
  v
Review
```

The next iteration should add project-local state/checkpoints and human decision points rather than making every stage a mandatory approval gate.
