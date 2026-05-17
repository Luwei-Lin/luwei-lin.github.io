---
title: "Guardrails That Keep Vibe Coding From Going Sideways"
date: "2026-05-16"
excerpt: "A practical UI decision framework for using AI coding tools without ending up with random styles, one-off components, and frontend drift."
tags: ["ai-agents", "frontend", "vibe-coding", "design-systems"]
---

# Guardrails That Keep Vibe Coding From Going Sideways

When I was working on a recent full-stack project, one thing I noticed pretty quickly was how easy it is for the frontend to get messy — especially when AI is helping you generate UI code. It's fast, it feels great, but without some kind of agreed-upon order of operations, you end up with a patchwork of random styles and one-off components that no one wants to touch later.

So here's the decision framework we landed on. It's not complicated, but having it written down made a real difference when reviewing PRs or using AI tools to scaffold UI.

---

## The Order That Actually Matters

When I'm implementing any piece of UI, I run through this order before writing a single line:

1. **Check if the internal component library already has what I need.** Our team's shared components are the first stop — reuse always wins.
2. **If not, reach for Ant Design directly.** It covers most cases out of the box.
3. **Lean on Ant Design's built-in props before reaching for custom styles.** Things like `size`, `variant`, `status`, layout primitives — these do more than people realize.
4. **If I need to tweak visuals, do it at the token level.** Not hardcoded values.
5. **If it's truly custom UI** (think floating nav, unique layout patterns), build it using tokens and existing primitives — not a soup of custom CSS.
6. **Any exception to the above? Talk to design first.** Don't just go rogue.

This order keeps things consistent and makes AI-generated code easier to review — if the output skips steps 1–3 and jumps straight to custom styles, that's a red flag worth catching.

---

## What I Mean by "Token Level"

This one trips people up, so it's worth spelling out.

Token-level means your visual values come from the theme, not from your head. Instead of `color: #1890ff`, you're using whatever the design system's primary token resolves to. In practice:

- App-wide overrides live in `ThemeConfig` — that's where token/component-level changes belong.
- Inside component styles, use token-driven values. Hardcoded colors and font sizes should be rare.
- Layout dimensions (widths, heights, padding) can be concrete values when there's no token equivalent — just check first.
- When you do need custom styles, use `createStyles` from `antd-style`. This keeps styles tied to the active theme automatically.
- Never reach for custom CSS when an Ant Design prop can do the same job.

The point is that when the theme changes, everything should update together. Custom CSS that ignores tokens breaks that contract.

---

## When the Default Order Doesn't Work

Sometimes the design just doesn't fit neatly into the existing system. That's fine — but it means a conversation, not a workaround.

The usual outcomes when we hit this:

- **Update a token** — if something needs to shift globally, do it at the source.
- **Add a shared component** — if it's reusable, it belongs in the library.
- **Adjust the design** — sometimes the right call is to meet the system where it is.

Whichever path you take, log the decision in the PR. It keeps design and implementation in sync and makes future-you's life much easier.

---

## How This Helps With AI-Generated UI

The biggest risk with AI-generated frontend code is not that the first version is bad. It is that the first version is fast enough to feel acceptable, so the hidden inconsistency slips through review.

These guardrails give reviewers a simple way to evaluate the output:

| Question | What to look for |
|---|---|
| Did it reuse the internal component library first? | Existing shared components before new local components |
| Did it use Ant Design primitives before custom markup? | `Button`, `Form`, `Table`, `Modal`, layout primitives |
| Did it use props before custom CSS? | `size`, `status`, `variant`, `disabled`, layout props |
| Did custom styling come from tokens? | Theme-aware values instead of hardcoded colors |
| Did the PR explain exceptions? | Design sign-off or a short rationale |

This turns vibe coding from "the UI looks okay on my machine" into "the UI fits the system we already agreed to maintain."

---

## Quick Review Checklist

Before marking a UI PR ready for review, I run through this:

- [ ] Followed the component decision order
- [ ] Used Ant Design primitives/props before writing custom styles
- [ ] Visual customization goes through theme tokens where possible
- [ ] Custom styles use `createStyles` from `antd-style`
- [ ] Custom components are token-driven
- [ ] Any exceptions have a design sign-off and a rationale in the PR

---

## Takeaways

- Vibe coding needs a decision order, not just taste.
- Reuse internal components first, then Ant Design, then token-driven custom UI only when needed.
- Tokens keep visual decisions connected to the design system.
- AI-generated UI is easier to review when the anti-patterns are explicit.
- Exceptions are fine, but they should be discussed and documented instead of quietly becoming precedent.
