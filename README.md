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
/contact                           Contact Us (listed under About in the menu; URL kept from the old site)
/privacy-policy  /terms            Legal (drafts, see checklist)
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

`npm run build`, then publish the `dist/` folder to any static host (Netlify, Cloudflare Pages, Vercel,
GitHub Pages, or the existing host). `site` in `astro.config.mjs` is already set to the live domain, which drives
the sitemap and canonical URLs.

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
- [ ] Add a Google Business Profile / Facebook link to `SITE.social` once available.
- [ ] Redirect or keep the old URLs working (`/about`, `/services`, `/gallery`, `/contact`, `/privacy-policy`,
      `/terms` are preserved).
