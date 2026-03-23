import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResumeForm from '@/components/ResumeForm';
import { DEFAULT_RESUME_DATA } from '@/lib/resume-types';
import type { ResumeData } from '@/lib/resume-types';

describe('ResumeForm', () => {
  it('renders all section headings', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Certifications')).toBeInTheDocument();
  });

  it('renders personal info fields with default values', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('Luwei (Luis) Lin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('luwei2@ualberta.ca')).toBeInTheDocument();
  });

  it('calls onChange when a personal info field changes', () => {
    const handleChange = vi.fn();
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={handleChange} />);
    const nameInput = screen.getByDisplayValue('Luwei (Luis) Lin');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(handleChange).toHaveBeenCalledOnce();
    const updated: ResumeData = handleChange.mock.calls[0][0];
    expect(updated.personal.name).toBe('Jane Doe');
  });

  it('renders Add Education button', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Add Education/i })).toBeInTheDocument();
  });

  it('calls onChange with a new education entry when Add Education is clicked', () => {
    const handleChange = vi.fn();
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Education/i }));
    const updated: ResumeData = handleChange.mock.calls[0][0];
    expect(updated.education).toHaveLength(DEFAULT_RESUME_DATA.education.length + 1);
  });

  it('calls onChange with education entry removed when remove button is clicked', () => {
    const handleChange = vi.fn();
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={handleChange} />);
    const removeButtons = screen.getAllByRole('button', { name: /Remove education/i });
    fireEvent.click(removeButtons[0]);
    const updated: ResumeData = handleChange.mock.calls[0][0];
    expect(updated.education).toHaveLength(DEFAULT_RESUME_DATA.education.length - 1);
  });

  it('renders Add Experience button', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Add Experience/i })).toBeInTheDocument();
  });

  it('calls onChange with a new experience entry when Add Experience is clicked', () => {
    const handleChange = vi.fn();
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Experience/i }));
    const updated: ResumeData = handleChange.mock.calls[0][0];
    expect(updated.experience).toHaveLength(DEFAULT_RESUME_DATA.experience.length + 1);
  });

  it('renders Add Project button', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Add Project/i })).toBeInTheDocument();
  });

  it('renders Add Certification button', () => {
    render(<ResumeForm data={DEFAULT_RESUME_DATA} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Add Certification/i })).toBeInTheDocument();
  });
});
