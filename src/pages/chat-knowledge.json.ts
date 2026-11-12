/**
 * Generates /chat-knowledge.json at build time: the facts the website assistant is allowed to use.
 *
 * It is built from the same data that renders the site (src/config.ts, src/data/content.ts), so the chatbot
 * can only say what the website says and updates whenever that data does. The Worker (worker/prompt.ts) reads
 * it through its ASSETS binding. Everything in here is already public on the site.
 */
import type { APIRoute } from 'astro';
import { SITE, COUNTIES } from '../config';
import { SERVICES, FAQS } from '../data/content';

export const GET: APIRoute = () => {
  const knowledge = {
    business: {
      name: SITE.name,
      phone: SITE.phone,
      email: SITE.email,
      // Supplied by the owner; mirrors the About / Mission & Values pages. Edit them there and here together.
      facts: [
        'Veteran owned and operated.',
        'Roots in the cleaning industry dating back to 1975.',
        'Estimates are free, with no pressure to book.',
        'Based in western Pennsylvania, serving Westmoreland, Indiana and Cambria counties.',
      ],
    },
    services: SERVICES.map((s) => ({
      title: s.title,
      path: `/services/${s.slug}`,
      blurb: s.blurb,
      points: s.points,
    })),
    areas: COUNTIES.map((c) => ({
      name: c.name,
      seat: c.seat,
      path: c.path,
      towns: [...c.towns, ...c.moreTowns],
    })),
    pages: [
      { path: '/contact', about: 'the free estimate form and contact details' },
      { path: '/services', about: 'all six services' },
      { path: '/areas', about: 'the three counties served' },
      { path: '/gallery', about: 'before and after photos of real jobs' },
      { path: '/about/faqs', about: 'more frequently asked questions' },
      { path: '/about/resources', about: 'what builds up in carpet, padding and furniture' },
      { path: '/about/mission-and-values', about: 'the company mission and veteran-owned story' },
    ],
    faqs: FAQS.map((f) => ({ q: f.q, a: f.a })),
  };

  return new Response(JSON.stringify(knowledge), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
