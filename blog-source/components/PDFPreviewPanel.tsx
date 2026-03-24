'use client';

import dynamic from 'next/dynamic';
import type { ResumeData } from '@/lib/resume-types';

const PDFViewerWithContent = dynamic(
  async () => {
    const [{ PDFViewer }, { default: ResumePDF }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/ResumePDF'),
    ]);
    return function PDFViewerInner({ data }: { data: ResumeData }) {
      return (
        <PDFViewer width="100%" height="100%" showToolbar>
          <ResumePDF data={data} />
        </PDFViewer>
      );
    };
  },
  { ssr: false }
);

export default function PDFPreviewPanel({ data }: { data: ResumeData }) {
  return <PDFViewerWithContent data={data} />;
}
