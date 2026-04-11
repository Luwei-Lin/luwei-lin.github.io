'use client';

import { useRef, useState } from 'react';

export default function ResumePreviewButton() {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handleDownload() {
    iframeRef.current?.contentWindow?.print();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg mb-10 transition-colors"
      >
        View Resume
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-white flex flex-col w-screen h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
              <span className="font-semibold text-gray-800 text-sm">Resume Preview</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-700 text-xl leading-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* iframe */}
            <iframe
              ref={iframeRef}
              src="/Luwei-Lin-Resume-Full-Stack-2026.pdf"
              className="flex-1 w-full rounded-b-lg"
              title="Resume Preview"
            />
          </div>
        </div>
      )}
    </>
  );
}
