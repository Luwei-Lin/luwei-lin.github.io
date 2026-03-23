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
    expect(screen.getAllByText(/TypeScript/).length).toBeGreaterThan(0);
  });

  it('renders CERTIFICATIONS section', () => {
    render(<ResumePDF data={DEFAULT_RESUME_DATA} />);
    expect(screen.getByText('CERTIFICATIONS')).toBeInTheDocument();
    expect(screen.getByText(/Google Data Analytics/)).toBeInTheDocument();
  });
});
