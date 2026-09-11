/**
 * Everything that makes this site *this* site. A sibling in the network copies
 * the repo and edits this file; nothing else should hardcode the domain, the
 * name or the editorial line.
 *
 * Kept as one flat object on purpose: the whole point is that a new site is a
 * config change, not a refactor.
 */
export const site = {
  /** Canonical origin, no trailing slash. Used for canonical URLs, OG and schema. */
  url: 'https://agentwrotethis.dev',
  /** Shown in the header, the footer and og:site_name. */
  name: 'agentwrotethis.dev',
  /** Wordmark in the header. */
  wordmark: 'agentwrotethis',
  /** One line, used as the default meta description and in WebSite schema. */
  description:
    'What changes in code review once agents write most of the code. Field notes and tool comparisons, with the source for every claim.',
  /** Footer line, the site in one sentence. */
  footerLine: 'Notes on reviewing code an agent wrote.',
  /** Shown on the blog byline when a post does not name an author. */
  defaultAuthor: 'agentwrotethis editorial',
  /** RSS title. */
  rssTitle: 'agentwrotethis.dev',
  /** Google Analytics measurement id, or null to render no tag. */
  gaMeasurementId: null as string | null,
  /** Absolute URL of the OG image, served from /public. */
  ogImage: 'https://agentwrotethis.dev/og-image.png',
  /**
   * Who runs the site, stated in the footer and on /about. The network does not
   * hide who maintains it; that is the whole difference between this and a
   * link farm.
   */
  maintainer: {
    name: 'Kodus',
    url: 'https://kodus.io',
    /** Rendered verbatim in the footer. */
    line: 'Maintained by',
  },
  /** Header nav. Keep it short; every entry is a page that must exist. */
  nav: [
    { label: 'Writing', href: '/blog' },
    { label: 'About', href: '/about' },
  ],
} as const;

export type SiteConfig = typeof site;
