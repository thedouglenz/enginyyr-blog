# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm run dev` - Start development server at localhost:4321
- `pnpm run build` - Build for production (includes type checking)
- `pnpm run preview` - Preview production build locally
- `pnpm run sync` - Generate TypeScript types for Astro modules

### Code Quality
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting

### Maintenance
- `pnpm run clean` - Remove build artifacts and reinstall dependencies

## Architecture

This is an Astro-based personal engineering blog with two content collections:

### Content Structure
- **Blog posts**: Located in `src/content/blog/` as `.md` and `.mdx` files
- **Proposals**: Located in `src/content/proposals/` for architectural/technical proposals
- Blog uses content layer with glob loader; proposals use traditional content collection
- All content has Zod schema validation for frontmatter

### Key Components
- **Content Management**: Two collections with different processing (blog uses experimental content layer)
- **Theming**: CSS variable-based system supporting light/dark modes via data attributes
- **Search**: Client-side fuzzy search using FuseJS
- **Images**: Dynamic OG image generation using Satori for blog posts
- **Diagrams**: Mermaid support with automatic dark mode theming

### Configuration Files
- `src/config.ts` - Site metadata, social links, display settings
- `astro.config.ts` - Astro configuration with integrations (React, Tailwind, MDX, Mermaid)
- `tailwind.config.cjs` - Custom color system and typography
- `tsconfig.json` - Path aliases (@components, @utils, etc.)

### Content Guidelines
- Blog posts require frontmatter: title, description, pubDatetime, tags
- Draft posts use `draft: true` in frontmatter
- Mermaid diagrams: Import `Mermaid` component in MDX, use `chart` prop with template literals
- Images: Use `CaptionedImage` component for blog images with captions

### Development Notes
- Site runs on Astro v4 with TypeScript strict mode
- Uses experimental content layer for blog collection
- React components for interactivity (search, theme toggle)
- Build outputs to `./dist/` directory
- RSS feed and sitemap generated automatically