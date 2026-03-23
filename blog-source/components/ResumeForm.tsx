'use client';

import type { ResumeData, EducationEntry, ExperienceEntry, ProjectEntry, CertificationEntry } from '@/lib/resume-types';

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
