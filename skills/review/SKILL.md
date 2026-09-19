---
name: review
description: Review an implementation against its specification and design, identify actionable findings, and let the user selectively fix or skip findings.
---

# Review

Read:

- `spec.md`
- `design.md`
- `tasks.md`
- the current implementation and diff

Review at minimum:

- correctness
- specification coverage
- architecture / maintainability
- stability / error handling
- performance where relevant
- security where relevant
- tests and validation

## Findings

Write:

`.dev/workflows/<workflow-id>/findings/review.json`

Use this shape:

```json
{
  "workflowId": "<workflow-id>",
  "findings": [
    {
      "id": "R001",
      "severity": "high|medium|low",
      "category": "correctness|architecture|stability|performance|security|testing",
      "file": "relative/path",
      "line": 1,
      "title": "Short title",
      "problem": "What is wrong or risky",
      "recommendation": "Concrete fix",
      "status": "pending"
    }
  ]
}
```

## Decision loop

If there are findings:

1. Show the findings grouped by severity.
2. Ask the user which findings to fix or skip.
3. Fix only the selected findings.
4. Re-run the relevant checks.
5. Re-review affected areas.
6. Update each finding's status to `fixed` or `skipped`.

Do not silently fix every finding.

If there are no findings, state that the reviewed scope has no identified issues and mark the workflow completed.
