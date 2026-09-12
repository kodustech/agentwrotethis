import { getPublishedPosts, SITE_URL, CATEGORY_LABELS } from '../lib/blog';
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
    `> ${site.description}`,
    '',
    '## About',
    '',
    `${site.name} examines what needs to change in code review when agents write most of the code.`,
    '',
    '## Editorial policy',
    '',
    'Claims about tools and teams are checked against primary sources, including vendor documentation and original publications. When a claim cannot be confirmed from a primary source, it is labelled as unknown.',
    '',
    'Vendor benchmark results are attributed to the vendor. The site does not use star ratings. Changeable facts, such as pricing, should be checked against their linked primary source.',
    '',
    '## Funding and disclosure',
    '',
    `${site.name} is sponsored by ${site.maintainer.name}, an open-source code reviewer. Sponsorship does not exempt ${site.maintainer.name} from the same evidence standard applied to every other product named on the site.`,
    '',
    `- Sponsor: ${site.maintainer.name}`,
    `- Sponsor website: ${site.maintainer.url}/`,
    `- Methodology and disclosure: ${SITE_URL}/about/`,
    '- Source code: https://github.com/kodustech/agentwrotethis',
    '- Corrections: https://github.com/kodustech/agentwrotethis/issues',
    '',
    '## Pages',
    '',
    `- Homepage: ${SITE_URL}/`,
    `- Writing: ${SITE_URL}/blog/`,
    `- About: ${SITE_URL}/about/`,
    `- RSS feed: ${SITE_URL}/rss.xml`,
    `- Sitemap: ${SITE_URL}/sitemap-index.xml`,
    `- Full site content: ${SITE_URL}/llms-full.txt`,
  ];


  for (const [category, list] of byCategory) {
    lines.push('', `## Blog: ${CATEGORY_LABELS[category] ?? category}`, '');
    for (const post of list) {
      lines.push(`- [${post.data.title}](${SITE_URL}/blog/${post.id}/): ${post.data.description}`);
    }
  }

  lines.push('', 'Every blog post is also available as raw Markdown by appending `.md` to its canonical URL.');
  lines.push('');
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
