---
name: implement
description: Implement an approved development workflow task list in the current repository, reusing existing conventions and validating changes incrementally.
---

# Implement

Read:

- `spec.md`
- `design.md`
- `tasks.md`

## Rules

1. Implement the approved tasks in order.
2. Inspect existing code before editing.
3. Reuse established project patterns.
4. Keep changes scoped to the specification.
5. Do not rewrite unrelated code.
6. After each meaningful group of changes, run the most relevant available checks.
7. If an implementation detail conflicts with the approved design, stop and explain the conflict instead of silently changing the architecture.
8. Update `workflow.json` as implementation progresses.

## Completion

Before handing off to Review:

- inspect the final diff;
- run available tests, type checks, lint, or build checks relevant to the changed code;
- record failures and their cause honestly.

Then ask to continue to Review.
