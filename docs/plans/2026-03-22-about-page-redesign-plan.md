# About Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the placeholder About page with a real personal bio for Luwei (Luis) Lin, and add a resume PDF download button.

**Architecture:** Two tasks — copy the PDF into Next.js's `public/` directory so it's statically served, then rewrite `app/about/page.tsx` with a hero bio, three highlight cards, and social links. No new dependencies needed; everything uses existing Tailwind CSS classes.

**Tech Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · Vitest + React Testing Library

---

### Task 1: Copy PDF to public/

**Files:**
- Copy: `src/luwei-lin-resume-2024.pdf` → `blog-source/public/luwei-lin-resume-2024.pdf`

**Step 1: Copy the file**

```bash
cp /Users/luis/Documents/GitHub/luwei.github.io/src/luwei-lin-resume-2024.pdf \
   /Users/luis/Documents/GitHub/luwei.github.io/blog-source/public/luwei-lin-resume-2024.pdf
```

**Step 2: Verify it's there**

```bash
ls blog-source/public/
```

Expected output includes: `luwei-lin-resume-2024.pdf`

**Step 3: Commit**

```bash
git add blog-source/public/luwei-lin-resume-2024.pdf
git commit -m "feat: add resume PDF to public assets"
```

---

### Task 2: Write failing tests for the About page

**Files:**
- Create: `blog-source/__tests__/About.test.tsx`

**Step 1: Write the failing test**

Create `blog-source/__tests__/About.test.tsx` with this content:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutPage from '@/app/about/page';

describe('AboutPage', () => {
  it('renders the heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Luwei \(Luis\) Lin/i })).toBeInTheDocument();
  });

  it('renders the job title', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Software Developer · Avanti HCM/i)).toBeInTheDocument();
  });

  it('renders a download resume link', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /Download Resume/i });
    expect(link).toHaveAttribute('href', '/luwei-lin-resume-2024.pdf');
  });

  it('renders the Current Role card', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Current Role/i)).toBeInTheDocument();
    expect(screen.getByText(/Avanti HCM Software/i)).toBeInTheDocument();
  });

  it('renders the AI-Augmented Workflow card', () => {
    render(<AboutPage />);
    expect(screen.getByText(/AI-Augmented Workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/PR summaries/i)).toBeInTheDocument();
  });

  it('renders the Background card', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Background/i)).toBeInTheDocument();
    expect(screen.getByText(/University of Alberta/i)).toBeInTheDocument();
    expect(screen.getByText(/CCIE/i)).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /GitHub/i });
    expect(link).toHaveAttribute('href', 'https://github.com/Luwei-Lin');
  });

  it('renders LinkedIn link', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /LinkedIn/i });
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/luwei-lin');
  });

  it('renders email link', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /luwei2@ualberta\.ca/i });
    expect(link).toHaveAttribute('href', 'mailto:luwei2@ualberta.ca');
  });
});
```

**Step 2: Run to verify it fails**

```bash
cd blog-source && npm test -- About
```

Expected: All tests FAIL with "Cannot find module" or similar — the page doesn't have the new content yet.

**Step 3: Commit the failing tests**

```bash
git add blog-source/__tests__/About.test.tsx
git commit -m "test: add failing tests for About page redesign"
```

---

### Task 3: Implement the About page

**Files:**
- Modify: `blog-source/app/about/page.tsx` (full rewrite)

**Step 1: Replace the file with this implementation**

```tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <h1 className="text-4xl font-bold mb-2">Luwei (Luis) Lin</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
          Software Developer · Avanti HCM
        </p>

        {/* Download Button */}
        <a
          href="/luwei-lin-resume-2024.pdf"
          download
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg mb-10 transition-colors"
        >
          Download Resume (PDF)
        </a>

        {/* Bio */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p>
            Fullstack software developer with 2+ years of production experience at Avanti HCM,
            building enterprise HR software used by real organizations. Started as a co-op and
            converted to full-time — proof of consistent delivery, not just internship checkboxes.
          </p>
          <p>
            I work across the stack daily — TypeScript and React on the frontend, C# and .Net on
            the backend, PostgreSQL for data. I also hold a CCIE certification and interned at
            Arista Networks working on routing infrastructure in C++ — which means I understand
            the network layer that most web developers treat as a black box. That depth makes me
            a better systems thinker when debugging distributed issues or designing APIs.
          </p>
          <p>
            I use Claude Code as part of my regular workflow — writing PR summaries, clarifying
            tasks, generating test cases, and running agentic coding workflows. I treat AI as a
            force multiplier, not a crutch.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Card 1: Current Role */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-3">Current Role</h2>
            <p className="font-semibold text-sm mb-1">Avanti HCM Software</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Software Developer (SDE I)<br />
              April 2024 – Present · Calgary, AB<br />
              Co-op → Full-time
            </p>
            <div className="flex flex-wrap gap-1">
              {['TypeScript', 'React', 'Redux', 'C#', '.Net', 'PostgreSQL'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: AI-Augmented Workflow */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-3">AI-Augmented Workflow</h2>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 mb-3">
              <li>Writing PR summaries &amp; descriptions</li>
              <li>Task clarification &amp; ticket breakdown</li>
              <li>Generating &amp; reviewing test cases</li>
              <li>Agentic coding workflows &amp; skills</li>
            </ul>
            <div className="flex flex-wrap gap-1">
              {['Claude Code', 'TypeScript', 'React', 'C#', 'Git', 'Docker'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Background */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-3">Background</h2>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-medium">University of Alberta</span><br />
                B.Sc. Computing Science &amp; Statistics<br />
                Dean&apos;s Honor Roll
              </li>
              <li>
                <span className="font-medium">Cisco Certified:</span> CCIE · CCNP · CCNA
              </li>
              <li>
                <span className="font-medium">Google</span> Data Analytics Professional
              </li>
              <li className="text-gray-500 dark:text-gray-400 text-xs">
                Also: Arista Networks · U of A Research · ShopHopper · Mitacs
              </li>
            </ul>
          </div>

        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-6 text-sm">
          <a
            href="https://github.com/Luwei-Lin"
            className="text-blue-600 hover:text-blue-700 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/luwei-lin"
            className="text-blue-600 hover:text-blue-700 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="mailto:luwei2@ualberta.ca"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            luwei2@ualberta.ca
          </a>
        </div>

      </div>
    </div>
  );
}
```

**Step 2: Run the tests**

```bash
cd blog-source && npm test -- About
```

Expected: All 9 tests PASS.

**Step 3: Run the full test suite to make sure nothing is broken**

```bash
cd blog-source && npm test
```

Expected: All tests PASS.

**Step 4: Commit**

```bash
git add blog-source/app/about/page.tsx
git commit -m "feat: redesign About page with bio, highlight cards, and PDF download"
```

---

### Task 4: Smoke test in browser (manual)

**Step 1: Start dev server**

```bash
cd blog-source && npm run dev
```

**Step 2: Open http://localhost:3000/about**

Check:
- [ ] Name heading renders correctly
- [ ] "Download Resume (PDF)" button is visible and blue
- [ ] Clicking the button downloads the PDF
- [ ] Three cards render side-by-side on desktop
- [ ] Cards stack on mobile (resize browser to ~375px wide)
- [ ] GitHub, LinkedIn, email links are present

**Step 3: Stop dev server**

```bash
Ctrl+C
```
