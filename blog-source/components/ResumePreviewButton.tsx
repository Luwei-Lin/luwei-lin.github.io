'use client';

import { useState } from 'react';

export default function ResumePreviewButton() {
  const [open, setOpen] = useState(false);

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
            className="relative bg-white rounded-lg shadow-2xl flex flex-col"
            style={{ width: '820px', height: '90vh', maxWidth: '95vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
              <span className="font-semibold text-gray-800 text-sm">Resume Preview</span>
              <div className="flex items-center gap-3">
                <a
                  href="/Luwei_Lin_Resume.html"
                  download="Luwei-Lin-Resume-Full-Stack-2026"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors"
                >
                  Download
                </a>
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
              src="/Luwei_Lin_Resume.html"
              className="flex-1 w-full rounded-b-lg"
              title="Resume Preview"
            />
          </div>
        </div>
      )}
    </>
  );
}
