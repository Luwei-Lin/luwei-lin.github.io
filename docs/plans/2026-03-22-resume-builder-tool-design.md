# Resume Builder Tool — Design Document
Date: 2026-03-22

## Goal

Build a public resume builder tool at `/tools/resume-builder` where any visitor can fill in their details and generate a professionally formatted PDF resume matching Luwei's resume layout. The tool demonstrates fullstack/React skills and will be the subject of a future blog post.

## Technology

- **PDF generation:** `@react-pdf/renderer` (client-side, real vector PDF, text-searchable)
- **Framework:** Next.js 16 App Router, TypeScript, Tailwind CSS
- **No backend required** — fully static, runs in the browser

## Layout

### Desktop: Two-panel
- **Left panel** — scrollable form with all resume sections
- **Right panel** — sticky live `<PDFViewer>` preview that updates as the user types

### Mobile: Stacked
- Form on top
- "Generate PDF" button that opens the PDF in a new browser tab (PDFViewer is unusable on mobile)

## Form Sections

All sections pre-filled with Luwei's resume data as default values so visitors see a complete working example immediately.

### Personal Info (single entry)
- Full name
- Phone
- Email
- Location
- LinkedIn URL

### Education (dynamic — add/remove entries)
Per entry:
- Institution
- Degree
- Dates
- Honors/awards

### Experience (dynamic — add/remove entries)
Per entry:
- Company
- Role/title
- Dates
- Location
- Bullet points (dynamic — add/remove, up to ~6 per entry)

### Projects (dynamic — add/remove entries)
Per entry:
- Project name
- Dates
- Bullet points (dynamic — add/remove per entry)

### Skills (3 fixed rows — free text)
- Programming
- Databases & Libraries
- Frameworks & Tools

### Certifications (dynamic — add/remove entries)
Per entry:
- Name
- Credential ID

## PDF Output Design

Matches Luwei's existing resume layout:
- **Font:** Helvetica (built into @react-pdf/renderer, no external font needed)
- **Page size:** Letter (8.5×11 inches), 0.5in margins
- **Color:** Black and white only — prints cleanly
- **Header:** Name large + bold, contact info row below separated by `|`
- **Section headings:** ALL CAPS, bold, with full-width horizontal rule below
- **Experience/Project entries:** Company bold + dates right-aligned, role italic below, bullet list indented
- **Skills:** Bold label + plain text on same line
- **Certifications:** Bold name + credential ID

## New Files

| File | Purpose |
|------|---------|
| `blog-source/app/tools/resume-builder/page.tsx` | Two-panel page layout, holds all form state |
| `blog-source/components/ResumeForm.tsx` | All form sections with dynamic add/remove logic |
| `blog-source/components/ResumePDF.tsx` | `@react-pdf/renderer` PDF document component |

## Navigation

Add "Tools" link to `components/Navigation.tsx` pointing to `/tools/resume-builder`.

## Non-Goals

- No save/load (no backend, no localStorage persistence)
- No custom fonts or colors in PDF output
- No photo/avatar field
- No multiple templates
- No account or authentication
