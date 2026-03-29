# About Me Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new `/about-me` page with an editorial profile design — personality-forward link-in-bio hub with hero image, conversational bio, project cards, and contact section.

**Architecture:** Single MDX page at `src/pages/about-me.mdx` using the existing `AboutLayout.astro`. All styling is scoped CSS within the MDX file. No new components, dependencies, or layouts needed.

**Tech Stack:** Astro MDX, Tailwind CSS, existing CSS custom properties for light/dark theming.

---

## File Structure

- **Create:** `src/pages/about-me.mdx` — the new about-me page (all content + scoped styles in one file)

No other files are created or modified. The existing `AboutLayout.astro` is reused as-is. The existing `/about` route is untouched.

---

### Task 1: Create the page with hero section

**Files:**
- Create: `src/pages/about-me.mdx`

- [ ] **Step 1: Create the MDX file with frontmatter and hero section**

Create `src/pages/about-me.mdx` with:

```mdx
---
layout: ../layouts/AboutLayout.astro
title: "Doug"
---

<div class="hero-container">
  <img src="https://cdn.enginyyr.com/about.jpeg" alt="Doug" class="hero-img" />
  <div class="hero-overlay">
    <h2 class="hero-name">Doug</h2>
    <p class="hero-tagline">Father. Builder. Pad thai enthusiast.</p>
  </div>
</div>

<style>{`
  .hero-container {
    position: relative;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    max-height: 28rem;
    overflow: hidden;
  }
  .hero-img {
    width: 100%;
    height: 28rem;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 3rem 2rem 2rem;
    background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
  }
  .hero-name {
    font-size: 3rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    letter-spacing: 0.05em;
    line-height: 1;
  }
  .hero-tagline {
    font-size: 1.1rem;
    color: rgba(255,255,255,0.85);
    margin: 0.5rem 0 0 0;
    font-style: italic;
    letter-spacing: 0.02em;
  }
  @media (max-width: 640px) {
    .hero-container {
      max-height: 22rem;
    }
    .hero-img {
      height: 22rem;
    }
    .hero-name {
      font-size: 2.25rem;
    }
    .hero-tagline {
      font-size: 0.95rem;
    }
    .hero-overlay {
      padding: 2rem 1.25rem 1.5rem;
    }
  }
`}</style>
```

- [ ] **Step 2: Verify the page renders**

Run: `cd /Users/doug/dev/enginyyr-blog && npm run dev`

Open `http://localhost:4321/about-me` in the browser. Verify:
- Full-width hero image displays
- Name and tagline overlay on dark gradient at bottom
- Responsive: resize browser to mobile width, image and text scale down

- [ ] **Step 3: Commit**

```bash
git add src/pages/about-me.mdx
git commit -m "feat: add about-me page with editorial hero section"
```

---

### Task 2: Add the bio section

**Files:**
- Modify: `src/pages/about-me.mdx`

- [ ] **Step 1: Add bio content after the hero container div, before the closing style tag**

Insert after the `</div>` closing the hero-container and before the `<style>` tag:

```mdx
<div class="bio-section">

I build AI-powered products at **Magic Ingredient** — tools that help small businesses
automate the work nobody wants to do. When I'm not deep in code, I'm probably
attempting to beatbox for my son (his reviews are mixed but enthusiastic), planning
our next family trip, or arguing that pad thai is a top-three food and I will not
be taking questions.

I'm a DIYer at heart. I like building things — software, furniture, raised garden beds,
whatever needs doing. My guitar playing is best described as "committed." I keep a low-carb
lifestyle most of the time, with a standing exception for pad thai. Some things are
non-negotiable.

The long game? Travel the world with my family, start a compound in Portugal, grow a lot
of our own food, and watch our son find his own version of happiness. That's the whole plan.

</div>
```

- [ ] **Step 2: Add bio styles to the existing style block**

Add these rules inside the `<style>{` block:

```css
  .bio-section {
    max-width: 65ch;
    margin: 2.5rem auto;
    padding: 0 1.25rem;
    font-size: 0.95rem;
    line-height: 1.8;
    color: rgba(var(--color-text-base), 1);
  }
  .bio-section p {
    margin-bottom: 1.25rem;
  }
  .bio-section strong {
    color: rgba(var(--color-accent), 1);
  }
  @media (max-width: 640px) {
    .bio-section {
      margin: 1.5rem auto;
      padding: 0 1rem;
      font-size: 0.9rem;
    }
  }
```

- [ ] **Step 3: Verify the bio renders**

Refresh `http://localhost:4321/about-me`. Verify:
- Bio text appears below hero
- Text is constrained to readable width on desktop
- "Magic Ingredient" is bold and uses the accent color
- On mobile, text fills width with padding

- [ ] **Step 4: Commit**

```bash
git add src/pages/about-me.mdx
git commit -m "feat: add conversational bio section to about-me page"
```

---

### Task 3: Add the link cards section

**Files:**
- Modify: `src/pages/about-me.mdx`

- [ ] **Step 1: Add link cards HTML after the bio section div, before the style tag**

Insert after the bio `</div>` and before `<style>`:

```mdx
<div class="projects-section">
  <h2 class="projects-heading">What I'm Building</h2>
  <div class="projects-grid">
    <a href="https://magic-ingredient.enginyyr.com" target="_blank" rel="noopener noreferrer" class="project-card">
      <h3>Magic Ingredient</h3>
      <p>AI-powered workflow automation for small businesses.</p>
    </a>
    <a href="https://www.facebook.com/magicingredient7" target="_blank" rel="noopener noreferrer" class="project-card">
      <h3>Magic Ingredient on Facebook</h3>
      <p>Updates, tips, and community.</p>
    </a>
    <a href="https://trailhead.enginyyr.com" target="_blank" rel="noopener noreferrer" class="project-card">
      <h3>Trailhead</h3>
      <p>Intelligent document search and knowledge extraction.</p>
    </a>
    <a href="https://learncanopy.com/" target="_blank" rel="noopener noreferrer" class="project-card">
      <h3>Canopy</h3>
      <p>AI-powered education tools to help you grow.</p>
    </a>
    <a href="https://orbit.llm-games.com" target="_blank" rel="noopener noreferrer" class="project-card">
      <h3>Orbit</h3>
      <p>A daily word game based on semantic meaning.</p>
    </a>
  </div>
</div>
```

- [ ] **Step 2: Add project card styles to the existing style block**

```css
  .projects-section {
    max-width: 65ch;
    margin: 1rem auto 2.5rem;
    padding: 0 1.25rem;
  }
  .projects-heading {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    margin: 0 0 1.25rem 0;
    color: rgba(var(--color-text-base), 1);
  }
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .project-card {
    display: block;
    padding: 1.25rem;
    border: 1.5px solid rgba(var(--color-accent), 0.4);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: border-color 0.2s, transform 0.2s;
    background: rgba(var(--color-card), 0.3);
  }
  .project-card:hover {
    border-color: rgba(var(--color-accent), 1);
    transform: translateY(-2px);
  }
  .project-card h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: rgba(var(--color-accent), 1);
  }
  .project-card p {
    font-size: 0.8rem;
    margin: 0.4rem 0 0 0;
    color: rgba(var(--color-text-base), 0.7);
    line-height: 1.4;
  }
  @media (max-width: 640px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
    .projects-section {
      padding: 0 1rem;
    }
  }
```

- [ ] **Step 3: Verify link cards render**

Refresh `http://localhost:4321/about-me`. Verify:
- "What I'm Building" heading appears
- 5 cards in 2-column grid on desktop (last card spans single column)
- Cards have accent-colored border and title
- Hover lifts cards slightly and intensifies border
- Mobile: single column, full width
- Light and dark themes both look correct

- [ ] **Step 4: Commit**

```bash
git add src/pages/about-me.mdx
git commit -m "feat: add project link cards to about-me page"
```

---

### Task 4: Add contact and community section

**Files:**
- Modify: `src/pages/about-me.mdx`

- [ ] **Step 1: Add contact/community HTML after the projects section div, before the style tag**

Insert after the projects `</div>` and before `<style>`:

```mdx
<div class="contact-section">
  <div class="email-row">
    <a href="mailto:doug@enginyyr.com" class="email-link">doug@enginyyr.com</a>
    <button class="copy-btn" onclick="navigator.clipboard.writeText('doug@enginyyr.com').then(() => { const btn = document.querySelector('.copy-btn'); btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 1500); })">Copy</button>
  </div>
  <p class="community-line">
    Indianapolis entrepreneur? Join <a href="https://www.facebook.com/groups/868951352520958" target="_blank" rel="noopener noreferrer">Indy Business Connect</a> on Facebook.
  </p>
</div>
```

- [ ] **Step 2: Add contact/community styles to the existing style block**

```css
  .contact-section {
    max-width: 65ch;
    margin: 0 auto 3rem;
    padding: 1.5rem 1.25rem;
    text-align: center;
    border-top: 1px solid rgba(var(--color-border), 1);
  }
  .email-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
  .email-link {
    font-size: 1.2rem;
    font-weight: 500;
    color: rgba(var(--color-accent), 1);
    text-decoration: none;
  }
  .email-link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .copy-btn {
    padding: 0.3rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    font-family: inherit;
    border-radius: 0.375rem;
    border: 1.5px solid rgba(var(--color-accent), 0.4);
    background: rgba(var(--color-accent), 0.1);
    color: rgba(var(--color-accent), 1);
    cursor: pointer;
    transition: all 0.2s;
  }
  .copy-btn:hover {
    background: rgba(var(--color-accent), 0.2);
    border-color: rgba(var(--color-accent), 1);
  }
  .community-line {
    font-size: 0.85rem;
    margin: 1rem 0 0 0;
    color: rgba(var(--color-text-base), 0.6);
  }
  .community-line a {
    color: rgba(var(--color-accent), 1);
    text-decoration: underline;
    text-decoration-style: dashed;
    text-underline-offset: 4px;
  }
  .community-line a:hover {
    color: rgba(var(--color-accent), 1);
    text-decoration-style: solid;
  }
  @media (max-width: 640px) {
    .contact-section {
      padding: 1.5rem 1rem;
    }
  }
```

- [ ] **Step 3: Verify contact section renders**

Refresh `http://localhost:4321/about-me`. Verify:
- Email displayed prominently with copy button
- Copy button copies email to clipboard and shows "Copied!" feedback
- Community line is subtle, integrated naturally
- Works in both light and dark mode
- Mobile: centered, readable

- [ ] **Step 4: Commit**

```bash
git add src/pages/about-me.mdx
git commit -m "feat: add contact and community section to about-me page"
```

---

### Task 5: Final review and polish

**Files:**
- Modify: `src/pages/about-me.mdx` (if adjustments needed)

- [ ] **Step 1: Full page review**

Open `http://localhost:4321/about-me` and review the complete page:
- Scroll through all sections — hero, bio, cards, contact
- Toggle between light and dark mode
- Resize to mobile width and verify all sections are responsive
- Check that the page title in the browser tab reads "Doug | Enginyyr"
- Click through all link cards to verify URLs work

- [ ] **Step 2: Fix any visual issues found during review**

Address spacing, color, or layout issues if any are found.

- [ ] **Step 3: Commit any polish changes**

```bash
git add src/pages/about-me.mdx
git commit -m "polish: refine about-me page styling"
```
