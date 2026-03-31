# Canonical Test Patterns and AI Agent Scoping in a Monorepo

A senior frontend engineer on our team recently merged a PR that quietly addressed two things at once: tightening component testing conventions, and telling AI coding agents how to behave in different parts of the repo. I found it worth writing up because the combination is more intentional than it might look.

---

## Part 1: AGENTS.md — Scoping AI Instructions Per Directory

The PR added `AGENTS.md` files at three levels of the repository. These are instruction files read by AI coding agents (like Claude Code, Cursor, or Copilot) to constrain what context they use when working in a given directory.

### The hierarchy

```
/AGENTS.md                              ← repo-level router
app/react-app/AGENTS.md                 ← frontend app scope
app/react-app/playwright-tests/AGENTS.md  ← e2e test scope (separate)
app/node-server/AGENTS.md               ← BFF layer scope
```

The root `AGENTS.md` acts as a map — it names the major areas of the monorepo and routes the agent to the right sub-file. It explicitly says: *do not use docs or conventions from other repo areas unless the user explicitly requests cross-codebase work.*

Each sub-file then has a tight scope declaration:

```markdown
# React App Agent Instructions

Scope: These instructions apply to all work under `app/react-app/`,
except `app/react-app/playwright-tests/`.

Always use this documentation entrypoint first:
- `app/react-app/docs/README.md`

Then follow only the relevant linked docs for the task at hand.
Do not pull conventions from other repo areas unless explicitly requested.
```

### Why this matters

In a monorepo, different directories can have very different conventions — a React app, a Node BFF, a Playwright test suite, and infra code often can't share patterns. Without scoping, an AI agent working in `app/react-app/` might pull in conventions from `api/` or `infra/` that don't apply. The AGENTS.md files solve this by giving each area its own bounded context.

The pattern is also layered: the root AGENTS.md gives the agent a light repo map so it knows the overall structure, while sub-files give it task-specific guidance without overwhelming it with the entire codebase's docs.

### BFF-specific guidance

The node server AGENTS.md adds domain-specific rules alongside the scoping:

- Keep BFF routes thin: validate and shape inputs at the edge, delegate behavior to services
- Prefer explicit typed contracts for request/response shapes over ad hoc object handling
- Keep error handling predictable and user-safe — no leaking internal stack details to the client

This is the right level of specificity for an AGENTS.md: not implementation details, but architectural principles that an agent should apply consistently across the area.

---

## Part 2: Canonical MockBff + AAA Pattern

The PR also established a canonical pattern for component integration tests. The core idea is to mock at the **network edge** (the axios instance) rather than mocking service hooks.

### The pattern

```tsx
import { bffAxios } from "@your-org/config/api-config/axios-config";
import { mock } from "jest-mock-extended";
import {
  MockBff,
  unresolvedPromise,
} from "@your-org/tooling/testing/test-utils/mocks/api-mocks/mock-bff-axios";
import { renderFactory } from "@your-org/tooling/testing/test-utils/render-factories/render-factory";
import { screen } from "@testing-library/react";
import type { AxiosInstance } from "axios";

jest.mock("@your-org/config/api-config/axios-config", () => ({
  bffAxios: mock<AxiosInstance>(),
}));

const render = renderFactory.generate(["router", "query", "antd", "i18n"], {
  language: "en-CA",
  translations: {
    "common.global_edit": "Edit",
  },
});

const mockBff = new MockBff(bffAxios);

mockBff.default({
  "/employees/10001": {
    get: () => ({
      data: {
        firstName: "John",
        lastName: "Doe",
      },
    }),
  },
});

beforeEach(() => {
  jest.clearAllMocks();
  mockBff.resetMock();
});

test("shows employee data", async () => {
  mockBff.testOverride({
    "/company/personal-codes": {
      get: () => ({
        genders: [],
        maritalStatuses: [],
        pronouns: [],
      }),
    },
  });

  render(<EmployeeProfile employeeId="10001" />);

  expect(await screen.findByText("John Doe")).toBeInTheDocument();
});

test("shows personal-codes loading state", async () => {
  mockBff.testOverride({
    "/company/personal-codes": {
      get: () => unresolvedPromise,
    },
  });

  render(<EmployeeProfile employeeId="10001" />);

  expect(await screen.findByTestId("personal-codes-skeleton")).toBeInTheDocument();
});
```

### Key design decisions

**`mockBff.default(...)` vs `mockBff.testOverride(...)`**

This is the central distinction. `default` is for responses that must exist in every test — baseline data the component always needs. `testOverride` is for the scenario being tested in that specific case.

The rule: only put something in `default` if removing it would break every single test in the file. Otherwise it belongs in `testOverride` inside the test that owns that scenario.

**URL-based routing makes ownership explicit**

Because responses are keyed by URL (`"/company/personal-codes"`), it's immediately clear which test is responsible for which endpoint behavior. There's no ambiguity about where a response comes from.

**`unresolvedPromise` for loading states**

Rather than building elaborate timing logic, a promise that never resolves holds the component in its loading state for as long as the test needs it. Simple and reliable.

**AAA by spacing only**

The test body uses the Arrange → Act → Assert structure, enforced by blank lines — not by comments. The convention is exactly one blank line between the three blocks, no extra lines inside a block, and no `// Arrange`, `// Act`, or `// Assert` labels.

```ts
// The structure is visible from spacing alone:

test("shows employee data", async () => {
  mockBff.testOverride({ ... });          // ← Arrange

  render(<EmployeeProfile ... />);        // ← Act

  expect(await screen.findByText(...))    // ← Assert
    .toBeInTheDocument();
});
```

---

## Part 3: Explicitly Banned Anti-Patterns

The PR codified what not to do. These are review-enforced:

| Anti-pattern | Why it's banned |
|---|---|
| Mocking service hooks when backend mocking can represent the same scenario | Bypasses the network edge; hides what the component actually depends on |
| Helper routing abstractions in mocks | Hides endpoint ownership — you can't tell which test controls which response |
| `throw new Error(...)` fallback in mock callbacks | Not appropriate in integration-style mocks; return a benign fallback shape instead |
| `expect(url)...` assertions inside mock callbacks | Tests request shape, not component behavior — use a dedicated test if that's what you're verifying |
| `// Arrange`, `// Act`, `// Assert` comments | AAA is conveyed by spacing; comments add noise without adding information |
| Nested `describe` blocks | Tests should be flat and self-contained |
| Eager tests (multiple behaviors in one test) | Fails for multiple reasons; harder to debug and brittle during refactors |

---

## The Connection Between Parts 1 and 2

The AGENTS.md files and the testing conventions aren't separate concerns — they reinforce each other.

The testing docs in `app/react-app/docs/testing/` are the same docs the AGENTS.md points agents to. When an agent writes a test in the react-app area, it will read the conventions doc, see the canonical MockBff pattern, see the explicit anti-pattern list, and produce tests that match.

This is what it looks like when a team writes docs for both humans and AI agents simultaneously. The docs were presumably always there for human review, but the AGENTS.md files make them the authoritative source for automated work too.

---

## Takeaways

- AGENTS.md files are a low-overhead way to scope AI agent behavior in a monorepo. A 15-20 line file per area prevents agents from importing the wrong conventions.
- The root AGENTS.md as a "repo map + router" is a useful pattern — it gives the agent orientation without loading everything upfront.
- Mocking at the network edge (axios) instead of service hooks keeps endpoint ownership visible and makes loading/error scenarios easy to express.
- The `default` / `testOverride` split is a clean solution to the "shared setup vs. test-specific setup" problem that most teams solve badly with `beforeEach` blocks.
- Explicit anti-pattern lists in docs work — especially when they're review-enforced and linked from the canonical pattern they replace.
