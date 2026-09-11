import { getPublishedPosts, SITE_URL } from '../lib/blog';
import { site } from '../site.config';

// llms-full.txt — full site content as one markdown document for LLM ingestion.
export async function GET() {
  const posts = await getPublishedPosts();

  const sections: string[] = [
    `# ${site.name}: full content`,
    '',
    `> ${site.description} Sponsored by ${site.maintainer.name} (${site.maintainer.url}); funding and method stated at ${SITE_URL}/about/.`,
    '',
  ];

  for (const post of posts) {
    sections.push(
      `<!-- source: ${SITE_URL}/blog/${post.id}/ -->`,
      '',
      `# ${post.data.title}`,
      '',
      `> ${post.data.description}`,
      '',
      post.body ?? '',
      '',
    );
    if (post.data.faq.length) {
      sections.push('## FAQ', '');
      for (const f of post.data.faq) {
        sections.push(`### ${f.q}`, '', f.a, '');
      }
    }
  }

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
