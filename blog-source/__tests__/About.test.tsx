import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutPage from '@/app/about/page';

describe('AboutPage', () => {
  it('renders the heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Luwei \(Luis\) Lin/i })).toBeInTheDocument();
  });

  it('renders the job title', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Software Developer · Avanti HCM/i)).toBeInTheDocument();
  });

  it('renders a view resume link', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /View Resume/i });
    expect(link).toHaveAttribute('href', '/luwei-lin-resume-2024.pdf');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders the Current Role card', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Current Role/i)).toBeInTheDocument();
    expect(screen.getByText(/Avanti HCM Software/i)).toBeInTheDocument();
  });

  it('renders the AI-Augmented Workflow card', () => {
    render(<AboutPage />);
    expect(screen.getByText(/AI-Augmented Workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/PR summaries/i)).toBeInTheDocument();
  });

  it('renders the Background card', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Background/i)).toBeInTheDocument();
    expect(screen.getByText(/University of Alberta/i)).toBeInTheDocument();
    expect(screen.getByText(/CCIE/i)).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /GitHub/i });
    expect(link).toHaveAttribute('href', 'https://github.com/Luwei-Lin');
  });

  it('renders LinkedIn link', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /LinkedIn/i });
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/luwei-lin');
  });

  it('renders email link', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /luwei2@ualberta\.ca/i });
    expect(link).toHaveAttribute('href', 'mailto:luwei2@ualberta.ca');
  });
});
