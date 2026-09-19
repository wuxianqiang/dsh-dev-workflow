---
name: tasks
description: Convert an approved software design into an ordered, implementation-ready task list with file targets, dependencies, validation, and completion criteria.
---

# Tasks

Read `spec.md` and `design.md`.

Create or revise:

`.dev/workflows/<workflow-id>/artifacts/tasks.md`

## Rules

1. Every task must have a concrete outcome.
2. Identify likely files or directories to change.
3. Keep tasks ordered by dependency.
4. Include validation for each meaningful implementation group.
5. Avoid vague tasks such as "finish frontend" or "handle backend".
6. Separate implementation tasks from verification tasks.
7. Do not implement code in this stage.

## Output

Use:

```markdown
# Tasks

## 1. <task>
- Files:
- Changes:
- Dependencies:
- Validation:

## 2. <task>
...
```

After the artifact is complete, ask the user whether to proceed to implementation.
