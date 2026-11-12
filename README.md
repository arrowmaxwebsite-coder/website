# ArrowMax Clean — website

Redesign of <https://www.arrowmaxcleanwpa.com/> for ArrowMax, a carpet & floor cleaning company serving
Westmoreland, Indiana and Cambria County, PA.

Built with [Astro](https://astro.build) as a **static site**: no server, no database, ~0 JavaScript framework
code shipped to the browser. The `dist/` folder can be uploaded to any static host.

## Commands

```bash
npm install          # first time only
npm run dev          # local preview at http://localhost:4321
npm run build        # production build into ./dist
npm run preview      # serve the production build locally
npm run prep:images  # re-generate web-ready photos from /assets-source
npm run prep:brand   # re-generate favicon + social-share image
npm test             # unit tests for the chat Worker (mock AI, no network)
npm run cf:preview   # build, then run the real thing locally incl. the chat API at http://localhost:8787
```

## Site map

```
/                                  Home
/services                          All services
  /services/carpet-cleaning        } one page per service, generated from SERVICES
  /services/tile-and-grout-cleaning
  /services/hardwood-floor-cleaning
  /services/upholstery-cleaning
  /services/pet-urine-treatment
  /services/rug-cleaning
/areas                             Areas We Serve (overview)
  /areas/westmoreland-county       } one page per county, generated from COUNTIES
  /areas/indiana-county
  /areas/cambria-county
/gallery                           Before & after + job photos
/about                             About ArrowMax
  /about/mission-and-values        Mission, veteran owned & operated, values
  /about/faqs                      FAQs grouped by topic (+ FAQPage structured data)
  /about/resources                 Educational "know what you're dealing with" content (carpet, pet urine, mattress/upholstery)
/contact                           Contact Us (listed under About in the menu; URL kept from the old site)
/privacy-policy  /terms            Legal (drafts, see checklist)

/api/chat                          POST only. Chat assistant API (Worker code, not a page; see "Chat assistant")
/chat-knowledge.json               Generated at build time: the facts the assistant may use
```

**Adding a service or county** is a data change, not a code change: add an entry to `SERVICES` (in
`src/data/content.ts`) or `COUNTIES` (in `src/config.ts`) and the page, nav dropdown, footer link, sitemap entry,
quote-form option and structured data are all generated automatically.

## Where to change things

| To change…                                     | Edit…                                         |
| ---------------------------------------------- | --------------------------------------------- |
| Phone, email, form endpoint, social links      | `src/config.ts`                               |
| Counties, county seats, towns, county intro    | `src/config.ts` (`COUNTIES`)                  |
| Services, service SEO titles, reviews, "resources" | `src/data/content.ts`                     |
| FAQs (they sort into topics and appear on the matching service pages) | `src/data/content.ts` (`FAQS`) |
| Mission, values, veteran-owned copy            | `src/pages/about/mission-and-values.astro`    |
| Colors, fonts, spacing, buttons                | `src/styles/global.css` (design tokens at top) |
| A page's copy / layout                         | `src/pages/*.astro`                           |
| Header, footer, quote form, slider             | `src/components/*.astro`                      |
| What the chat assistant knows                  | Nothing to edit: it's generated from `src/config.ts` + `src/data/content.ts`. Owner-supplied facts (veteran owned, since 1975) are in `src/pages/chat-knowledge.json.ts` |
| How the chat assistant behaves (rules, tone)   | `worker/prompt.ts`                            |
| Chat limits, model, rate limit                 | `worker/chat.ts` (`LIMITS`, `MODEL`), `wrangler.jsonc` (`ratelimits`) |
| Chat button / panel                            | `src/components/ChatWidget.astro`             |

Brand colors are sampled from the logo: lime `#6CB01E / #A8DF18 / #D3F516`, aqua `#4EC7EE / #ADF2EE`,
on the navy the old site used, `#002244`.

## Quote form — set this up before launch

The forms post to `SITE.formEndpoint` in `src/config.ts`. It's empty by default, in which case the form falls
back to opening the visitor's email app, which works but loses leads from people without a mail app configured.

To make it production-ready (free, ~5 minutes): create a form at [Formspree](https://formspree.io),
[Web3Forms](https://web3forms.com) or similar pointed at `arrowmaxclean@gmail.com`, then paste its URL into
`formEndpoint`. Submissions are emailed to the owner. The forms already include a honeypot spam trap.

## Adding photos

1. Drop the original into `assets-source/`.
2. Add a line to `scripts/prep-images.mjs` (it strips EXIF/GPS data, fixes phone-photo rotation and resizes).
3. `npm run prep:images`, then import the file from `src/assets/photos/`.

For a new before/after slider, use `<BeforeAfter before={…} after={…} />` with two **same-framing** photos
(a 4:5 crop works best). Use `<StaticPair />` when the two shots are framed differently.

## Deploying

The site is a static build (`dist/`), deployed to **Cloudflare** as a Worker with static assets. The setup lives in
`wrangler.jsonc`; `.node-version` pins Node 24 (Astro 7 needs Node ≥ 22.23.4). `site` in `astro.config.mjs` is
already set to the live domain, which drives the sitemap and canonical URLs.

### GitHub → Cloudflare (automatic deploys)

In the Cloudflare dashboard: **Workers & Pages → Create → Import a repository** → pick
`arrowmaxwebsite-coder/website`, then use:

| Setting                         | Value                                                         |
| ------------------------------- | ------------------------------------------------------------- |
| Production branch               | `main`                                                        |
| Build command                   | `npm run build`                                               |
| Deploy command                  | `npx wrangler deploy`                                         |
| Non-production branch deploy    | `npx wrangler versions upload` (gives each branch a preview URL) |
| Root directory                  | `/` (leave blank)                                             |

Every push to `main` then builds and publishes automatically.

The chat assistant doesn't change any of this: the build and deploy commands above stay the same, the Worker keeps its
name (so the `*.workers.dev` URL is unchanged), and Wrangler bundles `worker/index.ts` and applies the `AI`,
`ASSETS` and `CHAT_LIMITER` bindings from `wrangler.jsonc` on deploy. Nothing needs adding in the dashboard (it can't
add bindings to this kind of Worker anyway); manage bindings in `wrangler.jsonc`.

- The `name` in `wrangler.jsonc` **must match the Worker's name** in the dashboard. If a build fails with a
  name-mismatch error, change `name` to the one it reports.
- Custom domain: add `www.arrowmaxcleanwpa.com` in the dashboard under **Settings → Domains & Routes** when you're ready to
  go live. It isn't in `wrangler.jsonc` on purpose, so deploying can't take the live domain over early.
- Pages are served at trailing-slash URLs (`/about/`); `/about` redirects there, and unknown URLs show `dist/404.html`
  with a real 404 status.

### Manual deploys and local preview

```bash
npm run deploy       # builds, then publishes with Wrangler (asks you to log in the first time)
npm run cf:preview   # build, then serve exactly what Cloudflare will serve, at http://localhost:8787
```

## Chat assistant (Cloudflare Workers AI)

An "Ask ArrowMax" button on every page opens a chat that answers questions about services, areas and free estimates,
and sends everything else to the estimate form or the phone. It uses **Cloudflare Workers AI**
(`@cf/google/gemma-4-26b-a4b-it`), so there is no separate AI account, key or subscription.

```
browser  →  POST /api/chat  →  worker/index.ts  →  worker/chat.ts  →  env.AI.run(...)
every other URL  →  static files in dist/, served directly (the Worker is never started)
```

- **Why there's a Worker now:** Cloudflare doesn't allow bindings (like Workers AI) on a Worker that only has static
  files. `wrangler.jsonc` therefore has a `main` script (`worker/index.ts`). `assets.run_worker_first` is
  `["/api/*"]`, so only API calls run code; pages, images, CSS and JS are served exactly as before.
- **Files:** `worker/index.ts` (router), `worker/chat.ts` (validation, rate limit, AI call, errors),
  `worker/prompt.ts` (rules + knowledge), `worker/chat.test.ts`, `src/components/ChatWidget.astro` (UI),
  `src/pages/chat-knowledge.json.ts` (facts, generated from the site data at build time).
- **Protection:** POST only; same-origin only; JSON only; 12 KB body, 600 characters per message, last 10 messages used;
  400-token replies; **10 requests per minute per visitor** (`CHAT_LIMITER`, fails closed if missing); friendly messages
  if the daily free allowance runs out or the model is busy; conversations are never logged.
- **Cost:** Workers AI's free allowance is 10,000 Neurons/day, roughly 400–500 chat messages a day with this setup.
  When it runs out the chat says it's unavailable and points people to the phone and the estimate form; it resets at
  00:00 UTC. Beyond that you'd need Cloudflare's Workers Paid plan (usage-priced); the code never spends money on its own.
- **Test locally:** `npm test` (mock AI, instant). For the real thing run `npm run cf:preview` (needs `npx wrangler login`
  once), then open <http://localhost:8787>. **Workers AI always uses your real Cloudflare account, even in local dev**, so
  those test messages count toward the free allowance. Or from a terminal:

  ```bash
  curl -s -X POST http://localhost:8787/api/chat -H "Content-Type: application/json" \
    -d '{"messages":[{"role":"user","content":"What services do you offer?"}]}'
  ```
- `npm run dev` (Astro only) has no Worker, so the chat button shows its "unavailable" message there. Use `cf:preview`.
- `npm run typecheck:worker` type-checks the Worker (it downloads TypeScript on demand; nothing is added to package.json).

## Before going live — checklist

- [ ] Set `SITE.formEndpoint` (see above) and send a real test submission.
- [ ] Replace `/privacy-policy` and `/terms` with the owner's approved text. The current pages are generic
      drafts (the originals couldn't be retrieved) and have not been reviewed by a lawyer.
- [ ] Confirm the towns listed under each county (cards, county pages, Areas page) match where the owner actually works.
- [ ] Have the owner approve the Mission & Values wording. "Veteran owned & operated" and "roots in the cleaning
      industry dating back to 1975" come from information supplied for this project; the mission statement and the
      one-line explanation under each value were drafted from it.
- [ ] Add answers customers commonly ask that the old site never answered, in `FAQS`: drying time, payment methods,
      guarantee / re-clean policy, insurance, scheduling, and whether furniture needs to be moved.
- [ ] Confirm the owner has the rights to every photo (two originals carried a "ZeroMax" watermark and were left
      out — see `assets-source/_unused-watermarked/`). Swap in the owner's own rug photo for the Rug Cleaning card;
      it currently uses a crop of the stock living-room illustration from the old site.
- [ ] Only 3 customer reviews exist. Ask happy customers for Google reviews, then add them to `REVIEWS`.
- [ ] Chat assistant: the owner should read a few of its answers (try prices, drying time, an unlisted town, an off-topic
      request) and approve what it says. It repeats the FAQ answers on the site and says "I don't have that detail" for
      anything else, so adding owner-approved FAQ answers (drying time, payment, guarantee, insurance) makes it more useful.
- [ ] Add the chat assistant to the privacy policy: visitors' chat messages are sent to Cloudflare Workers AI to generate
      a reply, and ArrowMax's site doesn't store them. (The legal pages are unreviewed drafts, see above.)
- [ ] Add a Google Business Profile / Facebook link to `SITE.social` once available.
- [ ] Redirect or keep the old URLs working (`/about`, `/services`, `/gallery`, `/contact`, `/privacy-policy`,
      `/terms` are preserved).
