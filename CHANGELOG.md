# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-15

### Added
- **Dedicated Product Showcase (`/showcase`)**:
  - Hero with simulated browser frame and responsive mobile preview.
  - Interactive Filterable Interface Gallery with modal Lightbox Inspector.
  - Design System foundations (Color palette with HEX copy, Typography specs, Button styles).
  - Feature Implementation Matrix with verified status indicators.
  - Interactive Animation Lab allowing real-time replay of hero reveal, card hover, and text slide without page reloads.
  - Responsive Viewport Switcher comparing 1440px desktop, 768px tablet, and 390px mobile screens.
  - Modern Frontend Technology Stack cards with engineering rationales.
  - Getting Started terminal instructions with one-click copy.
  - Open-source call-to-action block.
- **Architectural Real Estate Pages (39 Pre-Rendered Routes)**:
  - Homepage (`/`) with dynamic hero, curated featured listings, investment highlights, and global agent directory.
  - Property Discovery Marketplace (`/properties`) with real-time multi-criteria filtering.
  - Individual Property Detail Pages (`/properties/[slug]`) including Serenity Tower and Island Retreat.
  - Prime Rentals (`/rentals`), New Developments (`/developments`), and Commercial Properties (`/commercial`).
  - Institutional Investment & Yield Advisory (`/investment`) with interactive ROI and mortgage calculator.
  - Advisory Services (`/services`), About & Philosophy (`/about`), Careers (`/careers`), and Contact (`/contact`).
  - Editorial Architecture Journal (`/journal` and `/journal/[slug]`).
- **Interactive UI Components**:
  - Full-screen Keyboard-accessible Lightbox Gallery (`ArrowLeft`, `ArrowRight`, `Escape`).
  - Consultation Booking & Agent Inquiry Modal with accessibility trapping.
  - Sticky navigation header with scroll-blur backdrop and mobile drawer.
- **Developer Documentation & Open Source Hygiene**:
  - Comprehensive 20-section `README.md` with responsive screenshot embeds.
  - MIT `LICENSE` with clear asset attribution terms.
  - `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md`.
  - `ASSETS.md` documenting visual sources and licensing rights.
  - Previous Horizon Estate customization guidance, since consolidated into the current RentEase documentation.
  - Safe `.env.example` template.

### Technical Specifications
- Next.js 16.4.1 (Turbopack, App Router)
- React 19.3.0
- Tailwind CSS v4
- TypeScript 5.0+ strict typing
- Lucide React iconography
