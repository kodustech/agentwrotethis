# agentwrotethis.dev

What changes in code review, testing and governance when agents write most of the code. Field notes, verified tool comparisons and what teams publish about their own review load.

Maintained by [Kodus](https://kodus.io). That is stated in the footer of every page and on [/about](https://agentwrotethis.dev/about/).

Part of a small network of sites run by the same team, each with its own editorial line: [aicodereview.io](https://aicodereview.io) for the AI code review category and [codereviewbench.com](https://codereviewbench.com) for the model benchmark.

## Stack

[Astro 5](https://astro.build) with Tailwind, deployed on Vercel. Pages are prerendered to static HTML on the CDN; only `/api/*` runs on demand as a serverless function.

Built from the same codebase as aicodereview.io. Everything that makes this site *this* site lives in [`src/site.config.ts`](src/site.config.ts): domain, name, description, nav, analytics id and who maintains it. A new site in the network copies the repo and edits that one file.

## Content

- `src/content/blog/*.mdx` — posts. Categories are `best-of`, `alternatives`, `comparison`, `guide`, `explainer`, `review`.
- `src/content/tools/*.json` — the tool directory. Pricing, license, self-hosting, platform support and a `lastVerified` date on every entry. Shared across the network, so a correction here should be carried to the sibling repos.

Every factual claim about a vendor is read from that vendor's own public pages and stamped with the date. When it cannot be confirmed from a primary source the field says unknown.

## Publishing

Posts arrive through the content API rather than by hand. See [CONTENT-API.md](CONTENT-API.md). In production an accepted post becomes a commit to this repo, which triggers the deploy and rebuilds the static site.

## Running locally

```bash
npm install
npm run dev
```

`CONTENT_API_KEY=test npm run dev` if you want to POST to `/api/posts` locally.
