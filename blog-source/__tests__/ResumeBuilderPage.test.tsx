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
