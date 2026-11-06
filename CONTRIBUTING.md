# Contributing to Horizon Estate

Thank you for your interest in contributing to **Horizon Estate**! We welcome contributions from developers, designers, and real estate technologists of all experience levels.

This guide outlines our development workflow, coding standards, and pull request procedures.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to `opensource@horizonestate.dev`.

---

## How Can You Contribute?

1. **Reporting Bugs**: Check existing issues first. If not reported, open a new issue with reproduction steps, environment details (Node version, browser), and screenshots.
2. **Suggesting Enhancements**: Propose architectural improvements, accessibility enhancements, or new listing components.
3. **Submitting Pull Requests**: Implement bug fixes, documentation updates, or planned roadmap features.

---

## Local Development Workflow

### 1. Prerequisites
- **Node.js**: `18.18.0` or `20.x` (LTS recommended)
- **Package Manager**: `npm` (bundled with Node)

### 2. Fork & Clone
```bash
git clone https://github.com/dmsda/horizon-estate.git
cd horizon-estate
npm install
```

### 3. Branch Naming Conventions
- `feat/property-map-view`
- `fix/mobile-filter-drawer-scroll`
- `docs/customization-guide-cms`
- `perf/image-loading-optimization`

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to preview your changes.

---

## Coding Standards

### TypeScript & React
- Maintain strict typing in `src/types/index.ts`. Avoid `any`.
- Adhere to the Next.js App Router paradigm: keep page shells as Server Components unless interactivity (state, event handlers) requires `'use client'`.
- Validate all props and avoid unhandled `null`/`undefined` accesses.

### Styling & Design System
- Utilize Tailwind CSS classes consistent with established design system tokens:
  - Base colors: `#111111`, `#FFFFFF`, `#F6F6F4`, `#E5E5E5`, `#595959`.
  - Typography: Manrope font weights (`font-medium`, `font-bold`, `font-extrabold`).
  - Radii: `rounded-lg` for interactive buttons, `rounded-xl` for cards, `rounded-full` for badges.
- Avoid inline styles unless computing dynamic CSS variables or geometry.

### Accessibility (a11y)
- Preserve keyboard navigation (`Tab`, `Escape`, `Enter`).
- Ensure all interactive elements have descriptive `aria-label` or visible text labels.
- Provide descriptive `alt` attributes on all `<Image />` elements.

---

## Verification Before Submitting a PR

Before opening a Pull Request, verify that the project builds cleanly without errors:

```bash
# 1. Run ESLint checks
npm run lint

# 2. Run Next.js production build & TypeScript type checking
npm run build

# 3. Test the production bundle locally
npm run preview
```

---

## Submitting Your Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the PR template with:
   - Summary of changes
   - Related issue number (e.g. `Fixes #42`)
   - Screenshots or video recordings demonstrating UI changes on both desktop and mobile viewports.
4. Maintainers will review your PR and provide constructive feedback.
