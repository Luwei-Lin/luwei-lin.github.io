# Luwei (Luis) Lin's Blog

A modern, technical blog built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Server-side rendering with Next.js App Router
- Markdown-based blog posts with syntax highlighting
- Responsive design with Tailwind CSS
- SEO-friendly
- Static export for GitHub Pages

## Getting Started

Choose one of two methods: Docker (recommended) or local installation.

### Method 1: Docker (Recommended)

**Prerequisites**: Docker and Docker Compose installed

```bash
# Start development server
make dev

# Or with full build
make full
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

See [DOCKER.md](DOCKER.md) for detailed Docker instructions and all available commands.

### Method 2: Local Installation

**Prerequisites**: Node.js 18+ and npm

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Writing Blog Posts

Create new blog posts in the `posts/` directory using Markdown:

```markdown
---
title: "Your Post Title"
date: "2024-01-01"
excerpt: "A brief description"
tags: ["tag1", "tag2"]
---

# Your Post Title

Your content here...
```

## Building for Production

### With Docker
```bash
make deploy-build
```

### Without Docker
```bash
npm run build
```

The static site will be in the `out` directory.

## Deploying to GitHub Pages

### With Docker
```bash
make deploy
```

### Without Docker
```bash
npm run deploy
```

Then commit and push:
```bash
git add .
git commit -m "Deploy blog update"
git push origin main
```

## Project Structure

```
blog-source/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions
├── posts/           # Markdown blog posts
├── public/          # Static assets
└── ...config files
```

## Customization

- Update site metadata in `app/layout.tsx`
- Modify navigation in `components/Navigation.tsx`
- Customize styles in `app/globals.css` and Tailwind config
- Add your information in `app/about/page.tsx`

## Docker Commands Quick Reference

```bash
make dev          # Start development server
make full         # Build and start (first time)
make down         # Stop server
make logs         # View logs
make shell        # Enter container
make clean        # Clean everything
make deploy       # Deploy to GitHub Pages
```

See [DOCKER.md](DOCKER.md) for complete documentation.

## Documentation

- [DOCKER.md](DOCKER.md) - Complete Docker setup and commands
- [SETUP.md](SETUP.md) - Detailed setup and customization guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture overview

## License

MIT
