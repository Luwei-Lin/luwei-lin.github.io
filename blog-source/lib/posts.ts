import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import hljs from 'highlight.js';

const postsDirectory = path.join(process.cwd(), 'posts');

// Render inline markdown (bold, italic, code) within a string
function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

// Convert markdown tables to HTML (remark doesn't support GFM tables without remark-gfm)
function renderTables(markdown: string): string {
  return markdown.replace(
    /^(\|.+\|\r?\n)((?:\|[-: |]+\|\r?\n))((?:\|.+\|\r?\n?)*)/gm,
    (_, headerRow, _sep, bodyRows) => {
      const parseRow = (row: string) =>
        row.trim().split('|').slice(1, -1).map((c) => renderInline(c.trim()));
      const headers = parseRow(headerRow);
      const rows = bodyRows.trim().split('\n').filter(Boolean);
      const thead = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>`;
      const tbody = `<tbody>${rows.map((r) => `<tr>${parseRow(r).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
      return `<table>${thead}${tbody}</table>\n\n`;
    }
  );
}

// Recursively find all .md files, returning their full paths
function getAllMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getAllMarkdownFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith('.md')) return [fullPath];
    return [];
  });
}

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  content?: string;
}

export function getSortedPostsData(): PostData[] {
  const allPostsData = getAllMarkdownFiles(postsDirectory)
    .map((fullPath) => {
      const slug = path.basename(fullPath, '.md');
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        excerpt: matterResult.data.excerpt || '',
        tags: matterResult.data.tags || [],
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  return getAllMarkdownFiles(postsDirectory).map((fullPath) => ({
    slug: path.basename(fullPath, '.md'),
  }));
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = getAllMarkdownFiles(postsDirectory).find(
    (p) => path.basename(p, '.md') === slug
  );
  if (!fullPath) throw new Error(`Post not found: ${slug}`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(renderTables(matterResult.content));

  // Apply syntax highlighting to fenced code blocks
  const contentHtml = processedContent.toString().replace(
    /<pre><code(?:\s+class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_, lang, encoded) => {
      const code = encoded
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      const result = lang && hljs.getLanguage(lang)
        ? hljs.highlight(code, { language: lang, ignoreIllegals: true })
        : hljs.highlightAuto(code);
      return `<pre><code class="hljs${lang ? ` language-${lang}` : ''}">${result.value}</code></pre>`;
    }
  );

  // Combine the data with the slug and contentHtml
  return {
    slug,
    title: matterResult.data.title,
    date: matterResult.data.date,
    excerpt: matterResult.data.excerpt || '',
    tags: matterResult.data.tags || [],
    content: contentHtml,
  };
}
