/**
 * Single source of truth for business details. Edit here and every page, the footer,
 * the schema.org data and the quote forms update together.
 */
export const SITE = {
  name: 'ArrowMax Clean',
  shortName: 'ArrowMax',
  url: 'https://www.arrowmaxcleanwpa.com',
  tagline: 'Carpet & Floor Cleaning Done Right',
  phone: '(724) 702-4340',
  phoneHref: 'tel:+17247024340',
  phoneE164: '+17247024340',
  email: 'arrowmaxclean@gmail.com',

  /**
   * Where the quote forms POST. Leave empty and the forms fall back to opening the visitor's
   * email app addressed to the email above (works, but a hosted endpoint is far better).
   * Free options: Formspree (https://formspree.io/f/xxxxxxx), Web3Forms, Netlify Forms, Basin.
   * They email submissions to the owner and need no server code.
   */
  formEndpoint: '',

  /** Social profiles — add URLs here and they appear in the footer + schema automatically. */
  social: [] as { label: string; href: string }[],
} as const;

export interface County {
  /** short key used in ?county= prefill links and the quote form */
  slug: string;
  /** last segment of the county page URL: /areas/<urlSlug> */
  urlSlug: string;
  path: string;
  name: string;
  short: string;
  seat: string;
  /** shown on cards */
  towns: string[];
  /** extra towns shown on the county's own page */
  moreTowns: string[];
  /** intro paragraph on the county page */
  lead: string;
  /** which customer review (by name) belongs to this county */
  reviewName: string;
}

export const COUNTIES: County[] = [
  {
    slug: 'westmoreland',
    urlSlug: 'westmoreland-county',
    path: '/areas/westmoreland-county',
    name: 'Westmoreland County',
    short: 'Westmoreland',
    seat: 'Greensburg',
    towns: ['Greensburg', 'Latrobe', 'Jeannette', 'Irwin', 'Murrysville', 'Ligonier'],
    moreTowns: ['Mt. Pleasant', 'Scottdale', 'Delmont', 'New Stanton', 'Youngwood', 'Export'],
    lead:
      'From Greensburg to Latrobe, Jeannette and Murrysville, homeowners across Westmoreland County count on ArrowMax for professional carpet, tile and grout, hardwood, upholstery, pet urine and rug cleaning, with a straight answer on price before we start.',
    reviewName: 'Karen M.',
  },
  {
    slug: 'indiana',
    urlSlug: 'indiana-county',
    path: '/areas/indiana-county',
    name: 'Indiana County',
    short: 'Indiana',
    seat: 'Indiana',
    towns: ['Indiana', 'Blairsville', 'Homer City', 'Clymer', 'Saltsburg', 'Marion Center'],
    moreTowns: ['Ernest', 'Cherry Tree', 'Plumville', 'Creekside'],
    lead:
      'Whether you’re in the borough of Indiana, Blairsville, Homer City or out in the surrounding townships, ArrowMax brings professional floor and furniture cleaning to Indiana County homes, with no pressure and no surprises.',
    reviewName: 'Dave R.',
  },
  {
    slug: 'cambria',
    urlSlug: 'cambria-county',
    path: '/areas/cambria-county',
    name: 'Cambria County',
    short: 'Cambria',
    seat: 'Ebensburg',
    towns: ['Johnstown', 'Ebensburg', 'Windber', 'Portage', 'Carrolltown', 'Patton'],
    moreTowns: ['Nanty Glo', 'Cresson', 'Lilly', 'Loretto', 'Hastings'],
    lead:
      'From Johnstown and Ebensburg to Windber, Portage and beyond, ArrowMax cleans carpet, tile, hardwood, upholstery and rugs for Cambria County homeowners, careful with your floors and honest about the price.',
    reviewName: 'Lisa T.',
  },
];

export const countyBySlug = (slug: string) => COUNTIES.find((c) => c.urlSlug === slug);

/** About-menu pages (also used by the header and footer) */
export const ABOUT_LINKS = [
  { href: '/about', label: 'About ArrowMax', icon: 'home', desc: 'Who we are' },
  { href: '/about/mission-and-values', label: 'Our Mission & Values', icon: 'shield', desc: 'Veteran owned & operated' },
  { href: '/about/faqs', label: 'FAQs', icon: 'help', desc: 'Straight answers' },
  { href: '/contact', label: 'Contact Us', icon: 'mail', desc: 'Free quote, no pressure' },
] as const;
