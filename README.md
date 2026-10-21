# Mudit Mehrotra — Portfolio

A one-page portfolio in Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis. It uses only white, black and grays. There is no loader, no WebGL and no GSAP. All text comes from `assets/resume.pdf`, through `src/lib/data.ts`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-check + lint)
npm start        # serve the build
```

Set `SITE_URL` (for example `https://example.com`) when you build for production, so the Open Graph image URLs are absolute.

First-load JS for `/` is about 129 kB. Lighthouse on the production build gives:
- Mobile: Performance 95, Accessibility 100, Best Practices 100, SEO 100.
- Desktop: 100 in all four categories.

## Sections

| # | Section | id | Component | Signature interaction |
|---|---|---|---|---|
| – | Hero | `top` | `hero/Hero.tsx` | Looping intro video (multiply-blended), ghost first name, ▶/❚❚ sound button. Pauses below 35 % visibility. |
| 01 | About | `about` | `sections/About.tsx`, `ui/IdCard.tsx` | ID card on a lanyard: damped pendulum, idle sway, 3D flip (hover, tap, Enter/Space). |
| 02 | Skills | `skills` | `sections/Skills.tsx`, `ui/TechLogo.tsx` | Periodic table with a diagonal-wave reveal, family filter, and a sticky inspector with the brand logo. |
| 03 | Work | `work` | `sections/Work.tsx` | Expanding accordion with grayscale "Illustrative UI" mini-mockups. |
| 04 | Certifications | `certifications` | `sections/Certifications.tsx` | Ink-flood rows. |
| 05 | Experience | `experience` | `sections/Experience.tsx` | Scroll-drawn spine; stops light up as it reaches them. |
| 06 | Achievements | `achievements` | `sections/Achievements.tsx` | Pinned horizontal track, count-up numbers, lift on the centre card. |
| 07 | Contact | `contact` | `sections/Contact.tsx` | Letter hop, copy-email chip, spinning "say hello" badge, footer. |

`Navigation.tsx` provides the following:
- the progress bar
- the frosted pill with a sliding active indicator (IntersectionObserver, `-45% 0px -50% 0px`)
- the mobile clip-path overlay, which closes with Esc and locks page scroll while open

Shared pieces:
- `lib/scroll.tsx` handles Lenis and `scrollToTarget`.
- `lib/hooks.ts` provides `useInView`, `useScrollProgress` and `prefersReducedMotion`.
- `ui/RevealObserver.tsx` adds `.is-in` to `.rv` / `.rv-mask`.

### Content notes

- The résumé PDF has **no embedded hyperlinks**. The GitHub and LinkedIn URLs are built from the plain-text handles in its header.
- The résumé lists no personal projects or repo links, so **Work** shows its four professional engagements and has no "View on GitHub" buttons. If you add `github` to a project in `data.ts`, the button appears.
- The following are not in the résumé, so they are left out:
  - location
  - CGPA
  - school / intermediate results
  - coding-platform stats (LeetCode etc.)

  Achievements therefore use the résumé's own figures and honours, with line icons instead of platform logos.
- ID card: "ID No." shows the GitHub handle and "Valid till" shows the graduation year (2020). Both come from the résumé.
- The résumé names clients (Gap Inc., PepsiCo). Check that publishing them is allowed before you deploy.

### Design deviation

`--mute` is `#6e6c66` instead of `#77756f`. The original measured 4.12:1 on the paper background, below WCAG AA (4.5:1). The new value gives 4.7:1.

## Rebuilding the hero video

```bash
pip install numpy imageio-ffmpeg   # or: brew install ffmpeg (needs libx264, libvpx, libopus, libwebp)
python3 scripts/build-hero-assets.py [path/to/intro.mp4] [--crop W:H:X:Y] [--photo face.jpg]
```

The script runs these steps:

1. **Crop.** It finds the person automatically: the dark pixels across 12 sampled frames, walking out from the centre so edge watermarks are ignored. It then crops a centred 4:5 box from head to toe and scales it to 768×960. Pass `--crop` to override the detection.
2. **Whiten.** It applies `colorlevels` with `imax` set from the measured backdrop. For a clean white wall this is 0.98. This AI-rendered backdrop sits at about 240/255, so it needs about 0.926. The background becomes pure white and disappears under `mix-blend-mode: multiply`.
3. **Loop.** It takes the first 10 s and outputs `clip[0.5 s → 10 s]`, with the last 0.5 s cross-faded into `clip[0 → 0.5 s]`:
   - Video uses `xfade`.
   - Audio uses an equal-power fade, sample-accurate in numpy (not `acrossfade`).

   Nothing is retimed, so lip sync holds, and the end frame equals the start frame.
4. **Export.**
   - `public/hero/hero.mp4`: H.264, CRF 24, `-preset slow`, AAC 96 kbps, `+faststart`.
   - `public/hero/hero.webm`: VP9, CRF 36, Opus 80 kbps.
   - `public/hero/hero-poster.webp`: the first loop frame, used as the LCP poster.
5. **Stills.**
   - `public/portrait-bust.webp` (480×600 head-to-shirt crop from the sharpest frame, or from `--photo`).
   - `public/og.jpg` (1200×630, multiplied onto the paper colour).

## Brand logos — credits & licences

The files in `public/logos/` are used unmodified, except that simple-icons paths are filled with their official hex colour.

| Logo(s) | Source | Licence |
|---|---|---|
| Python, FastAPI, React, Node.js, Nest.js, JavaScript, PostgreSQL, Microsoft SQL Server, Azure, Git | [devicon](https://devicon.dev) v2.17.0, "original" variants | MIT — `public/logos/LICENSE-devicon` |
| LangChain, LangGraph | [simple-icons](https://simpleicons.org) v16.35.0 | CC0 1.0 — `public/logos/LICENSE-simple-icons.md` |

All logos are trademarks of their respective owners and are shown only to name the technologies used. No Power BI mark is available in either set, so Power BI uses a custom line icon, as do the concept skills (Multi-Agent Systems, RAG, Guardrails, RBAC, REST APIs). Azure Data Factory uses the general Azure mark.

Fonts are in `src/fonts/` and are self-hosted with `next/font/local`. They are SIL Open Font License 1.1 (licence files are next to them):
- Inter Tight (variable)
- Instrument Serif (regular + italic)
- JetBrains Mono (variable)
