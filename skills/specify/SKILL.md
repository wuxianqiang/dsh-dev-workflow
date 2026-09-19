---
name: specify
description: Turn a software development request into a concrete, testable specification with scope, requirements, constraints, acceptance criteria, and unresolved questions.
---

# Specify

Create or revise:

`.dev/workflows/<workflow-id>/artifacts/spec.md`

## Process

1. Read the user's request.
2. Inspect the repository only as needed to understand existing structure and constraints.
3. Separate:
   - goal
   - in-scope behavior
   - out-of-scope behavior
   - functional requirements
   - non-functional requirements
   - constraints
   - acceptance criteria
   - open questions
4. Do not invent product requirements that the user did not imply.
5. If an important requirement is ambiguous, record it as an open question instead of silently choosing.
6. Make acceptance criteria observable and testable.

## Output

The artifact should be concise and structured:

- Goal
- Scope
- Requirements
- Constraints
- Acceptance Criteria
- Open Questions

After writing the artifact, summarize the important decisions to the user. Do not start Design until the user continues.
