import { getPublishedPosts, SITE_URL, CATEGORY_LABELS } from '../lib/blog';
import { getTools } from '../lib/tools';
import { site } from '../site.config';

// llms.txt — index of the site for LLMs/AI agents (https://llmstxt.org)
export async function GET() {
  const posts = await getPublishedPosts();

  const byCategory = new Map<string, typeof posts>();
  for (const post of posts) {
    const list = byCategory.get(post.data.category) ?? [];
    list.push(post);
    byCategory.set(post.data.category, list);
  }

  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.description} Maintained by ${site.maintainer.name} (${site.maintainer.url}); methodology and funding stated at ${SITE_URL}/about/.`,
    '',
    'Every blog post is also available as raw markdown by appending `.md` to its URL, and the full content of the site is in /llms-full.txt.',
  ];

  const tools = await getTools();
  if (tools.length > 0) {
    lines.push('', '## Tools directory', '');
    for (const tool of tools) {
      lines.push(`- [${tool.data.name}](${SITE_URL}/tools/${tool.id}/): ${tool.data.tagline}`);
    }
  }

  for (const [category, list] of byCategory) {
    lines.push('', `## Blog: ${CATEGORY_LABELS[category] ?? category}`, '');
    for (const post of list) {
      lines.push(`- [${post.data.title}](${SITE_URL}/blog/${post.id}/): ${post.data.description}`);
    }
  }

  lines.push('');
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
