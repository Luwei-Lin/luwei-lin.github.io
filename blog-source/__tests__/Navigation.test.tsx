import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navigation from '@/components/Navigation';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Navigation', () => {
  it('renders the brand name', () => {
    render(<Navigation />);
    expect(screen.getByText('Luwei (Luis) Lin')).toBeInTheDocument();
  });

  it('renders all nav links', () => {
    render(<Navigation />);
    expect(screen.getAllByRole('link', { name: 'Home' })).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: 'Blog' })).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: 'About' })).toHaveLength(1);
  });

  it('renders mobile menu button', () => {
    render(<Navigation />);
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
  });
});
