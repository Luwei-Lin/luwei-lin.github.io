---
title: "Full-Stack Frontend Handbook: React Patterns and Best Practices"
date: "2026-05-01"
excerpt: "A practical React handbook for full-stack developers: project structure, routing, app boundaries, hooks, UI guardrails, services, i18n, and testing patterns."
tags: ["Frontend", "React", "engineering", "best-practices"]
---

# Full-Stack Frontend Handbook: React Patterns and Best Practices

A single reference for architecture, React standards, code conventions, UI patterns, services, i18n, and testing — written for full-stack developers who are comfortable with backend work and are growing into modern React frontend.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Multi-App Architecture](#2-multi-app-architecture)
3. [Routing](#3-routing)
4. [Architectural Boundaries](#4-architectural-boundaries)
5. [Feature Flags](#5-feature-flags)
6. [React Core Principles](#6-react-core-principles)
7. [Rules of Hooks](#7-rules-of-hooks)
8. [Escape Hatches — Refs & Effects](#8-escape-hatches--refs--effects)
9. [State Management & Context](#9-state-management--context)
10. [Lists and Keys](#10-lists-and-keys)
11. [Code Organization](#11-code-organization)
12. [UI Implementation Guardrails](#12-ui-implementation-guardrails)
13. [Forms & Error Handling](#13-forms--error-handling)
14. [Permissions](#14-permissions)
15. [Services & Data Fetching](#15-services--data-fetching)
16. [Hooks Usage Guidelines](#16-hooks-usage-guidelines)
17. [Internationalization](#17-internationalization)
18. [Testing](#18-testing)

---

## 1. Project Structure

```
src/
├── components/       # Shared UI library (atomic design) — app-agnostic
├── config/           # Application configuration files
├── utils/            # Shared utility functions and helpers
├── pages/            # Top-level page components (login, etc.)
├── routes/           # Root routing configuration
├── services/         # Root-level API services
└── apps/             # Feature-based application modules
    ├── common-apps/
    │   ├── assistant/    # Virtual Assistant feature
    │   └── platform/     # Platform utilities (bundled with every app)
    ├── employees/        # Employee management
    ├── billing/          # Billing and payroll processing
    ├── platform/         # Platform-level code
    ├── public/jobs/      # Public job board (no auth)
    └── jobs/             # Job recruitment management
```

`src/components/`, `src/config/`, and `src/utils/` are self-contained modules. They must not import from `src/apps/` or from each other's peer directories.

> **For beginners:** Think of this like a backend monorepo where each `apps/` subfolder is its own bounded context. Shared utilities live at the root level — similar to shared libraries or packages in a backend service.

---

## 2. Multi-App Architecture

Multiple business apps coexist in one frontend. Each app is an isolated module — eventually an independently versioned package. The architecture relies on:

- **App Resolver System** — centralized app discovery and rendering
- **Route Configuration** — dynamic route generation per app
- **Standardized Props Interface** — `AppProps` contract for consistent wiring
- **Layout Consolidation** — per-app layout component
- **Theme Decentralization** — app-specific theme extending root theme

> **Why this pattern?** As the product grows, isolating apps prevents one team's changes from breaking another's. It's the same idea as microservices, but applied to the frontend.

### Adding a New App

1. Create folder under `src/apps/<app-name>/`
2. Implement the app component using the `AppProps` interface
3. Create a route configuration using the route resolver pattern
4. Define navigation items via a configuration hook
5. Create an app layout component that handles all layout concerns
6. Extend root theme with app-specific `ThemeConfig` overrides
7. Register the app in `useApps()` with lazy loading and ensure it's returned by the platform products endpoint

---

## 3. Routing

### Route Resolver Pattern

Each app implements a route config object that generates type-safe paths with the app prefix baked in. This means you get autocomplete on paths and catch typos at compile time — not at runtime.

### Folder-to-Route Mapping

Keep route paths aligned 1:1 with folder paths under `src/apps/<app>/pages/`. The `pages/` folder itself never maps to a URL segment.

```
src/apps/employees/pages/
├── profile/           → /employees/profile
│   └── sections/
├── team/              → /employees/team
└── home/              → /employees/home
```

**Rules:**
- Each folder segment becomes a URL path segment
- A page component file is the leaf route for its segment
- Nest a `pages/` folder inside a route when it has multiple child routes (e.g., `create` and `edit`)
- Use dynamic segments only where the UI needs a parameter (`:userId`, `:itemId`)
- `pages/` is always a container — never a route segment

---

## 4. Architectural Boundaries

> **Why this matters:** In a multi-app frontend, the biggest risks are apps accidentally depending on each other (coupling) or shared code pulling in app-specific logic (leaking). Both make refactoring painful and can cause circular dependency errors at build time.

### The Laws

| Rule | Detail |
|------|--------|
| **No cross-app imports** | Apps must never import from each other — not components, layouts, routes, or types |
| **Root code is app-agnostic** | `src/components/` and `src/utils/` must not import from any app directory |
| **Communication flows through root** | Apps receive config/state via props; communicate back via callbacks — never directly to each other |

### Information Flow

```
Root (config/state) → Apps       (props flow down)
Apps → Root          (callbacks)  (events bubble up)
Apps → Apps          ❌ FORBIDDEN
```

### What Belongs Where

| Root Level | Inside Apps |
|------------|-------------|
| Generic UI components (buttons, tables, forms) | App-specific components (employee detail form) |
| Utility functions (dates, validation) | Business logic (domain workflows) |
| Shared types and domain models | Route definitions |
| Theme, i18n, API config | App-specific state |
| Cross-app Zustand store primitives | Feature state |

### PR Checklist

- [ ] No cross-app imports in root-level code
- [ ] No cross-app imports between app directories
- [ ] Shared functionality extracted to root locations
- [ ] Apps communicate only via standardized props interface
- [ ] Route navigation uses root-level app switching
- [ ] Components in `/apps/` don't reference other app folders

---

## 5. Feature Flags

Feature flags let you ship code to production without immediately exposing it to users. This is especially useful for incomplete features or A/B experiments.

Flags are **BFF-driven** (BFF = Backend For Frontend — a thin server layer that sits between your frontend and your APIs) and temporary until a proper config system is in place. They're sourced from environment variables and exposed to the UI via the Node BFF.

### Naming Convention

`APP_FEATURE_<FLAG_NAME>=true` → becomes `<flag_name>` (lower-cased, prefix stripped)

Example: `APP_FEATURE_NEW_DASHBOARD` → `new_dashboard`

### Adding a Flag

**Local dev:**
1. Add `APP_FEATURE_<FLAG>=true` to `.envrc.example`
2. Sync your env file (e.g., run your project's env sync script)
3. Restart the BFF and confirm `GET /api/features` includes it
4. Add the flag to `ALLOWED_FEATURE_FLAGS` in `feature-flags.ts`

**Shipping:**
Set the flag value in your deployment environment config files (per environment: dev, staging, prod, etc.).

### Frontend Usage

```tsx
import { useBooleanFlagValue } from "@openfeature/react-sdk";

const isNewDashboardEnabled = useBooleanFlagValue("new_dashboard", false);
```

> The second argument is the default value — it's what gets used if the flag is missing or the flags service is unavailable. Always default to `false` for new features.

### Testing with Flags

```tsx
const render = renderTestComponent(["antd", "i18n", "query", "auth", "feature"], {
  features: { new_dashboard: true },
});
```

---

## 6. React Core Principles

These are the mental models that explain why React code is structured the way it is. If you're coming from a backend or MVC background, some of these will feel unfamiliar at first.

### One-Way Data Flow

Props flow down; events bubble up. Children never reach up to modify parent state; parents never reach into children via refs to change their state.

**Why:** Breaking this makes state changes untraceable, bugs hard to locate, and re-renders unpredictable. Think of it like a REST API — the server doesn't call back into the client to push state changes.

### Component Purity

Given the same props and state, a component always renders the same output. No side effects inside render — those belong in event handlers or Effects. Never mutate props or state directly.

**Why:** React may call render arbitrarily (twice in dev mode). Impure renders cause inconsistent UI, missed updates, or corrupted state.

### Refs Are Escape Hatches

Refs hold values that don't affect rendering (DOM nodes, timer IDs, previous values). Updating a ref does **not** trigger a re-render.

**Never store UI-affecting state in a ref.** The value changes but the screen doesn't — leads to stale UI bugs.

### Separate Business Logic from UI Logic

Data transformations (mapping API responses, formatting, enum translation) belong in the service layer, not in components.

**Why:** Logic scattered across components can't be reused or tested independently. Components should receive data ready to render — similar to how a controller in MVC should hand off clean data to a view.

---

## 7. Rules of Hooks

Hooks are React's way of letting function components use state and lifecycle features. There are strict rules around how they can be called.

### Only Call Hooks at the Top Level

Never call Hooks inside loops, conditionals, or nested functions. They must be called in the same order on every render.

```tsx
// ❌ Bad
if (show) {
  const [data, setData] = useState(null);
}

// ✅ Good — call unconditionally, handle condition inside
const [data, setData] = useState(null);
```

**Why:** React tracks hooks by call order. If that order changes between renders, state gets assigned to the wrong hook.

### Only Call Hooks from React Functions

Hooks can only be called inside function components or custom Hook functions. Not in plain JS functions or class components.

### Never Call Components as Functions

Always use JSX (`<MyComponent />`) — never `MyComponent(props)`. Calling directly bypasses React's rendering lifecycle; Hooks inside won't work correctly.

### Naming

Custom Hooks must start with `use` (e.g., `useAuth`, `useUserProfile`) so the linter enforces Hook rules on them.

---

## 8. Escape Hatches — Refs & Effects

### Refs

Use for:
- DOM manipulation (focus, scroll, measure)
- Storing volatile values that don't affect rendering (timer IDs, previous prop values)

Avoid for:
- Reactive state — anything that should cause a re-render must be `useState`
- Reaching into child component internals (lift state up instead)

Changing a ref doesn't trigger re-render. Ref changes are invisible to React.

### Effects

`useEffect` synchronizes a component with an **external system**. Common legitimate uses:

- Fetching data on mount
- Subscribing to WebSockets or event listeners
- Updating browser APIs (document title)
- DOM manipulation that can't happen during render

> **Beginner tip:** If you're used to lifecycle methods from class components or frameworks like Angular, `useEffect` is the functional equivalent — but it's also more powerful and more easily misused.

#### You Might Not Need an Effect

| Situation | Instead... |
|-----------|-----------|
| Deriving a value from props/state | Compute it directly during render |
| Reacting to a user event | Do the work in the event handler |

#### Rules

- Include all values used inside the effect in the dependency array — don't omit to silence the linter
- Always clean up subscriptions, timers, and listeners via the return function
- Split unrelated logic into separate focused effects

#### `useLayoutEffect` vs `useEffect`

`useLayoutEffect` runs synchronously before paint. Use only for measuring or updating the DOM before the user sees it. Default to `useEffect`.

---

## 9. State Management & Context

### State Placement

Keep state as close to where it is used as possible. Lift state to the nearest common ancestor only when siblings genuinely need to share it. Don't lift preemptively.

> **Analogy:** Think of state like a variable scope in a function — declare it at the lowest level that still gives everything that needs it access to it.

### When to Use Context

Use Context for:
- Truly global data (auth, theme)
- Cross-cutting concerns where prop threading becomes very cumbersome

**Not every prop-drilling case warrants Context.** Often it's a composition problem — rearrange component boundaries first.

### Context Guidelines

- One focused provider per concern — avoid a single giant context
- Avoid relying on default values for required context (treat missing provider as an error)
- Memoize context values or split contexts when frequent updates cause widespread re-renders

### External State Libraries

For complex server state use **React Query**. For complex client state consider **Zustand** (store primitives in `utils/store/`). Keep business logic in reducers/services; keep components focused on rendering.

> **React Query** handles caching, background refetching, loading/error states, and cache invalidation — all the things you'd otherwise wire up manually with `useEffect` + `useState`.

---

## 10. Lists and Keys

Every list item rendered with `.map()` requires a `key` prop.

### Good Keys

- Use stable, unique IDs from your data (`user.id`, `product.sku`)
- Combine identifiers when one alone isn't unique

### Bad Keys

| Anti-pattern | Why it breaks |
|-------------|---------------|
| Array index | Order changes cause React to reuse DOM nodes for wrong items |
| `Math.random()` | Recreates every item on every render, destroys component state |

Keys scope component state — changing a key unmounts the old component and mounts a new one. This is both a footgun and a useful trick when you want to force a reset.

---

## 11. Code Organization

### One Component Per File

Each `.tsx` file contains exactly one UI component. When a file grows, extract into new files.

```
UserDashboard/
├── Dashboard.tsx
├── Stats.tsx
├── Activity.tsx
└── __tests__/
    └── Dashboard.test.tsx
```

### One Hook Per File

Each custom hook file contains a single hook. Exception: simple CRUD service modules that group tightly related React Query hooks are acceptable, but split when a hook becomes complex.

### Page Folder Structure

The general structure repeats recursively at any depth:

```
<feature>/
├── pages/              # Child routes (container only, not a URL segment)
├── sections/           # Large page sections
├── components/         # Feature-scoped components
├── hooks/              # Feature-scoped hooks
└── __tests__/          # Test files
```

**Conventions:**
- Route ↔ folder mapping is 1:1 by default
- Each page folder contains a component named after the folder (the page controller)
- Promote shared code upward to the nearest common ancestor
- Prefer short filenames; rely on folder names for context
- **Avoid `index.ts`** — use explicit names (`countries.ts`, `employees.ts`)

> **Why avoid index files?** They make imports ambiguous and create "mystery meat" imports in stack traces. `import { something } from './employees'` is much clearer than `import { something } from './'`.

### Keep Components Declarative

The JSX (`return`) block can be long — that's fine. The imperative section (before `return`) should be short. If there's a lot of logic before the return, extract it into custom hooks or services.

---

## 12. UI Implementation Guardrails

When using AI tools to generate UI code, it's easy to get output that skips reuse and jumps straight to custom styles. This order keeps things consistent.

### Required Decision Order

When implementing any UI, follow this order. **Do not skip steps.**

1. Reuse existing internal component library components and APIs
2. Use Ant Design components and APIs directly
3. Prefer Ant Design component props (variants, size, status, layout primitives) before custom styles
4. Customize at the token level (app `ThemeConfig` overrides)
5. For truly custom UI, build with tokens and existing Ant Design primitives
6. Any deviation requires design alignment

### Token-Level Means

Design tokens are named values (colors, spacing, typography) that come from your theme. Using tokens instead of hardcoded values means the whole UI updates consistently when the theme changes.

- Prefer theme token changes in `ThemeConfig`
- Use token-driven values in component styles, not hardcoded visual values
- Concrete layout dimensions (width, height, padding) are acceptable when no token equivalent exists
- **Never** write custom CSS when an Ant Design primitive achieves the same outcome
- When custom styles are unavoidable, use `createStyles` from `antd-style`

### Design Alignment for Exceptions

When the decision order can't be followed, align with design and pick one:
- Update existing tokens
- Add a new shared custom component
- Adjust the design to fit the token/component system

Record the decision in the PR.

### Review Checklist

- [ ] Followed the required decision order
- [ ] Preferred Ant Design primitives/props over custom styles
- [ ] Visual customization uses theme tokens
- [ ] Custom styling uses `createStyles` from `antd-style`
- [ ] Custom components are token-driven
- [ ] Exceptions include design alignment rationale

---

## 13. Forms & Error Handling

### Form.Item Name Mapping — Critical

The `name` prop on `Form.Item` must **exactly match** the `field` value in API validation errors. This is what lets Ant Design automatically display server-side errors next to the right field.

```tsx
// API returns: { field: "phoneNumber", ... }
<Form.Item name="phoneNumber" label="Phone Number">
  <Input />
</Form.Item>
```

### Modern Error Handling — `mapErrors`

Each module implements its own `mapErrors` function that transforms its backend's error format into a standard `FormExternalError[]` contract. Here's the shape:

```typescript
// Contract shape
type FormExternalError = {
  field: string;        // must match Form.Item name
  i18nTemplate: string;
  i18nParams?: Record<string, string>;
  priority?: number;
};
```

**Rules:**
1. Field name in error must match `Form.Item name`
2. Return errors with `i18nTemplate` and `i18nParams` for translation
3. Always return an array — return `[]` for null/undefined input
4. Pass the translation function `t` as a parameter when required

> **Why a contract like this?** It decouples your backend's error format from your UI. If the backend changes its error shape, you update `mapErrors` in one place — not in every form component.

---

## 14. Permissions

Two permission layers exist in feature-heavy modules:

- **Global permissions** — broad product capabilities
- **Record-level permissions** — per-record field access (view/edit)

Permission strings: `<action>:<subject>` (e.g., `view:user.address.line`, `edit:user.workEmail`)

### Implementation Sequence

**Always: tests → endpoint mapping → component wiring**

1. **Write tests first** — define what is visible, editable, excluded from submit, and card-level gating behavior before touching component code
2. **Endpoint mapping** — centralize in one place; return both `permissionsObject` and `permissionBuilder`
3. **Feature-level wiring** — scope permissions where the UI model is owned
4. **Form wiring** — pass `permissions` into `Form.tsx`; core behavior centralizes in `FormItem.tsx` (hide non-viewable, disable view-only, remove non-editable from submissions)
5. **Descriptions wiring** — use `Descriptions.tsx` and set `permissionTargetField` per item
6. **Manual gating** — use `isFieldViewable`, `isFieldEditable`, `isAnyFieldViewable`, `isAnyFieldEditable` directly where Form/Descriptions don't apply

### Override Rules

Overrides translate UI field shape to permission semantics. They are **deliberate**, not shortcuts.

| Acceptable | Anti-pattern |
|-----------|-------------|
| Coarse permissions by design (address line 1 & 2 → single `address.line` permission) | Masking API contract drift with frontend hacks |
| Select/ID mapping where UI stores IDs but permission targets conceptual fields | Patching backend field name changes with frontend remaps |

If backend field names changed: reconcile the API contract first, then wire permissions on aligned fields.

### Test Layer Strategy

Keep three layers focused:
- **Hook mapping tests** — verify endpoint → permission object transformation
- **Primitive behavior tests** — `FormItem.permissions.integration.test.tsx`, `Descriptions.test.tsx`
- **Feature integration tests** — view, edit, and submit permission scenarios per feature

---

## 15. Services & Data Fetching

### React Query

Services are organized by business domain. Each service gets its own folder even if it starts as one file.

```
src/services/
├── users/
│   ├── users.ts
│   └── types.ts
└── profile/
    ├── profile.ts
    └── slices/
        ├── settings.ts
        └── positions.ts
```

**Key patterns:**
- **Query Key Factories** — define factories to keep keys type-safe, centralized, and easy to invalidate partially
- **Transform in service layer** — don't transform API response shapes inside components
- **Group related queries/mutations** — keep domain concerns together

> **For beginners:** React Query replaces manual `useEffect` + `useState` data fetching. It handles loading states, caching, background refetches, and error states automatically. Treat it like an ORM for your API — you define queries, it handles the lifecycle.

### Lookup Entities

Lookup entities are read-only backend reference records (dropdown options, code-to-label maps).

```typescript
type LookupEntity<T = string> = {
  code: T;       // stable key used in payloads
  name: string;  // human-readable label
  shortName?: string; // compact display label
};
```

No create/update/delete flows exist for lookup entities. If lifecycle management is needed in the future, add explicit CRUD endpoints rather than extending read-only hooks.

---

## 16. Hooks Usage Guidelines

### `useEffect` Is for Synchronization, Not Prop Diffing

`useEffect` connects a component to an external system. It is **not** a tool for detecting prop changes or deriving state.

```tsx
// ❌ Bad — unnecessary double-render
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ Good — derive during render
const fullName = `${firstName} ${lastName}`;
```

> This is one of the most common mistakes when learning React. If you're using `useEffect` to compute a value from other state/props, just compute it inline during render instead.

### Performance Hooks — Optimize Last

`useCallback`, `useMemo`, and `memo` have overhead. Don't add them preemptively.

**Let the linter guide you.** ESLint warns when dependencies need memoization. Trust it.

**When to actually reach for them:**
- ESLint flags a dependency that must be stable
- React DevTools Profiler shows a measurable bottleneck
- The computation is genuinely expensive (complex calculations, large transforms)
- Document the reason with a comment

---

## 17. Internationalization

Internationalization (i18n) is the process of structuring strings so they can be translated into different languages without changing code.

### Key Format

```
{module}.{route}.{domain}_{subDomain}_{key}
```

- `.` (dot) = namespace boundary (i18next lazy loading)
- `_` (underscore) = logical domain separation within a namespace
- Everything uses **camelCase**

```typescript
"employees.profile.compensation_title"
"employees.profile.settingsTab_positionCard_jobTitle"
"employees.home.upcomingEvents"
"billing.invoices.summary_totalAmount"
```

### Four-Layer Hierarchy

```
root.common.components_*              → App-wide shared components
{module}.common.global_*              → Module-wide action words (Save, Cancel, Delete)
{module}.common.{domain}_*            → Module-wide domains (errors, nav, enums, validations)
{module}.{route}.common_*             → Route-specific shared strings
{module}.{route}.{feature}_*          → Feature-specific translations
```

### Decision Tree

1. Used across multiple modules? → `common.components_*`
2. Universal action word across the entire module? → `{module}.common.global_*`
3. Used across multiple routes (errors, enums, nav)? → `{module}.common.{domain}_*`
4. Shared within one route? → `{module}.{route}.common_*`
5. Feature-specific? → `{module}.{route}.{feature}_*`

Every key must be organized under a domain using `_`. If no domain fits, use `common_` as the prefix.

### Enum Pattern

```
{domain}_{enumType}Enum_{enumValue}
```

```typescript
// ✅ Correct
"employees.common.status_statusEnum_active"
"employees.profile.documents_documentTypeEnum_passport"

// ❌ Wrong — SCREAMING_SNAKE_CASE
"employees.common.status_statusEnum_ACTIVE"
```

### Resolver Functions

Don't map enums to translation keys inline in components. Use resolver functions in the service layer.

**Why:** Dynamic key construction breaks IDE tracking and translation-completeness tooling. Resolver functions make keys explicit and statically traceable.

```typescript
// ❌ Bad — IDE can't track this key, and static analysis tools can't validate it
t(`employees.common.status_statusEnum_${status}`);

// ✅ Good — explicit resolver in service layer
import { resolveStatus } from "@/apps/employees/services/resolvers";
t(resolveStatus(status));
```

**Resolver rules:**
- Define in service layer, never in components or `types.ts`
- Use TypeScript enums or union types for type safety
- Provide fallback values for null/undefined
- Keep resolvers pure — no side effects
- Test that all enum values are covered

---

## 18. Testing

### Philosophy: Test Like a User

Write tests that mirror how users interact with the UI. Use accessibility selectors and visible text — not test IDs or internal state.

> **Why?** Tests tied to internal implementation (component names, state variables, test IDs) break on every refactor. Tests tied to what the user sees and does survive redesigns.

### Core Principles

| Principle | Rule |
|-----------|------|
| **OTOA** | One Thing, One Assertion — each test verifies one behavior |
| **No assertion roulette** | Don't mix unrelated checks in one test |
| **No eager tests** | One user journey branch per test |
| **Flat structure** | No nested `describe` blocks; max one level when unavoidable |
| **AAA format** | Arrange → Act → Assert with exactly one blank line between blocks — no `// Arrange` comments |

### Query Priority

Query elements in accessibility order:

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByAltText`
7. `getByTitle`
8. `getByTestId` — last resort only

> `getByRole` is preferred because it tests your app is actually accessible — a button found by role is a button a screen reader can find too.

**Query type by intent:**
- `getBy*` — element expected now (sync)
- `findBy*` — element expected later (async) — always `await`
- `queryBy*` — asserting element is absent

**Async absence rule:** In async screens, wait for a reliable ready-state marker (`findBy*`) before making negative assertions (`queryBy*`). Never assert absence during initial loading.

### Render Setup

Use your project's test render wrapper — not the raw `render` from Testing Library directly. The wrapper handles providers (theme, i18n, query client, auth) so your tests don't need to wire them up manually.

```tsx
// Use the minimal context required for the test
const render = createTestRenderer(["antd", "i18n", "query", "auth"], {
  language: "en-CA",
  translations: { "example.key": "Example" },
});
```

Use the **minimal context** required for the test:
- `["antd"]` — fastest
- `["antd", "i18n"]` — when labels are under test
- `["antd", "i18n", "router", "query"]` — full integration

### Backend Mocking

Use your project's API mock utility for component integration tests. A well-structured mock API lets you simulate real server behavior without spinning up a backend.

```typescript
mockApi.default(...)           // cross-test defaults
mockApi.testOverride(...)      // scenario-specific behavior inside each test
```

**Rules:**
- Never `jest.mock(...)` service hooks when backend mocking can represent the scenario
- If a hook is mocked, include a comment explaining why backend mocking was insufficient
- Don't use `throw new Error(...)` fallback branches in standard mocks
- Don't assert request inputs (`expect(url)...`) unless request shape is the direct test subject

### Hook Testing

Use a hook render wrapper with the same provider composition as your component test wrapper. Wrap state-changing calls in `act()`. Test behavior, not implementation.

### Teardown

```typescript
afterEach(() => {
  jest.clearAllMocks();       // always
  jest.restoreAllMocks();     // add when jest.spyOn is used
});
```

### File Structure

```
src/
├── components/Button/
│   └── __tests__/Button.test.tsx
├── hooks/
│   └── __tests__/useAuth.test.ts
└── apps/employees/pages/profile/
    └── __tests__/Profile.test.tsx
```

Default filename: `<FileName>.test.tsx`. Add qualifiers (`.integration`, `.display`, `.filters`) only when they add real value.

### Performance

| Use `user.type()` | Use `user.paste()` |
|-------------------|--------------------|
| Testing validation as user types | Testing final form submission |
| Testing autocomplete behavior | Testing API integration |
| Character limits or formatting | Performance-critical suites |

`paste()` is significantly faster for form tests. Always `click()` before `paste()` to ensure focus.

**Targets:**
- < 500ms per test — acceptable
- > 500ms — investigate
- > 800ms — red flag

Use `userEvent.setup({ delay: null })` by default to reduce interaction overhead.
