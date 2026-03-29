# About Me Page Redesign — Design Spec

## Overview

Redesign the about page as a new route (`/about-me`) using an "Editorial Profile" approach. The page is a personality-forward link-in-bio hub — letting clients and readers get to know Doug personally while routing them to projects and contact info. Mobile-first responsive design throughout.

## Framework & Constraints

- Astro MDX page at `src/pages/about-me.mdx`
- Uses existing `AboutLayout.astro` (or a variant if needed)
- Tailwind CSS with the existing theme system (CSS custom properties, light/dark mode)
- No JavaScript animations — keep it fast and lightweight
- Responsive: mobile-first, single breakpoint at `sm: 640px`
- Must work with existing site typography (IBM Plex Mono) and color tokens

## Sections

### 1. Hero

- Full-width hero image using `https://cdn.enginyyr.com/about.jpeg`
- Dark gradient overlay at the bottom of the image (transparent to black/dark)
- Name "Doug" in large display type overlaid on the gradient
- One-liner tagline beneath the name (e.g. "Father. Builder. Pad thai enthusiast.")
- **Mobile:** Image scales to full viewport width; text remains readable against gradient
- **Desktop:** Same layout, image can have a max-height to prevent it from being too tall

### 2. Bio

- 2-3 short paragraphs, first person, casual but confident tone
- Content covers: father, beatboxer, DIYer, traveler, pad thai lover, building AI products at Magic Ingredient
- Single column, no multi-column layout
- Generous line spacing for readability
- **Desktop:** Text constrained to ~65ch max-width, centered
- **Mobile:** Full width with comfortable padding

### 3. Link Cards — "What I'm Building"

- Section header (e.g. "What I'm Building")
- Responsive grid of project cards:
  - Magic Ingredient (AI workflow automation)
  - Magic Ingredient Facebook page
  - Trailhead (RAG solution)
  - Canopy (AI education)
  - Orbit (word game)
- Each card: title, one-line description, subtle border using site accent color
- Clean and flat styling — no gradients
- Cards link to their respective URLs
- **Desktop:** 2-column grid
- **Mobile:** Single column, full width

### 4. Contact & Community

- Email `doug@enginyyr.com` displayed prominently with copy-to-clipboard button
- Link to Indy Business Connect Facebook group
- Clean typography, accent color for links, no heavy styling
- Feels like a natural page ending, not a boxed-off section
- **Desktop & Mobile:** Single column, centered

## Styling Approach

- All styling via scoped CSS in the MDX file using Tailwind utilities and custom properties
- Respects existing light/dark theme via CSS custom properties (`--color-fill`, `--color-text-base`, `--color-accent`, etc.)
- Hero overlay gradient uses `rgba` for theme compatibility
- Card borders use `skin-accent` color token
- No external CSS files — self-contained in the page

## What's NOT Changing

- Existing `/about` route remains untouched
- No changes to site layout, header, footer, or other components
- No new dependencies or packages
- No JavaScript beyond the existing copy-to-clipboard inline handler

## Content Notes

- Bio copy will be freshly written (creative liberty granted) — casual, personality-forward, first person
- Keep mentions of: fatherhood, beatboxing, DIY, pad thai, travel
- Tone: confident but approachable, not corporate
