# Resume Builder Tool Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a public resume builder page at `/tools/resume-builder` where visitors fill in a form and get a live-preview PDF generated client-side using `@react-pdf/renderer`.

**Architecture:** Three new files — `lib/resume-types.ts` (shared types + default data), `components/ResumePDF.tsx` (`@react-pdf/renderer` document), `components/ResumeForm.tsx` (form with dynamic add/remove), and `app/tools/resume-builder/page.tsx` (two-panel layout). PDFViewer is dynamically imported with `ssr: false` because the site uses `output: 'export'` (static). Navigation gets a new "Tools" link.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS · `@react-pdf/renderer` · Vitest + React Testing Library

---

### Task 1: Install @react-pdf/renderer and define shared types

**Files:**
- Modify: `blog-source/package.json` (via npm install)
- Create: `blog-source/lib/resume-types.ts`

**Step 1: Install the package**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm install @react-pdf/renderer
```

Expected: package installs without errors, `@react-pdf/renderer` appears in `package.json` dependencies.

**Step 2: Create the types file**

Create `blog-source/lib/resume-types.ts`:

```typescript
export interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  dates: string;
  honors: string;
}

export interface BulletEntry {
  id: string;
  text: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  dates: string;
  location: string;
  bullets: BulletEntry[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  dates: string;
  bullets: BulletEntry[];
}

export interface Skills {
  programming: string;
  databases: string;
  frameworks: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  credentialId: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: Skills;
  certifications: CertificationEntry[];
}

export const DEFAULT_RESUME_DATA: ResumeData = {
  personal: {
    name: 'Luwei (Luis) Lin',
    phone: '431-777-9095',
    email: 'luwei2@ualberta.ca',
    location: 'Edmonton, AB',
    linkedin: 'https://www.linkedin.com/in/luwei-lin',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'University of Alberta, Edmonton, AB, Canada',
      degree: 'Bachelor of Science, double major in Computing Science and Statistics',
      dates: 'Sept 2021 - Apr 2025',
      honors: "Dean's Honor Roll List",
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Avanti HCM Software, Calgary, AB',
      role: 'Software Development Engineer (Web Fullstack & PC), Full-time',
      dates: 'April 2024 - Present',
      location: 'Calgary, AB',
      bullets: [
        { id: 'b1', text: 'Deployed desktop app features as Jira tickets required in C# and .Net.' },
        { id: 'b2', text: 'Added new components to the front-end and implemented new endpoints and services in TypeScript and React Hooks.' },
        { id: 'b3', text: 'Experienced in state management with Redux, providing efficient state updates without unnecessary re-renders.' },
        { id: 'b4', text: 'Implemented database schemas and maintain system components integral to the functionality of the product.' },
      ],
    },
    {
      id: 'exp-2',
      company: 'Arista Networks, Routing Team, Vancouver, BC',
      role: 'Software Development Engineer, Full-time Intern',
      dates: 'Sep 2023 - Dec 2023',
      location: 'Vancouver, BC',
      bullets: [
        { id: 'b1', text: 'Implemented solutions to reduce route convergence time by C++ with DFS and BFS algorithms in the CI/CD pipeline.' },
        { id: 'b2', text: 'Optimized existing codes for the maintenance and fixed the Serv1, Serv2 bugs.' },
        { id: 'b3', text: 'Wrote test plan specifications for features and implemented automated test programs to execute the cases in Python3.' },
        { id: 'b4', text: 'Designed and deployed a .yaml script to define router configurations in Arista Cloud Service.' },
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'QRCode Event Management',
      dates: 'Jan 2024 - Apr 2024',
      bullets: [
        { id: 'b1', text: 'Implemented an android mobile app with Java and Firebase in Android Studio.' },
        { id: 'b2', text: 'Designed and deployed factory and template pattern in the backend service.' },
        { id: 'b3', text: 'Embed with Google Machine Learning Kit to operate image processing.' },
      ],
    },
  ],
  skills: {
    programming: 'C#, Python, C++, C, Java, JavaScript, TypeScript, R, Julia, HTML5',
    databases: 'PostgreSQL, MongoDB, SQLite3, Scikit-Learn, Pandas, NumPy, SpaCy, Tableau',
    frameworks: 'Linux, Perforce, Git, .Net, Flask, React, Node.js, Postman, Yarn, Npm, Socket.io, WebRTC',
  },
  certifications: [
    { id: 'cert-1', name: 'Google Data Analytics Professional Certificate', credentialId: '7A53U94GF9J7' },
    { id: 'cert-2', name: 'CCIE (Cisco Certified Enterprise Infrastructure)', credentialId: 'HC2CG8LKN3Q1QRW0' },
    { id: 'cert-3', name: 'CCNP (Cisco Certified Network Enterprise)', credentialId: 'VGWVGBJHBLF1QDC0' },
    { id: 'cert-4', name: 'CCNA (Cisco Certified Network Associate)', credentialId: '37WWCBNHLCV11H5D' },
  ],
};
```

**Step 3: Verify TypeScript compiles**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm run type:check 2>&1 | tail -5
```

Expected: no errors.

**Step 4: Commit**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io && git add blog-source/package.json blog-source/package-lock.json blog-source/lib/resume-types.ts && git commit -m "feat: install @react-pdf/renderer and add resume types"
```

---

### Task 2: Create ResumePDF component (TDD)

**Files:**
- Create: `blog-source/__tests__/ResumePDF.test.tsx`
- Create: `blog-source/components/ResumePDF.tsx`

**Step 1: Write the failing test**

Create `blog-source/__tests__/ResumePDF.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResumePDF from '@/components/ResumePDF';
import { DEFAULT_RESUME_DATA } from '@/lib/resume-types';

// Mock @react-pdf/renderer — it doesn't render to DOM
vi.mock('@react-pdf/renderer', () => ({
  Document: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-document">{children}</div>,
  Page: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-page">{children}</div>,
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Link: ({ children, src }: { children: React.ReactNode; src: string }) => <a href={src}>{children}</a>,
  StyleSheet: { create: <T extends object>(styles: T): T => styles },
}));

describe('ResumePDF', () => {
  it('renders the applicant name', () => {
    render(<ResumePDF data={DEFAULT_RESUME_DATA} />);
    expect(screen.getByText('Luwei (Luis) Lin')).toBeInTheDocument();
  });

  it('renders contact info', () => {
    render(<ResumePDF data={DEFAULT_RESUME_DATA} />);
    expect(screen.getByText(/431-777-9095/)).toBeInTheDocument();
    expect(screen.getByText(/luwei2@ualberta\.ca/)).toBeInTheDocument();
  });

  it('renders EDUCATION section', () => {
    render(<ResumePDF data={DEFAULT_RESUME_DATA} />);
    expect(screen.getByText('EDUCATION')).toBeInTheDocument();
    expect(screen.getByText(/University of Alberta/)).toBeInTheDocument();
  });

  it('renders PROFESSIONAL EXPERIENCE section', () => {
    render(<ResumePDF data={DEFAULT_RESUME_DATA} />);
    expect(screen.getByText('PROFESSIONAL EXPERIENCE')).toBeInTheDocument();
    expect(screen.getByText(/Avanti HCM Software/)).toBeInTheDocument();
  });

  it('renders RELEVANT PROJECTS section', () => {
    render(<ResumePDF data={DEFAULT_RESUME_DATA} />);
    expect(screen.getByText('RELEVANT PROJECTS')).toBeInTheDocument();
    expect(screen.getByText(/QRCode Event Management/)).toBeInTheDocument();
  });

  it('renders SKILLS section', () => {
    render(<ResumePDF data={DEFAULT_RESUME_DATA} />);
    expect(screen.getByText('SKILLS')).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
  });

  it('renders CERTIFICATIONS section', () => {
    render(<ResumePDF data={DEFAULT_RESUME_DATA} />);
    expect(screen.getByText('CERTIFICATIONS')).toBeInTheDocument();
    expect(screen.getByText(/Google Data Analytics/)).toBeInTheDocument();
  });
});
```

**Step 2: Run to verify it fails**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test -- ResumePDF 2>&1 | tail -10
```

Expected: FAIL — `ResumePDF` module not found.

**Step 3: Implement ResumePDF.tsx**

Create `blog-source/components/ResumePDF.tsx`:

```tsx
'use client';

import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData } from '@/lib/resume-types';

const s = StyleSheet.create({
  page: { paddingHorizontal: 36, paddingVertical: 36, fontFamily: 'Helvetica', fontSize: 10, color: '#000' },
  name: { fontSize: 20, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 3 },
  contactRow: { fontSize: 9, textAlign: 'center', marginBottom: 14 },
  sectionHeading: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginTop: 10, marginBottom: 2, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  bold: { fontFamily: 'Helvetica-Bold' },
  italic: { fontFamily: 'Helvetica-Oblique' },
  bullet: { flexDirection: 'row', marginLeft: 10, marginBottom: 1 },
  bulletDot: { width: 10, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9 },
  skillRow: { flexDirection: 'row', marginBottom: 2 },
  skillLabel: { fontFamily: 'Helvetica-Bold', width: 130, fontSize: 9 },
  skillValue: { flex: 1, fontSize: 9 },
  certRow: { marginBottom: 2, fontSize: 9 },
});

interface Props {
  data: ResumeData;
}

export default function ResumePDF({ data }: Props) {
  const contactParts = [data.personal.phone, data.personal.email, data.personal.location].filter(Boolean);
  if (data.personal.linkedin) contactParts.push(data.personal.linkedin);

  return (
    <Document>
      <Page size="LETTER" style={s.page}>

        {/* Header */}
        <Text style={s.name}>{data.personal.name}</Text>
        <Text style={s.contactRow}>{contactParts.join(' | ')}</Text>

        {/* Education */}
        <Text style={s.sectionHeading}>EDUCATION</Text>
        {data.education.map((edu) => (
          <View key={edu.id}>
            <View style={s.row}>
              <Text style={s.bold}>{edu.institution}</Text>
              <Text>{edu.dates}</Text>
            </View>
            <Text style={s.italic}>{edu.degree}</Text>
            {edu.honors ? <Text>Rewards: {edu.honors}</Text> : null}
          </View>
        ))}

        {/* Experience */}
        <Text style={s.sectionHeading}>PROFESSIONAL EXPERIENCE</Text>
        {data.experience.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 6 }}>
            <View style={s.row}>
              <Text style={s.bold}>{exp.role} | {exp.company}</Text>
              <Text>{exp.dates}</Text>
            </View>
            {exp.bullets.map((b) => (
              <View key={b.id} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{b.text}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Projects */}
        <Text style={s.sectionHeading}>RELEVANT PROJECTS</Text>
        {data.projects.map((proj) => (
          <View key={proj.id} style={{ marginBottom: 6 }}>
            <View style={s.row}>
              <Text style={s.bold}>{proj.name}</Text>
              <Text>{proj.dates}</Text>
            </View>
            {proj.bullets.map((b) => (
              <View key={b.id} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{b.text}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Skills */}
        <Text style={s.sectionHeading}>SKILLS</Text>
        {[
          { label: 'Programming', value: data.skills.programming },
          { label: 'Database & Libraries', value: data.skills.databases },
          { label: 'Frames & Tools', value: data.skills.frameworks },
        ].map(({ label, value }) => (
          <View key={label} style={s.skillRow}>
            <Text style={s.skillLabel}>{label}</Text>
            <Text style={s.skillValue}>{value}</Text>
          </View>
        ))}

        {/* Certifications */}
        <Text style={s.sectionHeading}>CERTIFICATIONS</Text>
        {data.certifications.map((cert) => (
          <Text key={cert.id} style={s.certRow}>
            <Text style={s.bold}>{cert.name}</Text>
            {cert.credentialId ? `  Credential ID: ${cert.credentialId}` : ''}
          </Text>
        ))}

      </Page>
    </Document>
  );
}
```

**Step 4: Run tests to verify they pass**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test -- ResumePDF 2>&1 | tail -15
```

Expected: 7/7 PASS.

**Step 5: Run full suite**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test 2>&1 | tail -10
```

Expected: all tests pass.

**Step 6: Commit**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io && git add blog-source/__tests__/ResumePDF.test.tsx blog-source/components/ResumePDF.tsx && git commit -m "feat: add ResumePDF component with @react-pdf/renderer"
```

---

### Task 3: Create ResumeForm component (TDD)

**Files:**
- Create: `blog-source/__tests__/ResumeForm.test.tsx`
- Create: `blog-source/components/ResumeForm.tsx`

**Step 1: Write the failing test**

Create `blog-source/__tests__/ResumeForm.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResumeForm from '@/components/ResumeForm';
import { DEFAULT_RESUME_DATA } from '@/lib/resume-types';
import type { ResumeData } from '@/lib/resume-types';

describe('ResumeForm', () => {
  it('renders all section headings', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Certifications')).toBeInTheDocument();
  });

  it('renders personal info fields with default values', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('Luwei (Luis) Lin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('luwei2@ualberta.ca')).toBeInTheDocument();
  });

  it('calls onChange when a personal info field changes', () => {
    const handleChange = vi.fn();
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={handleChange} />);
    const nameInput = screen.getByDisplayValue('Luwei (Luis) Lin');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(handleChange).toHaveBeenCalledOnce();
    const updated: ResumeData = handleChange.mock.calls[0][0];
    expect(updated.personal.name).toBe('Jane Doe');
  });

  it('renders Add Education button', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Add Education/i })).toBeInTheDocument();
  });

  it('calls onChange with a new education entry when Add Education is clicked', () => {
    const handleChange = vi.fn();
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Education/i }));
    const updated: ResumeData = handleChange.mock.calls[0][0];
    expect(updated.education).toHaveLength(DEFAULT_RESUME_DATA.education.length + 1);
  });

  it('calls onChange with education entry removed when remove button is clicked', () => {
    const handleChange = vi.fn();
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={handleChange} />);
    const removeButtons = screen.getAllByRole('button', { name: /Remove education/i });
    fireEvent.click(removeButtons[0]);
    const updated: ResumeData = handleChange.mock.calls[0][0];
    expect(updated.education).toHaveLength(DEFAULT_RESUME_DATA.education.length - 1);
  });

  it('renders Add Experience button', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Add Experience/i })).toBeInTheDocument();
  });

  it('calls onChange with a new experience entry when Add Experience is clicked', () => {
    const handleChange = vi.fn();
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Experience/i }));
    const updated: ResumeData = handleChange.mock.calls[0][0];
    expect(updated.experience).toHaveLength(DEFAULT_RESUME_DATA.experience.length + 1);
  });

  it('renders Add Project button', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Add Project/i })).toBeInTheDocument();
  });

  it('renders Add Certification button', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Add Certification/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run to verify it fails**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test -- ResumeForm 2>&1 | tail -10
```

Expected: FAIL — `ResumeForm` module not found.

**Step 3: Implement ResumeForm.tsx**

Create `blog-source/components/ResumeForm.tsx`:

```tsx
'use client';

import type { ResumeData, EducationEntry, ExperienceEntry, ProjectEntry, CertificationEntry, BulletEntry } from '@/lib/resume-types';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

function newId() {
  return Math.random().toString(36).slice(2);
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3 mt-6">{children}</h2>;
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const cls = "w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400";
  return (
    <div className="mb-2">
      <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
      {multiline ? (
        <textarea className={cls} rows={2} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={cls} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export default function ResumeForm({ data, onChange }: Props) {
  const update = (patch: Partial<ResumeData>) => onChange({ ...data, ...patch });

  // --- Personal Info ---
  const setPersonal = (key: keyof typeof data.personal, val: string) =>
    update({ personal: { ...data.personal, [key]: val } });

  // --- Education ---
  const addEducation = () => update({
    education: [...data.education, { id: newId(), institution: '', degree: '', dates: '', honors: '' }],
  });
  const removeEducation = (id: string) => update({ education: data.education.filter((e) => e.id !== id) });
  const setEducation = (id: string, patch: Partial<EducationEntry>) =>
    update({ education: data.education.map((e) => e.id === id ? { ...e, ...patch } : e) });

  // --- Experience ---
  const addExperience = () => update({
    experience: [...data.experience, { id: newId(), company: '', role: '', dates: '', location: '', bullets: [{ id: newId(), text: '' }] }],
  });
  const removeExperience = (id: string) => update({ experience: data.experience.filter((e) => e.id !== id) });
  const setExperience = (id: string, patch: Partial<ExperienceEntry>) =>
    update({ experience: data.experience.map((e) => e.id === id ? { ...e, ...patch } : e) });
  const addBullet = (expId: string) => {
    const exp = data.experience.find((e) => e.id === expId)!;
    setExperience(expId, { bullets: [...exp.bullets, { id: newId(), text: '' }] });
  };
  const removeBullet = (expId: string, bulletId: string) => {
    const exp = data.experience.find((e) => e.id === expId)!;
    setExperience(expId, { bullets: exp.bullets.filter((b) => b.id !== bulletId) });
  };
  const setBullet = (expId: string, bulletId: string, text: string) => {
    const exp = data.experience.find((e) => e.id === expId)!;
    setExperience(expId, { bullets: exp.bullets.map((b) => b.id === bulletId ? { ...b, text } : b) });
  };

  // --- Projects ---
  const addProject = () => update({
    projects: [...data.projects, { id: newId(), name: '', dates: '', bullets: [{ id: newId(), text: '' }] }],
  });
  const removeProject = (id: string) => update({ projects: data.projects.filter((p) => p.id !== id) });
  const setProject = (id: string, patch: Partial<ProjectEntry>) =>
    update({ projects: data.projects.map((p) => p.id === id ? { ...p, ...patch } : p) });
  const addProjectBullet = (projId: string) => {
    const proj = data.projects.find((p) => p.id === projId)!;
    setProject(projId, { bullets: [...proj.bullets, { id: newId(), text: '' }] });
  };
  const removeProjectBullet = (projId: string, bulletId: string) => {
    const proj = data.projects.find((p) => p.id === projId)!;
    setProject(projId, { bullets: proj.bullets.filter((b) => b.id !== bulletId) });
  };
  const setProjectBullet = (projId: string, bulletId: string, text: string) => {
    const proj = data.projects.find((p) => p.id === projId)!;
    setProject(projId, { bullets: proj.bullets.map((b) => b.id === bulletId ? { ...b, text } : b) });
  };

  // --- Certifications ---
  const addCertification = () => update({
    certifications: [...data.certifications, { id: newId(), name: '', credentialId: '' }],
  });
  const removeCertification = (id: string) => update({ certifications: data.certifications.filter((c) => c.id !== id) });
  const setCertification = (id: string, patch: Partial<CertificationEntry>) =>
    update({ certifications: data.certifications.map((c) => c.id === id ? { ...c, ...patch } : c) });

  return (
    <div className="space-y-2">

      {/* Personal Info */}
      <SectionHeading>Personal Info</SectionHeading>
      <Field label="Full Name" value={data.personal.name} onChange={(v) => setPersonal('name', v)} />
      <Field label="Phone" value={data.personal.phone} onChange={(v) => setPersonal('phone', v)} />
      <Field label="Email" value={data.personal.email} onChange={(v) => setPersonal('email', v)} />
      <Field label="Location" value={data.personal.location} onChange={(v) => setPersonal('location', v)} />
      <Field label="LinkedIn URL" value={data.personal.linkedin} onChange={(v) => setPersonal('linkedin', v)} />

      {/* Education */}
      <SectionHeading>Education</SectionHeading>
      {data.education.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded p-3 mb-2 relative">
          <button
            onClick={() => removeEducation(edu.id)}
            aria-label="Remove education"
            className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs"
          >
            ✕
          </button>
          <Field label="Institution" value={edu.institution} onChange={(v) => setEducation(edu.id, { institution: v })} />
          <Field label="Degree" value={edu.degree} onChange={(v) => setEducation(edu.id, { degree: v })} />
          <Field label="Dates" value={edu.dates} onChange={(v) => setEducation(edu.id, { dates: v })} />
          <Field label="Honors / Awards" value={edu.honors} onChange={(v) => setEducation(edu.id, { honors: v })} />
        </div>
      ))}
      <button onClick={addEducation} className="text-sm text-blue-600 hover:text-blue-700">+ Add Education</button>

      {/* Experience */}
      <SectionHeading>Experience</SectionHeading>
      {data.experience.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded p-3 mb-2 relative">
          <button
            onClick={() => removeExperience(exp.id)}
            aria-label="Remove experience"
            className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs"
          >
            ✕
          </button>
          <Field label="Company" value={exp.company} onChange={(v) => setExperience(exp.id, { company: v })} />
          <Field label="Role / Title" value={exp.role} onChange={(v) => setExperience(exp.id, { role: v })} />
          <Field label="Dates" value={exp.dates} onChange={(v) => setExperience(exp.id, { dates: v })} />
          <Field label="Location" value={exp.location} onChange={(v) => setExperience(exp.id, { location: v })} />
          <p className="text-xs text-gray-500 mt-2 mb-1">Bullet points</p>
          {exp.bullets.map((b) => (
            <div key={b.id} className="flex gap-1 mb-1">
              <input
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                value={b.text}
                onChange={(e) => setBullet(exp.id, b.id, e.target.value)}
                placeholder="Bullet point..."
                aria-label="Experience bullet"
              />
              <button onClick={() => removeBullet(exp.id, b.id)} className="text-red-400 hover:text-red-600 text-xs px-1" aria-label="Remove bullet">✕</button>
            </div>
          ))}
          <button onClick={() => addBullet(exp.id)} className="text-xs text-blue-600 hover:text-blue-700">+ Add bullet</button>
        </div>
      ))}
      <button onClick={addExperience} className="text-sm text-blue-600 hover:text-blue-700">+ Add Experience</button>

      {/* Projects */}
      <SectionHeading>Projects</SectionHeading>
      {data.projects.map((proj) => (
        <div key={proj.id} className="border border-gray-200 rounded p-3 mb-2 relative">
          <button
            onClick={() => removeProject(proj.id)}
            aria-label="Remove project"
            className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs"
          >
            ✕
          </button>
          <Field label="Project Name" value={proj.name} onChange={(v) => setProject(proj.id, { name: v })} />
          <Field label="Dates" value={proj.dates} onChange={(v) => setProject(proj.id, { dates: v })} />
          <p className="text-xs text-gray-500 mt-2 mb-1">Bullet points</p>
          {proj.bullets.map((b) => (
            <div key={b.id} className="flex gap-1 mb-1">
              <input
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                value={b.text}
                onChange={(e) => setProjectBullet(proj.id, b.id, e.target.value)}
                placeholder="Bullet point..."
                aria-label="Project bullet"
              />
              <button onClick={() => removeProjectBullet(proj.id, b.id)} className="text-red-400 hover:text-red-600 text-xs px-1" aria-label="Remove bullet">✕</button>
            </div>
          ))}
          <button onClick={() => addProjectBullet(proj.id)} className="text-xs text-blue-600 hover:text-blue-700">+ Add bullet</button>
        </div>
      ))}
      <button onClick={addProject} className="text-sm text-blue-600 hover:text-blue-700">+ Add Project</button>

      {/* Skills */}
      <SectionHeading>Skills</SectionHeading>
      <Field label="Programming" value={data.skills.programming} onChange={(v) => update({ skills: { ...data.skills, programming: v } })} multiline />
      <Field label="Databases & Libraries" value={data.skills.databases} onChange={(v) => update({ skills: { ...data.skills, databases: v } })} multiline />
      <Field label="Frameworks & Tools" value={data.skills.frameworks} onChange={(v) => update({ skills: { ...data.skills, frameworks: v } })} multiline />

      {/* Certifications */}
      <SectionHeading>Certifications</SectionHeading>
      {data.certifications.map((cert) => (
        <div key={cert.id} className="border border-gray-200 rounded p-3 mb-2 relative">
          <button
            onClick={() => removeCertification(cert.id)}
            aria-label="Remove certification"
            className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs"
          >
            ✕
          </button>
          <Field label="Certificate Name" value={cert.name} onChange={(v) => setCertification(cert.id, { name: v })} />
          <Field label="Credential ID" value={cert.credentialId} onChange={(v) => setCertification(cert.id, { credentialId: v })} />
        </div>
      ))}
      <button onClick={addCertification} className="text-sm text-blue-600 hover:text-blue-700">+ Add Certification</button>

    </div>
  );
}
```

**Step 4: Run tests to verify they pass**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test -- ResumeForm 2>&1 | tail -15
```

Expected: 10/10 PASS.

**Step 5: Run full suite**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test 2>&1 | tail -10
```

Expected: all tests pass.

**Step 6: Commit**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io && git add blog-source/__tests__/ResumeForm.test.tsx blog-source/components/ResumeForm.tsx && git commit -m "feat: add ResumeForm component with dynamic add/remove"
```

---

### Task 4: Create resume-builder page (TDD)

**Files:**
- Create: `blog-source/__tests__/ResumeBuilderPage.test.tsx`
- Create: `blog-source/app/tools/resume-builder/page.tsx`

**Step 1: Write the failing test**

Create `blog-source/__tests__/ResumeBuilderPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock next/dynamic (PDFViewer is SSR-incompatible)
vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="pdf-viewer-mock">PDF Preview</div>,
}));

// Mock @react-pdf/renderer
vi.mock('@react-pdf/renderer', () => ({
  Document: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  StyleSheet: { create: <T extends object>(s: T): T => s },
  PDFViewer: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-viewer">{children}</div>,
}));

import ResumeBuilderPage from '@/app/tools/resume-builder/page';

describe('ResumeBuilderPage', () => {
  it('renders the page heading', () => {
    render(<ResumeBuilderPage />);
    expect(screen.getByRole('heading', { name: /Resume Builder/i })).toBeInTheDocument();
  });

  it('renders the form with Personal Info section', () => {
    render(<ResumeBuilderPage />);
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
  });

  it('renders the form with Experience section', () => {
    render(<ResumeBuilderPage />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('renders the PDF viewer panel', () => {
    render(<ResumeBuilderPage />);
    expect(screen.getByTestId('pdf-viewer-mock')).toBeInTheDocument();
  });
});
```

**Step 2: Run to verify it fails**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test -- ResumeBuilderPage 2>&1 | tail -10
```

Expected: FAIL — page module not found.

**Step 3: Create the page**

First create the directory:
```bash
mkdir -p /Users/luis/Documents/GitHub/luwei.github.io/blog-source/app/tools/resume-builder
```

Create `blog-source/app/tools/resume-builder/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ResumeForm from '@/components/ResumeForm';
import ResumePDF from '@/components/ResumePDF';
import { DEFAULT_RESUME_DATA } from '@/lib/resume-types';
import type { ResumeData } from '@/lib/resume-types';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-gray-100 rounded text-gray-400 text-sm">
        Loading preview...
      </div>
    ),
  }
);

export default function ResumeBuilderPage() {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME_DATA);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Fill in your details below. The PDF preview updates live. Pre-filled with an example — replace with your own info.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left: Form */}
        <div className="w-full lg:w-1/2 overflow-y-auto">
          <ResumeForm data={data} onChange={setData} />
        </div>

        {/* Right: PDF Preview (desktop) */}
        <div className="hidden lg:flex lg:w-1/2 sticky top-20 self-start h-[85vh]">
          <PDFViewer width="100%" height="100%" showToolbar>
            <ResumePDF data={data} />
          </PDFViewer>
        </div>

      </div>

      {/* Mobile: Generate button */}
      <div className="lg:hidden mt-8">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // On mobile, open PDF in new tab using blob URL
            import('@react-pdf/renderer').then(({ pdf }) => {
              pdf(<ResumePDF data={data} />).toBlob().then((blob) => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
              });
            });
          }}
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Generate PDF (opens in new tab)
        </a>
      </div>

    </div>
  );
}
```

**Step 4: Run tests to verify they pass**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test -- ResumeBuilderPage 2>&1 | tail -15
```

Expected: 4/4 PASS.

**Step 5: Run full suite**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test 2>&1 | tail -10
```

Expected: all tests pass.

**Step 6: Commit**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io && git add blog-source/__tests__/ResumeBuilderPage.test.tsx blog-source/app/tools/resume-builder/page.tsx && git commit -m "feat: add resume builder page with two-panel layout"
```

---

### Task 5: Add Tools link to navigation (TDD)

**Files:**
- Modify: `blog-source/__tests__/Navigation.test.tsx`
- Modify: `blog-source/components/Navigation.tsx`

**Step 1: Update the failing test**

In `blog-source/__tests__/Navigation.test.tsx`, add one test inside the existing `describe('Navigation', ...)` block:

```tsx
it('renders Tools nav link', () => {
  render(<Navigation />);
  expect(screen.getAllByRole('link', { name: 'Tools' })).toHaveLength(1);
});
```

**Step 2: Run to verify it fails**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test -- Navigation 2>&1 | tail -10
```

Expected: the new test FAILS — "Tools" link not found yet.

**Step 3: Add the Tools link**

In `blog-source/components/Navigation.tsx`, find the `navItems` array (line 23) and add the Tools entry:

```typescript
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/tools/resume-builder', label: 'Tools' },
];
```

**Step 4: Run tests to verify they pass**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test -- Navigation 2>&1 | tail -10
```

Expected: 4/4 PASS.

**Step 5: Run full suite**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source && npm test 2>&1 | tail -10
```

Expected: all tests pass.

**Step 6: Commit**

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io && git add blog-source/components/Navigation.tsx blog-source/__tests__/Navigation.test.tsx && git commit -m "feat: add Tools link to navigation"
```
