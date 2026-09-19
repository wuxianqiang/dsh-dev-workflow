---
name: design
description: Design the implementation for an approved software specification, including architecture, module boundaries, data flow, APIs, state management, error handling, and alternatives.
---

# Design

Read the current `spec.md` before designing.

Create or revise:

`.dev/workflows/<workflow-id>/artifacts/design.md`

## Process

1. Inspect the repository and identify existing conventions that should be reused.
2. Map requirements to implementation boundaries.
3. Define:
   - architecture
   - module responsibilities
   - data flow
   - API or interface changes
   - state management
   - error and edge-case handling
   - testing strategy
4. Prefer the smallest design that satisfies the specification.
5. Do not introduce infrastructure without a concrete requirement.
6. When two or more boundaries are genuinely viable and the repository does not resolve the choice, present the alternatives with concrete trade-offs and ask the user to choose.

## Output

The artifact should contain:

- Design Overview
- Architecture / Module Boundaries
- Data Flow
- Interfaces / APIs
- State and Error Handling
- Testing Strategy
- Alternatives and Decision
- Open Questions

Do not start Tasks until the design is accepted.
