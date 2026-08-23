# Interactive Memory Website — Progress & Roadmap

> Hand this file to the assistant to resume work. It contains current state,
> conventions/decisions, and detailed plans for every remaining phase.
>
> Spec reference: the original build specification (§numbers used throughout).

---

## HOW TO RESUME A SESSION

1. Working directory: `C:\Users\ASUS\Projects\pattu`
2. Run: `npm run dev` → http://localhost:3000 (site) · `/admin` (admin)
3. Read the **Current State** + **Conventions** below.
4. Work ONE phase at a time. After each phase:
   - verify (run/build/test — never claim untested things work)
   - `npx tsc --noEmit` + `npm run lint`
   - commit (`phase N: ...`)
   - STOP and let the owner inspect before continuing.

---

## CURRENT STATE (after Phase 5 — design v3 "flower scrollytelling")

> DESIGN PIVOT: owner supplied a bubu & dudu reference (cream/blush/cocoa palette,
> Fredoka + Quicksand + Caveat) then a flower-story direction: bloom → petal falls
> w/ photo → lands on dandelion → wind scatters seeds each carrying photos → seeds
> germinate into flowers holding photos → archive button. Old 6-scene layout and
> Connector/Pop were deleted. Admin inherits new palette via token aliases.

### Scrollytelling architecture (replaces Phase 6 plan's Lenis/GSAP question)
- `components/story/SceneShell.tsx` — tall section (`vh` prop) + CSS-sticky pinned
  stage; render-prop hands `scrollYProgress` (motion `useScroll`) to scene content.
  No GSAP; motion-only scrubbing, reversible by construction.
- `story/Thread.tsx` — dashed connector drawing via pathLength.
- Scenes: `BloomScene` (stem grows, petals unfurl staggered, memory detaches+falls),
  `DandelionScene` (memory lands, gusts shake head, 4 seeds fly each with mini
  polaroid), `GrowScene` (3 stems sprout, blooms hold photos), `EndingScene`
  (+ `archive/ArchiveOverlay.tsx` modal grid, Esc/backdrop close).
- Hero (`IntroScene`) keeps bears SVGs + fanned polaroids + wiggle headline.
- Reduced motion: CSS keyframes disabled via media query; motion transforms still
  scrub (acceptable until dedicated pass in Phase 12).

> Build note: this Next version (16.3.2) deprecates `middleware` in favor of `proxy`
> (build warning seen Phase 5; still works — migrate when touching auth next).
> `<Image priority>` is deprecated → use `preload`.

### Stack (installed & working)
- Next.js 16.3.2, React 19.2.8, TypeScript strict, ESLint 9, Tailwind v4 (CSS-first)
- motion 13.1.1 (`import { ... } from "motion/react"`), mongoose 9, cloudinary 2,
  next-cloudinary 6 (installed, unused yet), jose 6, bcryptjs 3, zod 4, tsx (dev)
- Node v22 on machine. Project lives OUTSIDE OneDrive on purpose.

### What exists
| Area | Location | Notes |
|---|---|---|
| Design tokens | `src/app/globals.css` | §32 palette as CSS vars + `@theme inline`; utilities like `bg-background`, `text-text-primary`, `bg-warm-red`, `bg-deep-sage` |
| Placeholder home | `src/app/page.tsx` | says "Interactive Memory Website" |
| DB connection | `src/lib/mongodb.ts` | cached mongoose connect; Atlas db `pattu-memories` |
| Models | `src/models/Memory.ts`, `MediaAsset.ts`, `Scene.ts` | Memory = full §11 schema incl. sceneId/slotId/objectPosition/displayMode |
| Cloudinary lib | `src/lib/cloudinary.ts` | LAZY config inside `requireCloudinaryEnv()` (module-scope config broke scripts); folders `boyfriend-site/images|videos`; `createSignedUploadParams(mediaType)` single source of truth |
| Asset persist | `src/lib/media.ts` | `saveMediaAsset()` verifies asset via Admin API then upserts MediaAsset w/ thumbnail |
| Validation | `src/lib/validations.ts`, `src/lib/memorySchemas.ts` | zod schemas for sign/save/create/update |
| Auth | `src/lib/auth.ts` + `src/middleware.ts` | jose JWT in httpOnly cookie `pattu_session`; middleware guards `/admin/:path*` and `/api/admin/:path*` |
| Auth routes | `src/app/api/auth/login|logout/route.ts` | login has in-memory rate limit (8 / 5 min) |
| Upload routes | `src/app/api/upload/sign/route.ts`, `src/app/api/upload/route.ts` | server dictates folder+formats; client uploads DIRECTLY to Cloudinary |
| Admin APIs | `src/app/api/admin/memories[/id]/route.ts`, `.../meta/route.ts` | full CRUD; DELETE destroys Cloudinary source too |
| Slot registry | `src/config/scenes.ts` | STORY_SCENES: 6 scenes × slots w/ ids + aspectRatio; also DISPLAY_MODES, CATEGORIES |
| Admin UI | `src/app/admin/login/page.tsx`, `src/app/admin/(dash)/{layout,page}.tsx`, `(dash)/scenes/page.tsx`, `(dash)/media/page.tsx` | memories dashboard + upload panel + edit modal; scenes page shows aspect-correct slot previews; media page flags orphans |
| Admin components | `src/components/admin/{LoginForm,LogoutButton,MemoriesDashboard,UploadMemory,MemoryEditor}.tsx` | drag-drop, progress bar, cancel/retry, scene/slot assignment (§42 archive-vs-story) |
| Scripts | `npm run seed` (`src/scripts/seed.ts`) | reseeds 6 scenes + 6 sample memories (picsum placeholders + one real demo video) |
| Test scripts | `src/scripts/test-cloudinary.ts` (`--keep` to preserve asset), `verify-deleted.ts` | live pipeline + delete-chain tests |
| Story page | `src/app/page.tsx` + `src/components/story/{SceneShell,Thread,StoryCanvas}.tsx` | pinned scrollytelling (CSS sticky + motion scrub), no scroll engine lib |
| Scenes | `src/components/scenes/{Intro,Bloom,Dandelion,Grow,Ending}Scene.tsx` | flower narrative; placeholder URLs via `scenes/placeholders.ts` |
| Flora SVGs | `src/components/flowers.tsx` | FlowerHead, DandelionHead, Seed, Sprout, Petal (flat palette fills) |
| Archive | `src/components/archive/ArchiveOverlay.tsx` | modal grid w/ polaroids + video item; Phase 9 will make it DB-driven |
| Scaffold | `src/components/media/{MediaSlot,Polaroid}.tsx`, `src/components/animation/{FloatingDoodle,Sticker,Floaters}.tsx` | aspect-stable slot, polaroid frame w/ tape+caption, doodles/stickers/ambient floaters |
| Handwriting + display fonts | Quicksand body · Fredoka headings (`font-display`) · Caveat accents (`font-hand`) | bubu & dudu reference tokens in globals.css; legacy aliases (deep-sage→cocoa etc.) keep admin compiling |

### Env vars (.env.local — NEVER committed)
```
MONGODB_URI=mongodb+srv://.../pattu-memories        # Atlas cluster
CLOUDINARY_CLOUD_NAME=dn3nu928
CLOUDINARY_API_KEY=374714139694341
CLOUDINARY_API_SECRET=...
AUTH_SECRET=<32-byte hex>
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH_HEX=<hex-encoded bcrypt of "changeme">
```

### Hard-won gotchas (do not relearn these)
1. **`.env` values containing `$` get mangled by Next's env expansion even in single quotes** → bcrypt hash stored HEX-encoded (`ADMIN_PASSWORD_HASH_HEX`), decoded in login route.
2. Cloudinary SDK config must happen lazily (inside `requireCloudinaryEnv()`), not module scope — standalone tsx scripts import modules before loading `.env.local`.
3. tsx treats `.ts` as CJS here → top-level await fails; wrap scripts in `async function main()`.
4. Turbopack root warning fixed via `turbopack.root` in `next.config.ts` (stray package-lock.json in C:\Users\ASUS).
5. Admin pages needing auth live under route group `src/app/admin/(dash)/` so `/admin/login` gets no nav chrome.
6. Mongoose 9: use `returnDocument: "after"`, not `new: true`.
7. Login credentials: username `admin`, password `changeme` (placeholder — change later).
8. Seeded photos are picsum.photos placeholders; the video seed uses Cloudinary's public demo dog.mp4.

### Git
Repo initialized; one commit per phase so far (`f207c74`…`a0128bc`). `.env*` ignored except `.env.example`.

---

## REMAINING PHASES — DETAILED PLANS

### PHASE 5 — Static visual prototype (design system + first scenes, placeholder media)
Goal per §92: prove the VISUAL LANGUAGE works before any dynamic data or scroll engine wiring.

Do:
1. Extend design tokens in `globals.css`: type scale (primary sans stays Geist; add ONE handwritten accent font via next/font/google — candidates: Caveat, Shadows Into Light, Gochi Hand — pick the least cheesy), spacing rhythm, radii, shadow set, doodle stroke color/style variables.
2. Build primitive components in `src/components/ui/`: minimal Button, Input, Dialog (or skip if admin already covers needs — reuse instead).
3. Create story scaffolding components (static versions only):
   - `components/story/StoryCanvas.tsx` — tall page wrapper, background layers
   - `components/media/MediaSlot.tsx` — stable container honoring aspectRatio/objectPosition/displayMode from config; renders placeholder art when no memory assigned
   - `components/animation/Connector.tsx` — SVG path with hand-drawn feel (slightly irregular path data), static reveal styling for now
   - `components/animation/FloatingDoodle.tsx` — tiny stars/arrows/scribbles as inline SVGs, `aria-hidden`
4. Hand-build first 3–5 scenes in `src/components/scenes/` using seeded placeholder images directly (IntroScene, MemoryScene, ConnectedMemoryScene, VideoScene, CollageScene). Vary composition per §19/20/78/79: asymmetry, breathing room, density changes.
5. Typography pass: handwritten captions only as accents (§34).
6. Verify: visual walkthrough at desktop width, all scenes reachable by plain scrolling, no layout jank. Screenshot review with owner.

Acceptance: 3–5 composed scenes visible on `/` with placeholder media, consistent palette/type, connectors present but NOT yet scroll-linked. No MongoDB coupling yet.

---

### PHASE 6 — Core scroll engine
Goal per §61: global scroll progress → scene progress → animation values. Feel > effects.

Do:
1. Decide smooth-scroll: add Lenis ONLY if native scrolling feels insufficient (§27). One scroll system max. If added, keep native scrollbar behavior and ensure Motion `useScroll` stays in sync.
2. `components/story/SceneProgress.tsx` — wraps each scene, computes normalized progress 0→1 from `useScroll({ target, offset })`, exposes via context/motion values (NO React state per scroll pixel).
3. Scene lifecycle helpers: entry (0–0.25), active (0.25–0.75), exit (0.75–1) mappings via `useTransform`.
4. Global progress context in StoryCanvas (page-level scrollYProgress) driving background tint transitions (§80 color rhythm) and connector layer visibility.
5. Spring smoothing defaults: slow, dreamy (e.g. stiffness ~50–80, damping ~20+; tune visually). Respect `prefers-reduced-motion` from day one (§48): disable parallax/scrub, keep opacity.
6. Verify: instrument temporary progress readout; test slow/fast scroll, reverse scroll (§68/69 — everything must scrub backwards cleanly), trackpad + mouse wheel.

Acceptance: scrolling feels like controlling a camera; zero scroll-event-induced React rerenders (check with React profiler/dev tools); reversibility confirmed.

---

### PHASE 7 — Connected animation (the storytelling)
Goal per §62: demonstrate connected scenes without repetition. Scroll-LINKED (§2/§29), not whileInView spam.

Do:
1. Upgrade Connector to path-reveal driven by scene progress (`useTransform` → strokeDashoffset/pathLength). Connector end of scene N aligns with start of scene N+1 (§23 continuity).
2. Implement scene types (§62): A photo→connector→photo · B photo→doodle→connector→video · C character illustration→line→photo · D collage→connector→next · E cinematic→birthday-transition hook.
3. Photo treatment per §21: soft enter (opacity/scale/y/blur), gentle active drift, subtle exit — varied per scene, never identical everywhere.
4. Video behavior per §16: muted/playsInline/loop default; play when in viewport, pause when out; poster-first loading (§52); one primary video active; minimal controls.
5. Micro-interactions (§70): tiny hover zooms, caption reveals — restrained. Optional subtle custom cursor dot (§71) desktop-only.
6. Doodles/illustrations as accents only (§33/81); connector may transform between motifs (line↔scribble↔arrow) rather than staying a literal thread (§82).
7. Transitions overlap: scene A exit overlaps B entry (§30). Persistent layer for elements that survive multiple scenes (§31).
8. Verify: full forward/backward scrub of every scene; check nothing animates without cause (§86 four questions per object); mobile spot-check comes later (Phase 11) but don't break it now.

Acceptance: the §83 example story reads continuously end-to-end with placeholder content; no isolated "animation showcase" feel; reversible everywhere.

---

### PHASE 8 — Dynamic media into the story
Goal per §63: replace placeholders with MongoDB-driven slots; prove upload/swap safety.

Do:
1. Server component fetches published memories grouped by sceneId/slotId; passes into StoryCanvas → scenes render MediaSlot with real memory data (SmartImage wrapper over next/image with sizes/priority rules per §51; blur placeholders where cheap).
2. Empty-slot fallback art (scene must look intentional when a slot has no memory).
3. Error handling per §73: broken image/video → tasteful placeholder, story continues; DB down → degrade gracefully (§74), never raw errors.
4. Verify THE critical promise (§25/§87): swap which memory occupies a slot via admin → animation untouched; upload brand-new memory → archive grows, story unchanged; portrait↔landscape swap crops correctly via objectPosition.
5. Performance guardrails (§49/50/87): only near-viewport media loads; transform/opacity-only animation; adding 10 photos adds 10 DB rows, not 10 animated objects.

Acceptance: admin swaps/uploads verified against the live story; Lighthouse sanity check not worse than Phase 5 baseline.

---

### PHASE 9 — Archive (living library)
Goal per §38/39/40: Layer B independent from Layer A story.

Do:
1. Archive button near the end of the journey (scrapbook-ish, understated) + optional discreet floating control.
2. `components/archive/MemoryArchive.tsx`: full-screen immersive drawer/modal — dims page, expands softly (§41), preserves scroll position underneath; closes back to exact position.
3. Grid: masonry/editorial (CSS columns), NOT uniform cards. Filters: All / Photos / Videos / Favorites / Birthday (+ date grouping if trivial). Data from API (public memories only).
4. Focused viewer on click: large media, caption/date/location, prev/next, keyboard navigable, Esc closes (§76 accessibility).
5. Videos follow same mute/poster/viewport rules; one active video at a time.
6. Independent pagination/lazy loading — works with 100+ items without touching the story.

Acceptance: open/close round-trip restores scroll exactly; filters instant enough client-side; accessible controls (focus trap, aria labels, keyboard).

---

### PHASE 10 — Birthday chapter
Goal per §35/36/65: a special chapter INSIDE the journey — same design language, warmer.

Do:
1. Gradual transition: connector slows, background warms subtly (token shift via scroll-linked interpolation), birthday doodles begin appearing sparsely BEFORE the chapter (§35 ramp).
2. Cinematic sequence (§36): line enters → curves around photo → becomes border → border opens → message appears → favorite photos → video → connector exits onward. Scrubbed by scroll, reversible.
3. Content sourced from memories flagged category=birthday (seed some in Phase 8/9 testing if absent).
4. Restrained magic: slightly more motion polish, still zero confetti-rain/heart-spam (§84 forbidden list).
5. Exit fades back to ordinary memory world; no "THE END" wall.

Acceptance: chapter feels inevitable, not bolted-on; fully scrubbable both directions; owner emotional sign-off.

---

### PHASE 11 — Mobile compositions
Goal per §46/47/66: dedicated arrangements, not scaled-down desktop.

Do:
1. Per-scene mobile variants: photo centered, connectors travel vertically, fewer simultaneous elements, reduced parallax distances, simplified SVG paths.
2. Composition switches at a breakpoint (~md) — same story beats, different spatial arrangement.
3. Video: pause far-from-viewport aggressively; poster-first; avoid autoplaying multiple.
4. Touch testing: momentum scrolling, scrub reversibility with touch swipe, tap targets ≥44px, no hover-dependent information.
5. Real device test (owner's phone via LAN `npm run dev -- -H` or deployed preview).

Acceptance: smooth on a mid-range phone; story continuity preserved vertically; nothing clipped or overlapping.

---

### PHASE 12 — Performance + final polish
Goal per §67: production-quality delivery.

Do:
1. Lighthouse audit (desktop + mobile): image formats/sizes, lazy loading waterfall, CLS from media slots (aspect-ratio boxes prevent shift), JS budget (LazyMotion if bundle demands it — `motion/react-m`).
2. Loading experience §72: tiny animated mark intro, not percent counters. First-visit paint prioritized (priority on first hero image only).
3. Reduced-motion full sweep §48; keyboard/focus sweep §76; alt text on meaningful media, decorative SVGs aria-hidden.
4. SEO/metadata §75/77: OG tags, favicon, tasteful title/description (already stubbed: "memories" / "a private visual scrapbook").
5. Background music option §53: skip unless owner asks — default muted, remember preference locally if built.
6. Deployment instructions (README): env var list, MongoDB Atlas + Cloudinary setup steps, deploy target (Vercel recommended), admin password rotation steps.
7. Final QA against §89 deliverables checklist (items 1–20).

Acceptance: Lighthouse ≥90s across the board on mobile; all §89 deliverables demonstrably done.

---

## AFTER ALL PHASES (optional ideas — do NOT build unprompted)
- siteSettings collection for editable story text
- audio/note/illustration media types (spec mentions as future)
- HEIC support investigation
- multi-admin users collection
