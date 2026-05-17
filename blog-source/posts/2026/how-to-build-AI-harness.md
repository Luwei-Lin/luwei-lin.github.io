---
title: "How to Build an AI Harness"
date: "2026-05-16"
excerpt: "A practical way to wrap AI coding agents with context, skills, guardrails, evals, and delivery checks so they can help without quietly making the system harder to maintain."
tags: ["ai-agents", "engineering", "guardrails", "developer-tools"]
---

# How to Build an AI Harness

AI coding agents are getting better fast, but the pattern I keep seeing is this: the model is rarely the whole product. The useful part is the system around it.

That surrounding system is what people are starting to call an **AI harness**. It is the layer that decides what context the agent sees, what tools it can use, what rules it must follow, how work gets verified, and when a human needs to step in.

If a prompt is a request, a harness is the working environment around the request.

---

## What an AI Harness Is

For software work, I think of an AI harness as a runtime wrapper around an agent:

```
User intent
  -> task shaping
  -> scoped context
  -> skills and workflows
  -> tool permissions
  -> code edits
  -> tests and evals
  -> review evidence
  -> deployment guardrails
```

The point is not to make the agent sound smarter. The point is to make its work more inspectable, repeatable, and safe to accept.

Without a harness, the agent is usually just guessing inside a large codebase. With a harness, the agent has a map, a checklist, a narrow tool belt, and a clear definition of done.

---

## Why This Is Becoming a Trend

The web conversation has shifted from "which model writes the best code?" to "what system makes AI-generated work reliable?"

Harness, the DevOps company, published a 2026 report arguing that AI is accelerating code production while many teams have not modernized the testing, security, and deployment systems that happen after code is written. Their study frames the problem well: code moves faster, but downstream review, rework, and deployment risk increase when delivery systems do not keep up.

Recent research is pointing in the same direction. A May 2026 arXiv paper, *AI Harness Engineering: A Runtime Substrate for Foundation-Model Software Agents*, describes software-engineering capability as something that emerges from a model, a harness, and an environment together. Another April 2026 paper, *Agentic Harness Engineering*, focuses on making harness changes observable and measurable instead of relying on manual prompt tinkering.

In practice, this means the next useful layer is not only "better prompts." It is:

- scoped repository instructions
- reusable agent skills
- task templates
- permission boundaries
- trace logs
- evals
- deterministic tests
- human review checkpoints

That matches what many teams are discovering the hard way: AI can produce code quickly, but engineering is still the discipline of proving that the change is correct.

---

## The Core Pieces

### 1. Task Shaping

Start before the agent writes code. A good harness turns a vague request into a small, testable task.

For example:

```markdown
Goal:
- Add loading and error states to the employee profile page.

Scope:
- Only edit files under `src/apps/employees/`.
- Do not change shared components unless the existing API cannot support the state.

Definition of done:
- Existing tests pass.
- Add or update component tests for loading, success, and error states.
- Summarize changed files and remaining risks.
```

This is where I like Matt Pocock's skills approach. His public `mattpocock/skills` repo is built around small, composable agent procedures instead of one giant process. Skills like planning, TDD, review, issue triage, and refactor planning are useful because they turn recurring engineering moves into explicit workflows.

The pattern is simple: if you keep pasting the same instruction into an agent, it probably belongs in a skill.

### 2. Context Scoping

Most agent mistakes are context mistakes. The agent imports the wrong convention, changes the wrong layer, or treats one app's pattern as global truth.

A harness should give the agent less context, but better context:

```markdown
/AGENTS.md
app/react-app/AGENTS.md
app/react-app/docs/testing/component-tests.md
app/node-server/AGENTS.md
```

The root file should act like a router. It should tell the agent where to look, not dump every rule into one massive document. Directory-level files should explain the local architecture, test pattern, banned anti-patterns, and review expectations.

This is the same idea as good onboarding docs, except the reader is now partly automated.

### 3. Skills and Workflows

Skills are reusable procedures the agent can load when relevant. Claude Code's docs describe skills as `SKILL.md` files with frontmatter and instructions; the key advantage is that the skill body loads only when needed instead of living permanently in global context.

A useful project skill might be:

```markdown
---
name: write-component-test
description: Use when adding or updating React component tests in this repo.
---

Follow the canonical MockBff pattern:
- Mock at the BFF axios edge.
- Use `mockBff.default` only for data every test needs.
- Use `mockBff.testOverride` for scenario-specific responses.
- Structure tests with Arrange, Act, Assert spacing.
- Do not mock service hooks when the BFF mock can represent the behavior.
```

This is where BMad Method is interesting too. BMad is a more structured AI-driven agile framework: it brings specialized agents, workflows, planning depth, and lifecycle guidance. I would not use it for every small bug fix, but the pattern is valuable for larger product work where you want the agent to help with product brief, architecture, implementation plan, and testing strategy as separate steps.

My rule of thumb:

| Situation | Better fit |
|---|---|
| Small implementation task | Matt Pocock-style focused skill |
| Existing repo convention | Project `AGENTS.md` + local skill |
| New feature with unclear scope | BMad-style staged workflow |
| Risky refactor | Skill + explicit review checklist + eval |

### 4. Tool Permissions

The harness should decide what the agent can do without asking.

Good defaults:

- Read files freely inside the repo
- Edit only the scoped area for the task
- Run tests and linters
- Ask before installing packages
- Ask before changing lockfiles
- Ask before touching migrations, secrets, CI, deploy config, or destructive git commands

This is not about distrusting the agent. It is about making dangerous actions visible at the right moment.

### 5. Verification

The most important part of the harness is the definition of done.

For code tasks, that usually means:

- unit tests for pure logic
- component tests for UI behavior
- integration tests for API boundaries
- typecheck for contracts
- lint for local style
- build for packaging errors
- manual notes for anything not covered

OpenAI's Evals repo is useful here as a mental model even when you are not evaluating model answers directly. It treats evaluation as a first-class engineering artifact. For an AI harness, you can do the same thing with coding tasks: build a small suite of repeated tasks and check whether agent changes still pass the expectations that matter to your team.

### 6. Review Evidence

A good agent final answer should not just say "done." It should leave evidence:

```markdown
Changed:
- `EmployeeProfile.tsx`: added loading and error rendering
- `EmployeeProfile.test.tsx`: added loading, success, and error coverage

Verified:
- `npm test -- EmployeeProfile.test.tsx`
- `npm run typecheck`

Risks:
- Did not run full e2e suite
- Error copy may need product review
```

This helps the human reviewer move faster without giving up judgment.

---

## A Minimal Harness You Can Build This Week

If I were adding this to a real repo, I would start small:

1. Add a root `AGENTS.md` that maps the repo.
2. Add directory-level `AGENTS.md` files for frontend, backend, and tests.
3. Create two or three project skills for common tasks.
4. Write a "definition of done" checklist for AI-generated PRs.
5. Add a review template that asks for changed files, commands run, and risks.
6. Build a tiny eval set: five real bugs or tasks that good agents should handle correctly.

Do not start by designing a giant framework. Start by capturing the review comments you already repeat.

---

## Example Repo Harness

```text
repo/
|-- AGENTS.md
|-- .claude/
|   `-- skills/
|       |-- write-component-test/
|       |   `-- SKILL.md
|       |-- plan-refactor/
|       |   `-- SKILL.md
|       `-- review-ai-change/
|           `-- SKILL.md
|-- app/
|   |-- react-app/
|   |   |-- AGENTS.md
|   |   `-- docs/
|   |       |-- testing.md
|   |       `-- ui-guardrails.md
|   `-- node-server/
|       |-- AGENTS.md
|       `-- docs/
|           `-- api-contracts.md
`-- evals/
    |-- tasks/
    `-- expected-behavior.md
```

The important thing is the shape: routing, local rules, reusable skills, and verification.

---

## Anti-Patterns

| Anti-pattern | Why it fails |
|---|---|
| One huge prompt | It becomes stale, expensive, and hard to debug |
| No scoped context | The agent applies the wrong convention to the wrong folder |
| No verification command | The change sounds plausible but is not proven |
| Skills without examples | The agent follows the words but misses the local pattern |
| Letting the agent own deployment silently | Production changes need human-visible gates |
| Treating evals as optional | You cannot improve what you cannot measure |

---

## Resources

- [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) - an open-source AI-driven agile development framework with structured workflows, specialized agents, and lifecycle guidance.
- [Matt Pocock's Skills](https://github.com/mattpocock/skills) - a practical collection of small, composable skills for real engineering workflows.
- [Claude Code Skills docs](https://code.claude.com/docs/en/skills) - useful reference for how `SKILL.md` files work and where skills live.
- [OpenAI Evals](https://github.com/openai/evals) - a framework and registry for evaluating LLMs and LLM systems.
- [Harness 2026 State of DevOps Modernization report announcement](https://www.prnewswire.com/news-releases/harness-report-reveals-ai-coding-accelerates-development-devops-maturity-in-2026-isnt-keeping-pace-302710937.html) - a useful industry framing of AI code speed versus delivery risk.
- [AI Harness Engineering: A Runtime Substrate for Foundation-Model Software Agents](https://arxiv.org/abs/2605.13357) - a recent research framing of harnesses as the runtime substrate around software agents.
- [Agentic Harness Engineering](https://arxiv.org/abs/2604.25850) - research on observability-driven harness evolution.

---

## Takeaways

- The current trend is moving from prompt engineering to harness engineering.
- A useful harness makes agent work scoped, observable, testable, and reviewable.
- `AGENTS.md` files are a lightweight way to route context in a repo.
- Skills are a good place to store repeated engineering procedures.
- BMad-style workflows help when the work needs staged planning; Matt Pocock-style skills help when the work needs sharp local execution.
- The final test is not whether the agent produced code. It is whether the system produced evidence that the change is correct.
