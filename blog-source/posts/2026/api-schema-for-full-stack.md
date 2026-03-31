---
title: "API Schema Contracts in a Full-Stack Monorepo"
date: "2026-03-25"
excerpt: "How a team structures their BFF layer with explicit typed contracts, thin routes, and feature flag schemas — and why it matters for full-stack development."
tags: ["api", "full-stack", "typescript", "architecture"]
---

# API Schema Contracts in a Full-Stack Monorepo

A PR I recently read through included instructions for a Node.js BFF (Backend for Frontend) layer that stood out for how explicitly it defined the contract between frontend and backend. Three principles in particular are worth breaking down.

---

## What Is a BFF?

A BFF (Backend for Frontend) is a thin server layer that sits between the frontend app and the real backend APIs. Its job is to:

- Aggregate and reshape data from multiple backend services into what the UI actually needs
- Validate and sanitize frontend inputs before they reach internal services
- Own the frontend's API surface so the UI doesn't couple directly to backend internals

The key word in all three points is *thin*. A BFF is not a place to put business logic.

---

## Principle 1: Keep Routes Thin

The guideline from the PR was direct:

> Keep BFF routes thin: validate/shape inputs at the edge and delegate behavior to services.

In practice, this means a route handler should do two things and nothing else: validate the incoming request shape, then call a service. All logic lives in the service layer.

```ts
// Thin route — validates at the edge, delegates to service
router.get("/users/:id/profile", async (req, res) => {
  const { id } = validateParams(req.params, userIdSchema);
  const profile = await userProfileService.getProfile(id);
  res.json(profile);
});

// Fat route — logic mixed into the handler (avoid this)
router.get("/users/:id/profile", async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const raw = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  const profile = {
    name: `${raw.firstName} ${raw.lastName}`,
    email: raw.email,
  };
  res.json(profile);
});
```

The thin version is easier to test (the service is independently testable), easier to read, and makes the route's responsibility obvious at a glance.

---

## Principle 2: Explicit Typed Contracts

> Prefer explicit typed contracts for request/response shapes over ad hoc object handling.

This is about treating the API boundary like a typed interface, not a loosely-shaped JSON blob. Every route should have an explicit type for what it accepts and what it returns.

```ts
// Explicit contracts
interface GetUserProfileParams {
  id: string;
}

interface UserProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "member" | "guest";
}

async function getProfile(params: GetUserProfileParams): Promise<UserProfileResponse> {
  // ...
}
```

Without this, the frontend team is left guessing at response shapes from the network tab. With explicit types shared between the BFF and the React app (via a shared types package or generated schema), both sides have a contract to code against.

The benefit compounds in a monorepo: when the BFF type changes, TypeScript surfaces every place the frontend needs to update.

---

## Principle 3: Feature Flags as an API Contract

The PR also described how feature flags are exposed:

> Flags are BFF-driven and exposed at `GET /api/features` using OpenFeature-style schema.
> Env key convention: `APP_FEATURE_<FLAG_NAME>` → UI key `flag_name`.

This is a clean pattern. Rather than each frontend component reading environment variables directly (which doesn't work in a browser anyway), the BFF owns the feature flag state and exposes it through a single typed endpoint.

```ts
// BFF exposes flags via a typed response
interface FeatureFlagsResponse {
  dark_mode: boolean;
  new_dashboard: boolean;
  beta_export: boolean;
}

router.get("/api/features", (_req, res) => {
  const flags: FeatureFlagsResponse = {
    dark_mode: process.env.APP_FEATURE_DARK_MODE === "true",
    new_dashboard: process.env.APP_FEATURE_NEW_DASHBOARD === "true",
    beta_export: process.env.APP_FEATURE_BETA_EXPORT === "true",
  };
  res.json(flags);
});
```

The frontend fetches this once at startup and uses the typed response. The naming convention (`APP_FEATURE_<FLAG_NAME>` → `flag_name`) makes it predictable to add new flags without changing the pattern.

---

## Principle 4: Safe Error Handling

> Keep route and service error handling predictable and user-safe — no leaking internal stack details to the client.

This one is security hygiene. Stack traces, database error messages, and internal service names should never reach the browser. The BFF should translate errors into safe, predictable shapes:

```ts
// Safe error handler — maps internal errors to user-safe responses
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err); // log internally

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: "Not found" });
  }

  // Default: don't expose internal details
  res.status(500).json({ error: "Something went wrong" });
});
```

The internal error is logged for debugging. The client gets a safe, predictable shape.

---

## Putting It Together

These four principles form a coherent architecture for the BFF layer:

| Principle | What it prevents |
|---|---|
| Thin routes | Business logic scattered across handlers |
| Typed contracts | Implicit coupling between frontend and backend |
| Feature flags as API | Environment variables leaking into frontend bundles |
| Safe error handling | Internal stack details reaching the client |

The common thread: the BFF is a boundary. Everything that crosses that boundary — requests in, responses out, errors, feature state — should be explicitly shaped and typed. Ad hoc handling at the boundary is where full-stack systems quietly accumulate technical debt.

---

## Takeaways

- A BFF should validate at the edge and delegate everything else to services. If your route handler has business logic in it, that's a smell.
- Typed request/response contracts pay off most in a monorepo where frontend and backend share types — TypeScript surfaces breakage immediately.
- Exposing feature flags through a single BFF endpoint is cleaner than reading env vars on the frontend, and the naming convention (`APP_FEATURE_X` → `x`) keeps it mechanical to extend.
- Error handling at the BFF boundary should be a deliberate design decision, not an afterthought.
