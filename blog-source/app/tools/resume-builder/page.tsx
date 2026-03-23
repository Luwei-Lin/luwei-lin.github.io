'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ResumeForm from '@/components/ResumeForm';
import { DEFAULT_RESUME_DATA } from '@/lib/resume-types';
import type { ResumeData } from '@/lib/resume-types';

const PDFPreviewPanel = dynamic(() => import('@/components/PDFPreviewPanel'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-100 rounded text-gray-400 text-sm">
      Loading preview...
    </div>
  ),
});

const MobilePDFButton = dynamic(() => import('@/components/MobilePDFButton'), { ssr: false });

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
          <PDFPreviewPanel data={data} />
        </div>

      </div>

      {/* Mobile: Generate button */}
      <div className="lg:hidden mt-8">
        <MobilePDFButton data={data} />
      </div>

    </div>
  );
}
