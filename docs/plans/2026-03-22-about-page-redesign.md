# About Page Redesign — Design Document
Date: 2026-03-22

## Goal

Replace the placeholder About page with a real personal bio that positions Luwei (Luis) Lin as an intermediate fullstack software engineer for the current job market. Add a resume PDF download feature.

## Target Audience

Recruiters and hiring managers looking for intermediate software engineers (SDE I / SDE II) at companies building modern web products, especially those integrating AI features.

## Layout: Option B — Bio + Highlight Cards

### Section 1: Hero & Narrative

**Header:** Name + title line: `Software Developer · Avanti HCM`

**Download button:** Prominent blue CTA — "Download Resume (PDF)" — linking to `/luwei-lin-resume-2024.pdf` in `public/`. Placed between the title and the bio paragraphs.

**Bio (3 paragraphs):**

> **Para 1 — Who I am:**
> Fullstack software developer with 2+ years of production experience at Avanti HCM, building enterprise HR software used by real organizations. Started as a co-op and converted to full-time — proof of consistent delivery, not just internship checkboxes.

> **Para 2 — What I do:**
> Work across the stack daily — TypeScript and React on the frontend, C# and .Net on the backend, PostgreSQL for data. I also hold a CCIE certification and interned at Arista Networks working on routing infrastructure in C++ — which means I understand the network layer that most web developers treat as a black box. That depth makes me a better systems thinker when debugging distributed issues or designing APIs.

> **Para 3 — AI workflow:**
> I use Claude Code as part of my regular workflow — writing PR summaries, clarifying tasks, generating test cases, and running agentic coding workflows. I treat AI as a force multiplier, not a crutch.

---

### Section 2: Three Highlight Cards

Three cards in a responsive grid (3 columns on desktop, 1 on mobile).

**Card 1 — Current Role**
- Company: Avanti HCM Software
- Title: Software Developer (SDE I)
- Dates: April 2024 – Present · Calgary, AB
- Stack tags: TypeScript · React · Redux · C# · .Net · PostgreSQL
- Note: Co-op → Full-time conversion

**Card 2 — AI-Augmented Workflow**
- Bullet list of Claude Code use cases:
  - Writing PR summaries & descriptions
  - Task clarification & breaking down tickets
  - Generating and reviewing test cases
  - Agentic coding workflows & skills
- Stack tags: TypeScript · React · C# · Git · Docker

**Card 3 — Background**
- B.Sc. Computing Science & Statistics — University of Alberta (Dean's Honor Roll)
- CCIE · CCNP · CCNA — Cisco Certified
- Google Data Analytics Professional Certificate
- Previous roles: Arista Networks · U of A Research · ShopHopper · Mitacs

---

### Section 3: Social Links

Simple row at the bottom of the page:
- GitHub: https://github.com/Luwei-Lin
- LinkedIn: https://www.linkedin.com/in/luwei-lin
- Email: luwei2@ualberta.ca

---

## PDF Download Feature

- Copy `src/luwei-lin-resume-2024.pdf` to `blog-source/public/luwei-lin-resume-2024.pdf`
- Static file served by Next.js from `/luwei-lin-resume-2024.pdf`
- Button uses `<a href="/luwei-lin-resume-2024.pdf" download>` for direct download

## Files to Change

| File | Change |
|------|--------|
| `blog-source/app/about/page.tsx` | Full rewrite with bio, cards, download button |
| `blog-source/public/luwei-lin-resume-2024.pdf` | Copy PDF from `src/` |

## Non-Goals

- No full resume page (experience timeline, all jobs listed)
- No dark/light mode toggle (use existing theme)
- No contact form
- No animation or heavy UI libraries
