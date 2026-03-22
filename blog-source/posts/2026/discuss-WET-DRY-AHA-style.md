---
title: "DRY, WET, and AHA: A Tech Channel Discussion"
date: "2026-03-15"
excerpt: "A conversation in our tech channel got me thinking about a tension every developer eventually faces: when is abstraction actually helpful?"
tags: ["clean-code", "programming"]
---

# DRY, WET, and AHA: A Tech Channel Discussion

A conversation in our tech channel got me thinking about a tension every developer eventually faces: when is abstraction actually helpful?

---

## DRY — Don't Repeat Yourself

Most programmers encounter DRY early on. It comes from *The Pragmatic Programmer* (Hunt & Thomas, 1999):

> "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."

The idea is that duplication leads to inconsistency — fix a bug in one place, forget to fix it in another, and you're in trouble. DRY pushes you toward reusable functions, shared utilities, and single sources of truth.

**Example:**

```js
// Before DRY — duplicated logic
function getAdminGreeting(user) {
  return `Hello, ${user.name}. You have admin access.`;
}

function getGuestGreeting(user) {
  return `Hello, ${user.name}. You have guest access.`;
}

// After DRY — abstracted
function getGreeting(user, role) {
  return `Hello, ${user.name}. You have ${role} access.`;
}
```

Clean, sensible. But is this always better?

---

## WET — Write Everything Twice

A senior front-end engineer in our channel shared this:

> "A nice watch on WET programming — DRY is great but it's not always the best, especially in the age of AI where it constantly DRYs up every bit of code the LLM could find."
> — [Dan Abramov: The WET Codebase (DeconstructConf 2019)](https://deconstructconf.com/2019/dan-abramov-the-wet-codebase)

WET stands for *Write Everything Twice* (or sometimes "We Enjoy Typing"). The argument isn't that duplication is good — it's that **premature abstraction is worse than duplication**.

When you abstract two things that look similar but serve different purposes, you couple them together artificially. Later, when requirements diverge, you're forced to untangle an abstraction that was never the right model to begin with.

Dan Abramov's talk illustrates this with real React codebase examples: abstractions that seemed clever early on became painful constraints as product requirements evolved.

**Example of a problematic abstraction:**

```js
// Two forms that look similar but have different validation rules,
// different submission endpoints, and different error states.
// Forcing them into one <UniversalForm> component creates
// a mess of conditionals and props over time.

<UniversalForm
  type="login"
  onSuccess={handleLogin}
  showForgotPassword={true}
  validateEmail={true}
  requireUsername={false}
/>

<UniversalForm
  type="signup"
  onSuccess={handleSignup}
  showForgotPassword={false}
  validateEmail={true}
  requireUsername={true}
  checkPasswordStrength={true}
/>

// Sometimes two separate <LoginForm> and <SignupForm> components
// are easier to reason about — even if they share some code.
```

---

## AHA — Avoid Hasty Abstractions

The principle tech lead put it well:

> "I'm a big fan of AHA (Avoid Hasty Abstractions). The cost of having everything written twice is a lot lower than having to figure out and untangle hasty abstractions actually doing two different things."

Another senior followed up with Kent C. Dodds' post:
[kentcdodds.com/blog/aha-programming](https://kentcdodds.com/blog/aha-programming)

AHA is a middle path. The rule of thumb: **duplicate first, abstract later — once the right abstraction becomes obvious from real usage.**

Kent C. Dodds draws on the *Rule of Three*: wait until you have three concrete cases before abstracting. By that point, you have enough signal to know what actually varies and what stays the same.

**AHA in practice:**

```js
// Step 1: Write it once for the first use case.
function formatUserLabel(user) {
  return `${user.firstName} ${user.lastName} (${user.email})`;
}

// Step 2: A second similar need appears — duplicate it, note the similarity.
function formatAdminLabel(admin) {
  return `${admin.firstName} ${admin.lastName} (${admin.email}) — Admin`;
}

// Step 3: A third case arrives. Now the pattern is clear.
// Abstract with confidence because you understand the variation.
function formatPersonLabel(person, { suffix = '' } = {}) {
  const base = `${person.firstName} ${person.lastName} (${person.email})`;
  return suffix ? `${base} — ${suffix}` : base;
}
```

---

## The AI Angle

The point about AI is worth sitting with. LLMs are aggressive DRY-ers — they spot any repeated pattern and reach for an abstraction immediately. That's often useful, but it can also produce over-engineered code that's hard to modify, because the model doesn't know which similarities are incidental and which are meaningful.

AHA programming becomes more relevant, not less, when AI is writing the first draft. Reviewing AI-generated code with a WET/AHA lens — *is this abstraction actually justified by the requirements?* — is a useful habit.

---

## Summary

| Principle | Core idea | Risk |
|-----------|-----------|------|
| **DRY** | Eliminate duplication | Premature abstraction |
| **WET** | Tolerate duplication | Inconsistency at scale |
| **AHA** | Abstract when the pattern is proven | Requires discipline to wait |

The real takeaway from the discussion: DRY is a good default, but the *timing* of abstraction matters. Duplicate freely early on, and abstract only when the right shape becomes clear.

---

## References

- [Dan Abramov — The WET Codebase (DeconstructConf 2019)](https://deconstructconf.com/2019/dan-abramov-the-wet-codebase)
- [Kent C. Dodds — AHA Programming](https://kentcdodds.com/blog/aha-programming)
- *The Pragmatic Programmer* — Andrew Hunt & David Thomas (1999)
