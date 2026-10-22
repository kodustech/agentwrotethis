// @ts-check
import { defineConfig } from 'astro/config';
import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Last git commit date for a tracked file, or undefined if untracked/unavailable (e.g. shallow clone). */
function getGitLastModified(relativePath) {
  try {
    const output = execFileSync('git', ['log', '-1', '--format=%cI', '--', relativePath], {
      cwd: rootDir,
      encoding: 'utf-8',
    }).trim();
    return output ? new Date(output) : undefined;
  } catch {
    return undefined;
  }
}

/** Reads a scalar frontmatter field (e.g. `pubDate: 2026-09-12`) without pulling in a YAML parser. */
function getFrontmatterDate(content, field) {
  const match = content.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  if (!match) return undefined;
  const value = match[1].trim().replace(/^['"]|['"]$/g, '');
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

/** Recursively lists .md/.mdx files under dir, relative to dir, posix-separated (matches the blog collection's glob id). */
function listMarkdownFiles(dir, prefix = '') {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(path.join(dir, entry.name), relPath));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      files.push(relPath);
    }
  }
  return files;
}

/** slug -> lastmod, from each blog post's updatedDate frontmatter (falling back to pubDate). */
function getBlogLastmodBySlug() {
  const blogDir = path.join(rootDir, 'src/content/blog');
  const map = new Map();
  for (const relPath of listMarkdownFiles(blogDir)) {
    const content = readFileSync(path.join(blogDir, relPath), 'utf-8');
    const lastmod = getFrontmatterDate(content, 'updatedDate') ?? getFrontmatterDate(content, 'pubDate');
    if (lastmod) map.set(relPath.replace(/\.(md|mdx)$/, ''), lastmod);
  }
  return map;
}

const blogLastmodBySlug = getBlogLastmodBySlug();

/** Static (non-blog-post) pages: pathname -> source file, for a git-commit-date lastmod. */
const STATIC_PAGE_FILES = {
  '/': 'src/pages/index.astro',
  '/about/': 'src/pages/about.astro',
  '/blog/': 'src/pages/blog/index.astro',
};
const CATEGORY_PAGE_FILE = 'src/pages/blog/category/[category].astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://agentwrotethis.dev',
  // Static by default; only routes that opt out (export const prerender = false),
  // like /api/posts, become Vercel serverless functions.
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap({
    // Keep non-HTML endpoints (feeds, llms.txt, raw-markdown mirrors) out of the sitemap.
    filter: (page) => !/\.(xml|txt|md|json)$/.test(new URL(page).pathname) && !page.includes('/api/'),
    serialize(item) {
      const pathname = new URL(item.url).pathname;

      const postMatch = pathname.match(/^\/blog\/([^/]+)\/$/);
      if (postMatch) {
        const lastmod = blogLastmodBySlug.get(postMatch[1]);
        return lastmod ? { ...item, lastmod: lastmod.toISOString() } : item;
      }

      const staticFile = /^\/blog\/category\/[^/]+\/$/.test(pathname)
        ? CATEGORY_PAGE_FILE
        : STATIC_PAGE_FILES[pathname];
      if (staticFile) {
        const lastmod = getGitLastModified(staticFile);
        if (lastmod) return { ...item, lastmod: lastmod.toISOString() };
      }
      return item;
    },
  })]
});
