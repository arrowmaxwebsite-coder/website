import type { ImageMetadata } from 'astro';

import carpetImg from '../assets/photos/job-carpet-machine.jpg';
import tileImg from '../assets/photos/job-tile-grout.jpg';
import hardwoodImg from '../assets/photos/job-hardwood.jpg';
import upholsteryImg from '../assets/photos/job-upholstery.jpg';
import petImg from '../assets/photos/job-carpet-doorway.jpg';
import rugImg from '../assets/photos/job-rug.jpg';

import fibersImg from '../assets/photos/resource-carpet-fibers.jpg';
import urineImg from '../assets/photos/resource-urine-diagram.jpg';
import mattressImg from '../assets/photos/resource-mattress-diagram.jpg';

export interface Service {
  /** URL segment: /services/<slug> */
  slug: string;
  title: string;
  icon: string;
  /** one–two lines for cards */
  blurb: string;
  /** full paragraph (carried over from the existing site) */
  long: string;
  points: string[];
  image: ImageMetadata;
  imageAlt: string;
  /** quote-form value */
  value: string;
  /** <title> and meta description for the service's own page */
  seoTitle: string;
  seoDesc: string;
  /** index into RESOURCES for the "know what you're dealing with" block on the service page */
  resource?: number;
  /** short noun phrase used in headings, e.g. "carpet cleaning" */
  noun: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'carpet-cleaning',
    value: 'Carpet cleaning',
    title: 'Carpet Cleaning',
    noun: 'carpet cleaning',
    icon: 'carpet',
    blurb: 'Deep-set dirt, stains and allergens lifted out of the fibers. One room or the whole house.',
    long:
      "Carpet cleaning in Westmoreland County, PA doesn't have to be a hassle. ArrowMax lifts deep-set dirt, stains, and allergens from your carpets so your floors look and feel fresh again. Whether it's one room or the whole house, we handle it.",
    points: ['Ground-in dirt and traffic lanes', 'Stains and spots', 'Allergens, dust and dander', 'One room or the whole house'],
    image: carpetImg,
    imageAlt: 'Rotary carpet cleaning machine leaving a clean stripe across dirty beige carpet',
    seoTitle: 'Carpet Cleaning in Western PA | ArrowMax',
    seoDesc:
      'Professional carpet cleaning in Westmoreland, Indiana and Cambria County, PA. Deep-set dirt, stains and allergens lifted out. Free quote, no pressure.',
    resource: 0,
  },
  {
    slug: 'tile-and-grout-cleaning',
    value: 'Tile & grout cleaning',
    title: 'Tile & Grout Cleaning',
    noun: 'tile and grout cleaning',
    icon: 'tile',
    blurb: "Grout collects grime scrubbing alone can't fix. We bring back the original color and brightness.",
    long:
      "Tile and grout cleaning in Indiana County, PA is where ArrowMax really makes a difference. Grout lines collect grime that scrubbing alone can't fix. Our professional cleaning restores the original color and brightness of your tile floors, backsplashes, and more.",
    points: ['Tile floors', 'Grout lines', 'Backsplashes and more', 'Original color and brightness restored'],
    image: tileImg,
    imageAlt: 'Tile cleaning machine leaving a clean path across a grimy tile floor',
    seoTitle: 'Tile & Grout Cleaning in Western PA | ArrowMax',
    seoDesc:
      'Tile and grout cleaning in Westmoreland, Indiana and Cambria County, PA. We restore the original color and brightness of tile floors and backsplashes. Free quote.',
  },
  {
    slug: 'hardwood-floor-cleaning',
    value: 'Hardwood floor cleaning',
    title: 'Hardwood Floor Cleaning',
    noun: 'hardwood floor cleaning',
    icon: 'wood',
    blurb: 'Methods made for wood, so buildup comes off and the natural warmth and finish come back.',
    long:
      'Hardwood floor cleaning in Cambria County, PA requires the right technique. The wrong products can cause real damage. ArrowMax uses methods designed specifically for hardwood to safely remove buildup and bring back the natural warmth and finish of your wood floors.',
    points: ['Safe, wood-specific methods', 'Buildup and dullness removed', 'Natural warmth and finish restored', 'Streak-free shine'],
    image: hardwoodImg,
    imageAlt: 'Glossy, freshly cleaned hardwood floor',
    seoTitle: 'Hardwood Floor Cleaning in Western PA | ArrowMax',
    seoDesc:
      'Hardwood floor cleaning in Westmoreland, Indiana and Cambria County, PA using methods made for wood. Buildup off, natural warmth and finish back. Free quote.',
  },
  {
    slug: 'upholstery-cleaning',
    value: 'Upholstery cleaning',
    title: 'Upholstery Cleaning',
    noun: 'upholstery cleaning',
    icon: 'sofa',
    blurb: 'Sofas, chairs and cushions cleaned without soaking them or leaving a residue.',
    long:
      'Upholstery cleaning in Westmoreland County, PA gets sofas, chairs, and cushions clean without soaking them or leaving a residue. ArrowMax lifts everyday dirt, oils, and odors from your furniture so it looks and feels fresh again.',
    points: ['Sofas, chairs and cushions', 'Dirt, oils and odors lifted', 'No soaking', 'No residue left behind'],
    image: upholsteryImg,
    imageAlt: 'Cream sofa cushion with a clean stripe where it has been professionally cleaned',
    seoTitle: 'Upholstery Cleaning in Western PA | ArrowMax',
    seoDesc:
      'Upholstery cleaning for sofas, chairs and cushions in Westmoreland, Indiana and Cambria County, PA. No soaking, no residue. Free quote, no pressure.',
    resource: 2,
  },
  {
    slug: 'pet-urine-treatment',
    value: 'Pet urine treatment',
    title: 'Pet Urine Treatment',
    noun: 'pet urine treatment',
    icon: 'paw',
    blurb: 'Stains and odors treated at the source, in the carpet and padding underneath, not just masked.',
    long:
      "Pet urine treatment in Indiana County, PA targets stains and odors at the source, not just on the surface. ArrowMax treats the carpet and padding underneath to remove what's actually causing the smell, not mask it.",
    points: ['Treats carpet and padding', 'Stains and odors at the source', 'Removes what causes the smell', 'Not just a surface fix'],
    image: petImg,
    imageAlt: 'Technician treating a stained carpet at a doorway with a rotary cleaning tool',
    seoTitle: 'Pet Urine Treatment in Western PA | ArrowMax',
    seoDesc:
      'Pet urine stain and odor treatment in Westmoreland, Indiana and Cambria County, PA. We treat the carpet and padding underneath, not just the surface. Free quote.',
    resource: 1,
  },
  {
    slug: 'rug-cleaning',
    value: 'Rug cleaning',
    title: 'Rug Cleaning',
    noun: 'rug cleaning',
    icon: 'rug',
    blurb: 'Faded, matted or stained area rugs cleaned in place, with no wait for an off-site cleaner.',
    long:
      'Rug cleaning in Cambria County, PA brings faded, matted, or stained area rugs back to life. ArrowMax cleans rugs of all sizes and materials in place, restoring their color and texture without the wait of an off-site cleaner.',
    points: ['Rugs of all sizes and materials', 'Cleaned in place', 'Color and texture restored', 'No off-site wait'],
    image: rugImg,
    imageAlt: 'Ornate blue and orange area rug in a living room',
    seoTitle: 'Area Rug Cleaning in Western PA | ArrowMax',
    seoDesc:
      'Area rug cleaning in Westmoreland, Indiana and Cambria County, PA. Rugs of all sizes and materials cleaned in place, with no off-site wait. Free quote.',
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

export interface Review {
  quote: string;
  name: string;
  place: string;
  service: string;
}

/** The three reviews currently on the live site — add more as the business collects them. */
export const REVIEWS: Review[] = [
  {
    quote: 'ArrowMax showed up on time, worked fast, and our carpets look brand new. No pressure, no upselling. Just honest work.',
    name: 'Karen M.',
    place: 'Greensburg, PA',
    service: 'Carpet cleaning',
  },
  {
    quote: 'Our tile grout had years of grime. They got it back to almost original color. Genuinely impressed with the results.',
    name: 'Dave R.',
    place: 'Indiana, PA',
    service: 'Tile & grout',
  },
  {
    quote: 'Careful with our hardwood floors and the shine came back without any streaking. Would recommend to anyone in the area.',
    name: 'Lisa T.',
    place: 'Johnstown, PA',
    service: 'Hardwood floors',
  },
];

export interface Resource {
  n: string;
  title: string;
  body: string;
  image: ImageMetadata;
  alt: string;
}

export const RESOURCES: Resource[] = [
  {
    n: '01',
    title: "What's living in your carpet",
    body: 'Dirt, grease, pollen, bacteria, dust mites, and pet dander all settle deep into carpet fibers over time. This 200x zoom comparison shows the difference between untreated and professionally cleaned carpet fibers.',
    image: fibersImg,
    alt: 'Carpet fibers at 200x zoom, dirty versus professionally cleaned, above a before and after photo of an office carpet',
  },
  {
    n: '02',
    title: 'Why pet urine needs more than a surface clean',
    body: "Urine doesn't stay on top of the carpet. It moves through the fibers and backing and into the padding and sub-floor below, which is why surface sprays alone rarely solve the problem.",
    image: urineImg,
    alt: 'Cross-section diagram of carpet showing urine soaking through fibers, backing and padding down to the sub-floor',
  },
  {
    n: '03',
    title: "What's building up in your mattress",
    body: 'Mattresses collect allergens, dust mites, bacteria, and skin cells over years of daily use. Regular deep cleaning of carpets and upholstery helps reduce the same buildup throughout the rest of your home.',
    image: mattressImg,
    alt: 'Diagram of a mattress labeling dust mites, mite feces, allergens, bacteria, fungal spores and dust',
  },
];

/* ------------------------------------------------------------------------------------------------
   FAQs. Every answer here comes from facts already on the old site or from details the owner supplied.
   Topics customers commonly ask that are NOT answered yet (they need the owner's input): drying time,
   payment methods, guarantee/re-clean policy, insurance, scheduling windows, furniture moving.
   ------------------------------------------------------------------------------------------------ */
export type FaqCategory = 'pricing' | 'services' | 'areas' | 'company';

export interface Faq {
  q: string;
  a: string;
  cat: FaqCategory;
  /** service slugs (or 'all') whose pages should show this question */
  tags?: string[];
  /** show on the home page */
  home?: boolean;
}

export const FAQ_CATEGORIES: { key: FaqCategory; label: string; icon: string; blurb: string }[] = [
  { key: 'pricing', label: 'Pricing & quotes', icon: 'tag', blurb: 'How we price, and how to get a quote.' },
  { key: 'services', label: 'Our services', icon: 'sparkles', blurb: 'What we clean, and how we handle it.' },
  { key: 'areas', label: 'Service areas', icon: 'pin', blurb: 'Where we work in western Pennsylvania.' },
  { key: 'company', label: 'About ArrowMax', icon: 'shield', blurb: 'Who is behind the work.' },
];

export const FAQS: Faq[] = [
  // ---- pricing
  {
    cat: 'pricing',
    home: true,
    tags: ['all'],
    q: 'How much does cleaning cost?',
    a: "Every home is different, so we quote before we clean. Tell us about your floors and we'll give you a straight answer on price. No pressure, no surprises.",
  },
  {
    cat: 'pricing',
    tags: ['all'],
    q: 'Is the quote really free?',
    a: "Yes. Getting a quote from ArrowMax is free, and there's no pressure to book. We give you a straight answer on price and you decide whether it's right for you.",
  },
  {
    cat: 'pricing',
    q: 'How do I get a quote?',
    a: 'Send a request through our contact page or call (724) 702-4340. Tell us what needs cleaning and which county you’re in, and we’ll get back to you with a straight answer on price.',
  },
  // ---- services
  {
    cat: 'services',
    home: true,
    tags: ['carpet-cleaning'],
    q: 'Can you clean just one room?',
    a: "Yes. Whether it's one room or the whole house, we handle it.",
  },
  {
    cat: 'services',
    home: true,
    tags: ['carpet-cleaning', 'upholstery-cleaning'],
    q: 'Will cleaning help with allergens?',
    a: "Dirt, pollen, dust mites, bacteria, and pet dander settle deep into carpet and upholstery over time. A professional deep clean reaches what everyday cleaning can't, which removes allergens and helps improve the air quality in your home.",
  },
  {
    cat: 'services',
    tags: ['tile-and-grout-cleaning'],
    q: 'Can you bring back the color of my grout?',
    a: "That's where ArrowMax really makes a difference. Grout lines collect grime that scrubbing alone can't fix, and our professional cleaning restores the original color and brightness of tile floors, backsplashes, and more.",
  },
  {
    cat: 'services',
    home: true,
    tags: ['hardwood-floor-cleaning'],
    q: 'Is professional cleaning safe for hardwood floors?',
    a: 'It is when it is done right. The wrong products can cause real damage to wood, so we use methods designed specifically for hardwood to safely remove buildup and bring back the natural warmth and finish.',
  },
  {
    cat: 'services',
    tags: ['upholstery-cleaning'],
    q: 'Will you soak my sofa or leave a residue?',
    a: 'No. We clean sofas, chairs, and cushions without soaking them or leaving a residue, lifting everyday dirt, oils, and odors so your furniture looks and feels fresh again.',
  },
  {
    cat: 'services',
    home: true,
    tags: ['pet-urine-treatment'],
    q: 'Can you get pet urine odors out?',
    a: "That's exactly what our pet urine treatment is for. Urine moves through the carpet fibers and backing into the padding and sub-floor, so a surface spray rarely solves it. We treat the carpet and padding underneath to remove what's actually causing the smell, not mask it.",
  },
  {
    cat: 'services',
    home: true,
    tags: ['rug-cleaning', 'upholstery-cleaning'],
    q: 'Do you clean upholstery and area rugs too?',
    a: 'Yes. We clean sofas, chairs, and cushions without soaking them or leaving a residue, and we clean area rugs of all sizes and materials in place, so there is no wait for an off-site cleaner.',
  },
  // ---- areas
  {
    cat: 'areas',
    q: 'Which areas do you serve?',
    a: "We're a local company serving Westmoreland County, Indiana County, and Cambria County in western Pennsylvania.",
  },
  {
    cat: 'areas',
    q: 'Do you serve my town?',
    a: "If you're in Westmoreland, Indiana, or Cambria County, very likely. Check the county pages for the towns we list, and if you don't see yours, give us a call at (724) 702-4340 and we'll let you know.",
  },
  // ---- company
  {
    cat: 'company',
    q: 'Is ArrowMax veteran owned?',
    a: 'Yes. ArrowMax Clean is veteran owned and operated, built on the same values that define military service: integrity, discipline, dedication, and attention to detail.',
  },
  {
    cat: 'company',
    q: 'How long has the company been in the cleaning industry?',
    a: 'ArrowMax has roots in the cleaning industry dating back to 1975, and our commitment to quality workmanship, dependable service, and customer satisfaction runs deep.',
  },
];
