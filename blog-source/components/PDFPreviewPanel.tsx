'use client';

import { PDFViewer } from '@react-pdf/renderer';
import ResumePDF from '@/components/ResumePDF';
import type { ResumeData } from '@/lib/resume-types';

export default function PDFPreviewPanel({ data }: { data: ResumeData }) {
  return (
    <PDFViewer width="100%" height="100%" showToolbar>
      <ResumePDF data={data} />
    </PDFViewer>
  );
}
