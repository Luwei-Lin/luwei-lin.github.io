---
title: "From Backend to Frontend: Type-Safe APIs with Schema-Driven Workflow"
date: 2026-03-30
tags: [api, openapi, typescript, csharp, backend, frontend]
---

If you've worked across backend and frontend, you've probably run into this:

> Backend renames a field. Frontend doesn't update. Everything compiles... until it silently breaks at runtime.

This post walks through how to fix that **systematically** — not just patch it case by case.

---

## The Core Problem: Contract Drift

When backend and frontend are developed separately, it's easy for the data contract to drift:

- Backend renames `personalNumber` → `personalPhone`
- Frontend still uses `personalNumber`
- No compile error, no immediate warning
- Users see broken UI or empty fields

The deeper issue: **frontend was manually maintaining its own type definitions** instead of deriving them from the actual backend contract.

---

## The Solution: Schema-Driven Workflow

The idea is simple:

**Backend → OpenAPI Schema → Generated Types → Frontend**

Instead of writing TypeScript interfaces by hand and hoping they match, you:

1. Let the backend **generate** an OpenAPI schema
2. Use tooling to **generate TypeScript types** from that schema
3. Frontend **imports** those generated types

Now when backend changes, the schema changes, the types change, and TypeScript **tells you** what broke — at compile time, not at runtime.

---

## Why OpenAPI Schema Is More Than Just Documentation

A lot of developers treat Swagger/OpenAPI as just a documentation page at `/swagger`. That mental model undersells it.

Think of the OpenAPI schema as a **formal contract** between backend and frontend:

- It defines every endpoint, request shape, and response shape
- It's machine-readable
- It can be used to generate code
- It can be validated automatically in CI

Once you treat it as a contract, you can build tooling around it.

---

## The Workflow, Step by Step

### 1. Backend publishes an OpenAPI schema

With ASP.NET Core (C#), enabling Swagger is straightforward. The same API that serves your business data also exposes:

- Swagger UI: `/swagger`
- Schema JSON: `/swagger/v1/swagger.json`

No separate service needed. Your existing API container can serve both.

### 2. Commit the schema snapshot

Check the generated `openapi.json` into your repository. This snapshot serves as:

- The input for frontend type generation
- A reviewable diff when the contract changes
- The baseline for automated schema sync checks

### 3. Generate TypeScript types from the schema

A common tool for this is [`openapi-typescript`](https://github.com/openapi-ts/openapi-typescript):

```bash
npm install --save-dev openapi-typescript

# From a running backend
npx openapi-typescript http://localhost:5000/swagger/v1/swagger.json -o src/api/generated/schema.ts

# Or from a committed schema file
npx openapi-typescript ./openapi.json -o src/api/generated/schema.ts
```

### 4. Use generated types in frontend code

```ts
import type { paths } from "./api/generated/schema";

type ContactInfo =
  paths["/employees/{employeeId}/contact"]["get"]["responses"][200]["content"]["application/json"];

export async function fetchContactInfo(employeeId: string): Promise<ContactInfo> {
  const response = await axios.get<ContactInfo>(`/employees/${employeeId}/contact`);
  return response.data;
}
```

No more guessing the shape. No more hand-written interfaces. The types come directly from the backend definition.

### 5. Enforce sync in CI

Add an integration test that:
- Reads the committed `openapi.json`
- Requests the live `/swagger/v1/swagger.json` from the running API
- Fails if they differ

This makes it **impossible to forget** updating the schema. If someone changes a backend model and doesn't regenerate the schema, CI catches it before merge.

---

## What About Separate Repos?

You don't need frontend and backend in the same repo for this to work. The key is that:

1. **Backend publishes the schema** — either as a committed file, a CI artifact, or via a URL
2. **Frontend consumes it** — by downloading and regenerating types

Common publishing approaches in separate-repo setups:

| Approach | Description |
|---|---|
| CI artifact | Backend CI generates and uploads `openapi.json` as a build artifact |
| Object storage | Published to S3/blob storage after each backend build |
| Shared contract repo | A dedicated repo that only holds the schema file |
| Direct URL | Frontend CI downloads from the running backend's `/swagger/v1/swagger.json` |

The workflow stays the same. Only the distribution step changes.

---

## Naming Matters More Than You Think

Part of what this workflow makes visible: **field naming is a public API decision**.

Renaming `personalNumber` to `personalPhone` isn't just a code style change — it changes the contract. With schema-driven types, that rename shows up in:

- The OpenAPI schema diff
- The generated TypeScript types
- Any frontend code using the old name (now a compile error)

This is a feature. It makes contract changes explicit and reviewable.

### Decoupling internal names from external contract

Sometimes you want to refactor internal class or field names without breaking the external API. In C# with Swashbuckle, you can use the `[JsonPropertyName]` attribute or configure Swagger to use a different name:

```csharp
using System.Text.Json.Serialization;

public class ContactInfoView
{
    [JsonPropertyName("workPhone")]
    public string? WorkPhoneInternal { get; set; }
}
```

This way the internal property name can change, but the API contract stays stable.

---

## Complete C# Example

Here's a minimal end-to-end example showing the full setup.

### Backend: ASP.NET Core with Swagger

**`Program.cs`**

```csharp
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Employee API",
        Version = "v1"
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();
app.Run();
```

**`ContactInfoView.cs`**

```csharp
public class ContactInfoView
{
    public string? WorkPhone { get; set; }
    public string? PersonalPhone { get; set; }
    public string? WorkEmail { get; set; }
    public string? PersonalEmail { get; set; }
}
```

**`EmployeesController.cs`**

```csharp
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("employees")]
public class EmployeesController : ControllerBase
{
    [HttpGet("{employeeId}/contact")]
    public ActionResult<ContactInfoView> GetContact(string employeeId)
    {
        // In real code, fetch from database
        return Ok(new ContactInfoView
        {
            WorkPhone = "555-0100",
            PersonalPhone = "555-0101",
            WorkEmail = "john@work.com",
            PersonalEmail = "john@example.com"
        });
    }
}
```

After running the API, the schema is available at:

```
http://localhost:5000/swagger/v1/swagger.json
```

### Fetch and commit the schema

```bash
curl http://localhost:5000/swagger/v1/swagger.json -o openapi.json
```

Check this file into your repo.

### Generate TypeScript types

**`package.json`**

```json
{
  "scripts": {
    "generate:api-types": "openapi-typescript ./openapi.json -o src/api/generated/schema.ts"
  }
}
```

```bash
npm run generate:api-types
```

### Use in frontend

```ts
// src/api/contact.ts
import axios from "axios";
import type { paths } from "./generated/schema";

type ContactInfo =
  paths["/employees/{employeeId}/contact"]["get"]["responses"][200]["content"]["application/json"];

export async function fetchContactInfo(employeeId: string): Promise<ContactInfo> {
  const { data } = await axios.get<ContactInfo>(`/employees/${employeeId}/contact`);
  return data;
}
```

Now if you rename `WorkPhone` to `WorkNumber` in the C# model, regenerate the schema and types, TypeScript will immediately show errors everywhere `workPhone` is used in the frontend. No more silent runtime bugs.

---

## Key Takeaways

- **Backend is the source of truth.** Frontend should never guess data shapes.
- **Generate types, don't write them.** If a schema exists, use it.
- **CI can enforce architecture, not just business logic.** Schema sync tests prevent drift automatically.
- **Naming is a contract decision.** Explicit names reduce bugs and improve readability.
- **You don't need a separate schema service.** Your existing backend API can expose the schema via Swagger.

---

## Before vs. After

| Before | After |
|---|---|
| Frontend hand-writes type interfaces | Types generated from schema |
| Backend and frontend drift silently | Schema sync test fails in CI |
| Rename = hope frontend stays in sync | Rename = compile error guides you |
| Duplicated type definitions | Single source of truth |
| Runtime surprises | Compile-time errors |

The mental shift is:

> From "keeping frontend and backend in sync manually" to "letting the contract enforce consistency automatically."
