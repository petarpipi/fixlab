# FixLab

**Frontend Problems. Professionally Solved.**

A complete, browser-local frontend portfolio project. Six interactive repair demonstrations let visitors compare the broken and repaired versions, try real controls, and inspect excerpts extracted directly from the implementation.

## Run locally

Use Node.js **22.12+ or 24 LTS** and **pnpm 11.25.0**. From this directory:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the Local URL printed by Vite (normally `http://127.0.0.1:5173`). To use the review port:

```sh
pnpm dev --port 4173 --strictPort
```

Production output:

```sh
pnpm build
pnpm preview
```

No environment variables, API keys, database, or external runtime services are required.

## The six repairs

| Demo                   | Broken version                         | Repaired version                                                                 |
| ---------------------- | -------------------------------------- | -------------------------------------------------------------------------------- |
| Responsive layout      | Fixed columns overflow the small frame | Fluid CSS grid and safe minimum tracks                                           |
| Mobile navigation      | Inert menu with hidden links           | State-driven disclosure, page selection, Escape and focus restoration            |
| CSS alignment          | Manually offset text and actions       | Stable grid columns, alignment and safe text wrapping                            |
| Image optimization     | Stretched, single-size photograph      | Local AVIF/WebP, `srcset`, intrinsic dimensions, object-fit and lazy loading     |
| Form validation        | Missing validation and submit handling | Field-level messages, first-error focus, successful validation and retry         |
| Interactive components | Decorative dropdown and dead actions   | Native select, modal dialog, explicit focus wrapping and session-only save state |

The hero includes a keyboard-operable comparison slider. The lab has Before/After controls, fluid/mobile preview widths, implementation previews, and code copying with permission-error feedback. Native disclosure elements explain the engineering approach.

## Deliberate demo boundaries

- Before examples are authored static HTML in an iframe with `sandbox=""`, a restrictive document CSP, no scripts, and no form submission. Their intentional defects never become global page styles.
- The form validates locally. It sends and stores nothing; its success state says so explicitly.
- “Save repair” demonstrates React state within the active example. It resets on leaving the example or refreshing. It does not imply a backend or persistence.
- The smaller preview is capped at 320 CSS pixels; it can shrink further to fit its parent. The width toggle is hidden below 600 pixels, where the preview is already phone-sized. The host page is separately tested at 375, 768, 1024, and 1440 pixels.
- Code excerpts show the relevant running function or CSS rules, not every dependency in the file. Validation UI lives in `Previews.tsx`; the displayed validator lives in `validation.ts`.

## Stack

React, TypeScript (strict), Vite, hand-written CSS (a small layered reset, a rem type scale, Grid and container queries), Lucide React, locally bundled Inter Variable, Vitest, Testing Library, Playwright, and axe-core. Entrance animation is plain CSS and is disabled under `prefers-reduced-motion`; no animation or utility-CSS library is shipped.

Versions are pinned in `package.json` and locked in `pnpm-lock.yaml`. TypeScript 6.0.3 is selected because the installed typescript-eslint supports TypeScript versions below 6.1.

## Project structure

```text
src/
  App.tsx                     Page sections and site navigation
  components/
    HeroComparison.tsx        Keyboard-operable before/after slider
    Lab.tsx                   Six-demo workbench and source viewer
    Previews.tsx              Functional repaired examples
  data/demos.ts               Typed demo metadata
  lib/
    brokenExamples.ts         Immutable sandboxed fixtures
    source.ts                 Source-excerpt extraction
    validation.ts             Pure form validator
  test/setup.ts               Vitest DOM setup
  reset.css                   Layered base reset
  styles.css                  Type scale, page design and responsive breakpoints
  demo.css                    Scoped repaired example styles
tests/fixlab.spec.ts           Browser and accessibility tests
public/images/                Local 480px and 960px AVIF/WebP assets
docs/screenshots/             Browser captures at the three target widths
```

## Checks

```sh
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm audit
```

Playwright runs 13 scenarios at each of four widths (375, 768, 1024, 1440). Accessibility scenarios inspect all six repaired examples plus the broken, code, form-error, and open-dialog states; content inside the script-less sandboxed fixture is excluded because axe cannot run there. A local Vite server is started automatically on port 4173 when one is not already running. CI requires an unused port.

To use an already installed Chromium-family executable, set the optional `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its location on your own computer.

Tests can create screenshots in `docs/screenshots/` and disposable results in ignored `test-results/` and `playwright-report/`. Check [TEST_REPORT.md](./TEST_REPORT.md) for the actual execution results and limitations. The tests do not constitute a complete accessibility certification.

## Assets and references

- Inter Variable is distributed through `@fontsource-variable/inter` under its included SIL Open Font License.
- Icons come from Lucide React under its included ISC License.
- The demonstration photograph comes from [Unsplash](https://images.unsplash.com/photo-1600585154340-be6161a56a0c), used under the [Unsplash License](https://unsplash.com/license). Local crops were encoded with Sharp. See [ASSETS.md](./docs/ASSETS.md).
- `src/reset.css` adapts a subset of the Tailwind CSS v4 preflight (MIT License).
- `public/og-image.png` and `public/apple-touch-icon.png` are captures of this site's own hero and favicon. Social platforms need an absolute `og:image` URL, so prefix it with the production origin and add `og:url`/`canonical` once the domain is known.
- Implementation references: [Playwright configuration](https://playwright.dev/docs/test-configuration).

## Portfolio copy

See [PORTFOLIO.md](./PORTFOLIO.md) for the short English Upwork description and feature highlights.

## GitHub and Cloudflare Pages

Prepared as the standalone **fixlab** repository. Run all commands from the cloned repository root. The package name is `fixlab`; it is an internal package identifier. `private: true` prevents accidental npm publication and does not make a GitHub repository private.

| Setting | Value |
| --- | --- |
| Framework | React, TypeScript and Vite |
| Package manager | pnpm 11.25.0 |
| Verified Node.js | 24.22.1 |
| Build command | `pnpm install --frozen-lockfile && pnpm run build` |
| Build output | `dist` |
| Root directory | Leave empty (repository root) |
| Required application secrets | None |

The existing `build` package script also works with `npm run build` after dependencies are installed; pnpm is used for reproducible installation from the committed lockfile. See [CLOUDFLARE_PAGES.md](CLOUDFLARE_PAGES.md) for the build environment and connection instructions.

This repository is a frontend portfolio demonstration. No hosting deployment is performed by these preparation steps.
