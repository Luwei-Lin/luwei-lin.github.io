# Quick Start Guide

Your blog has been refactored into a modern Next.js application! Here's how to get started.

## What Changed?

- **Old**: Single static HTML file with embedded styles
- **New**: Modern Next.js blog with:
  - Markdown-based blog posts
  - Responsive navigation with menu support
  - Syntax highlighting for code blocks
  - SEO-friendly structure
  - Easy content management

## Project Structure

```
luwei.github.io/
├── blog-source/          # Your new Next.js blog source code
│   ├── app/             # Pages (Home, Blog, About)
│   ├── components/      # React components (Navigation, etc.)
│   ├── lib/            # Utility functions (post loading)
│   ├── posts/          # Your blog posts in Markdown
│   └── public/         # Static assets
├── index.html          # Old static site (can be removed after testing)
└── QUICKSTART.md       # This file
```

## Getting Started

Choose your preferred method:

### 🐳 Option A: Docker (Recommended - Just 2 Commands!)

```bash
cd blog-source

# Start the blog (that's it!)
make dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your new blog!

**Why Docker?**
- No need to install Node.js
- Consistent environment
- One command to rule them all
- See [blog-source/DOCKER.md](blog-source/DOCKER.md) for all commands

### 📦 Option B: Local Installation (Traditional Way)

```bash
cd blog-source

# Step 1: Install dependencies
npm install

# Step 2: Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your new blog!

### Step 3: Customize Your Blog

1. **Update your information** in `app/about/page.tsx`
2. **Write blog posts** in the `posts/` folder (see examples provided)
3. **Customize colors/styles** in `tailwind.config.ts` and `app/globals.css`

## Writing Your First Post

Create a new file in `blog-source/posts/my-first-post.md`:

```markdown
---
title: "My First Technical Post"
date: "2024-02-25"
excerpt: "This is my first post on my new blog!"
tags: ["introduction", "technology"]
---

# My First Technical Post

Welcome to my blog! Here I'll share...

## Code Example

\`\`\`javascript
console.log("Hello, Blog!");
\`\`\`
```

## Deploying to GitHub Pages

When you're ready to publish:

### With Docker
```bash
cd blog-source
make deploy
```

### Without Docker
```bash
cd blog-source
npm run deploy
```

Then commit and push:
```bash
cd ..
git add .
git commit -m "Deploy new blog"
git push origin main
```

Your site will be live at `https://luwei-lin.github.io` in a few minutes!

## Key Features

### 1. Navigation Menu
- Responsive design (mobile & desktop)
- Currently has: Home, Blog, About
- Easy to add more pages or submenus

### 2. Blog System
- Write posts in Markdown
- Automatic syntax highlighting
- Tags and categories support
- SEO-friendly URLs

### 3. Fully Customizable
- Modern React components
- Tailwind CSS for styling
- TypeScript for type safety

## Common Tasks

### Add a new page
1. Create folder in `app/` (e.g., `app/projects/`)
2. Add `page.tsx` file in that folder

### Change site colors
Edit `tailwind.config.ts` and update the color palette

### Add social links
Update `app/about/page.tsx` with your links

### Modify navigation
Edit `components/Navigation.tsx`

## Need Help?

Check out the detailed guide: `blog-source/SETUP.md`

## Available Commands

### Docker Commands (Recommended)
```bash
make dev         # Start development server
make full        # Build and start (first time)
make down        # Stop server
make logs        # View logs
make shell       # Enter container
make clean       # Clean everything
make deploy      # Build and prepare for deployment
```

### NPM Commands (Without Docker)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run deploy   # Build and prepare for deployment
```

See [blog-source/DOCKER.md](blog-source/DOCKER.md) for complete Docker documentation.

## What's Next?

1. ✅ Install dependencies (`npm install`)
2. ✅ Run dev server (`npm run dev`)
3. ⬜ Customize your about page
4. ⬜ Write your first blog post
5. ⬜ Adjust colors and styling
6. ⬜ Deploy to GitHub Pages

---

**Tip**: Keep the old `index.html` until you've tested the new blog and are happy with it. Then you can safely remove it!

Happy blogging! 🎉
