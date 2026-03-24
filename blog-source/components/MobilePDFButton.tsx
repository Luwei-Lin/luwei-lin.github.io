'use client';

import type { ResumeData } from '@/lib/resume-types';

interface Props {
  data: ResumeData;
}

export default function MobilePDFButton({ data }: Props) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const [{ pdf }, { default: ResumePDF }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/ResumePDF'),
    ]);
    const blob = await pdf(<ResumePDF data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
    >
      Generate PDF (opens in new tab)
    </a>
  );
}
