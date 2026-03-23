'use client';

import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
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
