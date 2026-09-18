# dsh-dev-workflow

A minimal proof-of-concept development workflow plugin for DeepSeek Harness.

## What this demo validates

The plugin intentionally keeps the scope small:

1. Exposes a `dev_workflow` model-facing tool.
2. Uses the native DSH `ctx.workflowEngine` service.
3. Runs two workflow phases:
   - Specify
   - Design
4. Uses two subagents through the native workflow `agent()` hook.
5. Returns the final structured workflow result to the parent agent.

The bundle also re-enables the Web profile's optional `workflow-ptc` engine because the shipped Web composition disables that capability by default.

It does **not** implement persistence, approvals, Tasks, Implement, Review, or custom UI yet.

## Important: profile selection

A DSH **bundle** and a DSH **profile** are different things.

Running:

```bash
pnpm dsh plugin --profile demo add ../dsh-dev-workflow
```

creates a new `demo` profile from the base bundle. It does **not** create a Web profile.

For Web testing, create a custom profile from the shipped Web template first:

```bash
pnpm dsh --profile dev-workflow-demo --from-default-profile web
```

Then install this bundle into that profile:

```bash
pnpm dsh plugin --profile dev-workflow-demo add ../dsh-dev-workflow
```

Restart the profile after installation:

```bash
pnpm dsh --profile dev-workflow-demo --no-open
```

The Web UI should be available at:

```text
http://127.0.0.1:3080
```

This follows the current DSH profile/bundle model: `--from-default-profile web` copies the shipped Web bundle stack into a new custom profile, while `dsh plugin` manages additional bundles in that profile. citeturn9search0turn9search3

## Local development

From a local DSH source checkout:

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

Create the Web-based test profile:

```bash
pnpm dsh --profile dev-workflow-demo --from-default-profile web
```

Install the local plugin:

```bash
pnpm dsh plugin --profile dev-workflow-demo add ../dsh-dev-workflow
```

Inspect the composed configuration before booting:

```bash
pnpm dsh --profile dev-workflow-demo --dump-config
```

You should find both:

```text
workflow-ptc
dsh-dev-workflow
```

Then start:

```bash
pnpm dsh --profile dev-workflow-demo --no-open
```

The current DSH documentation recommends this custom-profile flow for testing a bundle against the Web surface. A successful bundle installation is added to the profile's `dsh.profile.bundles` list, and the profile must be restarted after bundle installation. citeturn9search0turn9search7

## Test the workflow

Open the Web UI and ask:

> 开始开发一个 Modal 组件，需要支持 loading 和 error 两种状态。

The expected flow is:

```text
Agent
  |
  | dev_workflow
  v
Workflow Engine
  |
  +--> Specify
  |      |
  |      +--> agent()
  |
  +--> Design
         |
         +--> agent()
  |
  v
Structured result
  ├── goal
  ├── spec
  └── design
```

The workflow engine contract is the native DSH `ctx.workflowEngine` seam; `parent` must be the calling agent, and the run should be awaited and disposed by the consumer. citeturn3search0

## Why the Web profile needs the engine patch

The shipped Web bundle deliberately disables `workflow-ptc` and `tool-workflow` at the Web host layer. The current workflow architecture uses:

```text
workflow
   ^
   | service definition
workflow-ptc
   ^
   | ctx.workflowEngine
tool-workflow / custom workflow consumers
```

The current DSH workflow implementation uses `workflow-ptc` as the engine and exposes it through `ctx.workflowEngine`. citeturn5search0turn5search6

Therefore this plugin's bundle patch explicitly restores `workflow-ptc` before registering `dsh-dev-workflow`.

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
