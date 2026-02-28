# Blog Setup Guide

This guide will help you set up and customize your new Next.js blog.

## Initial Setup

1. **Install dependencies**

```bash
cd blog-source
npm install
```

2. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your blog!

## Customization

### 1. Update Personal Information

**Edit the About page**: [app/about/page.tsx](app/about/page.tsx)
- Update your bio, skills, and contact links

**Edit site metadata**: [app/layout.tsx](app/layout.tsx)
- Change the site title and description

**Update the home page**: [app/page.tsx](app/page.tsx)
- Customize the hero section and features

### 2. Add Your First Blog Post

Create a new file in the `posts/` directory:

```markdown
---
title: "My First Post"
date: "2024-02-01"
excerpt: "This is my first blog post"
tags: ["introduction"]
---

# My First Post

Your content here...
```

### 3. Customize Navigation

Edit [components/Navigation.tsx](components/Navigation.tsx) to add or remove menu items:

```typescript
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  // Add more items here
];
```

### 4. Style Customization

- **Colors and theme**: Edit [tailwind.config.ts](tailwind.config.ts)
- **Global styles**: Edit [app/globals.css](app/globals.css)
- **Typography**: The blog uses `@tailwindcss/typography` for article styling

## Adding Submenus

To add dropdown submenus to the navigation:

1. Update the `navItems` structure in [components/Navigation.tsx](components/Navigation.tsx):

```typescript
const navItems = [
  { href: '/', label: 'Home' },
  {
    label: 'Blog',
    submenu: [
      { href: '/blog', label: 'All Posts' },
      { href: '/blog/category/tutorial', label: 'Tutorials' },
      { href: '/blog/category/projects', label: 'Projects' },
    ]
  },
  { href: '/about', label: 'About' },
];
```

2. Update the Navigation component to handle submenus with hover/click states

## Writing Blog Posts

### Front Matter

Each blog post needs front matter (metadata) at the top:

```markdown
---
title: "Post Title"          # Required
date: "2024-01-01"           # Required (YYYY-MM-DD format)
excerpt: "Brief description" # Optional but recommended
tags: ["tag1", "tag2"]      # Optional
---
```

### Code Blocks

Use triple backticks with language specification:

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Images

Place images in the `public/` directory and reference them:

```markdown
![Alt text](/images/my-image.png)
```

## Deployment to GitHub Pages

### Method 1: Using the Deploy Script

```bash
npm run deploy
```

Then follow the prompts to commit and push.

### Method 2: Manual Deployment

```bash
# Build the site
npm run build

# Copy the 'out' directory contents to repository root
cd ..
cp -r blog-source/out/* .

# Commit and push
git add .
git commit -m "Deploy blog"
git push origin main
```

### GitHub Pages Configuration

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select the `main` branch and `/ (root)` folder
5. Save

Your site will be live at `https://yourusername.github.io` in a few minutes!

## Development Tips

### Adding New Pages

Create a new folder in `app/` directory:

```
app/
  projects/
    page.tsx    -> /projects
```

### Environment Variables

Create a `.env.local` file for local environment variables:

```
NEXT_PUBLIC_SITE_URL=https://yourusername.github.io
```

### SEO Optimization

Each page can export metadata:

```typescript
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

## Troubleshooting

### Build Errors

- Make sure all dependencies are installed: `npm install`
- Delete `.next` and `out` folders, then rebuild: `npm run build`

### 404 on GitHub Pages

- Ensure `.nojekyll` file exists in the root
- Check that all links use relative paths
- Verify `basePath` in [next.config.js](next.config.js)

### Styling Issues

- Clear browser cache
- Check Tailwind configuration
- Verify `globals.css` is imported in `layout.tsx`

## Next Steps

- [ ] Customize the about page with your information
- [ ] Write your first blog post
- [ ] Update colors and styling to match your brand
- [ ] Add social media links
- [ ] Set up Google Analytics (optional)
- [ ] Add an RSS feed (optional)
- [ ] Deploy to GitHub Pages

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

Happy blogging! 🚀
