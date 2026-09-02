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

## CURRENT STATE (after Phase 12 — all visual spec phases complete)

> Visual/animation spec (167 sections) fully implemented through Phase 12.
> Botanical scrapbook aesthetic with animation-ready SVG flower system,
> scroll-linked growth choreography, petal→memory transitions,
> dandelion wind/seed system, seed germination, camera rig, garden archive,
> mobile support, admin preview, reduced motion, and deployment-ready.

### Scrollytelling architecture (upgraded)
- `components/story/SceneShell.tsx` — tall section (`vh` prop) + CSS-sticky pinned
  stage; render-prop hands `scrollYProgress` (motion `useScroll`) to scene content.
  No GSAP; motion-only scrubbing, reversible by construction.
- `components/story/SceneProgress.tsx` — wraps each scene, splits progress into
  entry/active/exit phases via `useTransform` + `SCROLL_RANGES` config.
- `components/story/CameraRig.tsx` — scroll-linked camera scale + translateY,
  per-scene presets from `CAMERA_PRESETS` config.
- `components/story/StemDraw.tsx` — scroll-linked stem drawing via pathLength.
- `components/story/GrowthSequence.tsx` — orchestrates stem → leaves → bud →
  petals → center, mapped to `FLOWER_TIMING` config.
- `components/story/PetalToMemory.tsx` — petal detaches → floats → morphs to
  PaperCard, with 4 reveal variants (dissolve/slide/scale/gentleBlur).
- `components/story/MemoryFloat.tsx` — gentle hover/floating for memory cards.
- `components/story/SeedPath.tsx` — animated seed along SVG path.
- `components/story/SeedGroup.tsx` — orchestrates multiple seed launches.
- `components/story/SeedLanding.tsx` — seed drifts + bounce on landing.
- `components/story/GerminationSequence.tsx` — seed → stem → bud → bloom → memory.
- `components/story/WindEffect.tsx` — dandelion head bending + wind lines.
- `components/story/BackgroundMood.tsx` — scroll-linked background color interpolation.
- `components/story/PersistentGarden.tsx` — botanical elements behind all scenes.
- `story/Thread.tsx` — dashed connector drawing via pathLength (upgraded in Phase 7).

### SVG art system (animation-ready)
- `src/assets/flowers/` — Stem, Leaf, LeafCluster, Bud, Petal, PetalRing,
  FlowerCenter, FlowerHead, DandelionHead, Seed, Sprout, Tendril (all inline SVG).
- `src/assets/decorative/` — Butterfly, FlowerDoodle, StarBurst, Heart, Star, PageCurl.
- `src/components/scrapbook/` — PaperCard, Tape, WashiTape, Stamp.

### Animation config (centralized)
- `src/config/animation.ts` — FLOWER_TIMING, MEMORY_TIMING, CAMERA_PRESETS,
  SCENE_CHEMISTRY, SCROLL_RANGES, SEED_PATHS, WIND_CONFIGS, PAPER_VARIANTS,
  REDUCED_MOTION_OVERRIDES, MOOD_PALETTE.
- `src/config/scenes.ts` — STORY_SCENES (5 beats) + VISUAL_SCENES (full config).
- `src/types/story.ts` — SceneConfig, SlotConfig, CameraPreset, SeedPathType, etc.

### Scenes (rebuilt)
- `IntroScene` — bears + fanned stack + growing flower (scroll-linked).
- `BloomScene` — stem draws, petals unfurl, memory detaches + falls.
- `DandelionScene` — wind shakes head, 4 seeds fly with photos.
- `GrowScene` — 3 seeds germinate, grow into flowers holding photos.
- `EndingScene` — archive button, garden archive overlay.

### Archive (rebuilt)
- `ArchiveOverlay.tsx` — garden metaphor, masonry layout, filter chips, botanical accents.

> Build note: this Next version (16.3.2) deprecates `middleware` in favor of `proxy`.
> Migrated to `src/proxy.ts` (Phase noted, done). `<Image priority>` is deprecated → use `preload`.

### Stack (installed & working)
- Next.js 16.3.2, React 19.2.8, TypeScript strict, ESLint 9, Tailwind v4 (CSS-first)
- motion 13.1.1 (`import { ... } from "motion/react"`), mongoose 9, cloudinary 2,
  jose 6, bcryptjs 3, zod 4, tsx (dev)
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
| Auth | `src/lib/auth.ts` + `src/proxy.ts` | jose JWT in httpOnly cookie `pattu_session`; proxy guards `/admin/:path*` and `/api/admin/:path*`; admin password hash lives in the DB (fallback to `ADMIN_PASSWORD_HASH_HEX` env on first boot) |
| Auth routes | `src/app/api/auth/login|logout/route.ts` | login has in-memory rate limit (8 / 5 min) |
| Upload routes | `src/app/api/upload/sign/route.ts`, `src/app/api/upload/route.ts` | server dictates folder+formats; client uploads DIRECTLY to Cloudinary; both routes now require admin auth |
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
ADMIN_PASSWORD_HASH_HEX=<hex-encoded bcrypt of fallback seed; active hash stored in DB, editable at /admin/settings>
ADMIN_PASSWORD=<optional; `npm run set-admin-password` bootstraps this into the DB>
```

### Hard-won gotchas (do not relearn these)
1. **`.env` values containing `$` get mangled by Next's env expansion even in single quotes** → bcrypt hash stored HEX-encoded (`ADMIN_PASSWORD_HASH_HEX`), decoded in login route.
2. Cloudinary SDK config must happen lazily (inside `requireCloudinaryEnv()`), not module scope — standalone tsx scripts import modules before loading `.env.local`.
3. tsx treats `.ts` as CJS here → top-level await fails; wrap scripts in `async function main()`.
4. Turbopack root warning fixed via `turbopack.root` in `next.config.ts` (stray package-lock.json in C:\Users\ASUS).
5. Admin pages needing auth live under route group `src/app/admin/(dash)/` so `/admin/login` gets no nav chrome.
6. Mongoose 9: use `returnDocument: "after"`, not `new: true`.
7. Admin login: username `admin`, password stored in the DB (bootstrap via `npm run set-admin-password`, or change from Settings → change password). No longer a documented public default.
8. Seeded photos are picsum.photos placeholders; the video seed uses Cloudinary's public demo dog.mp4.

### Git
Repo initialized; one commit per phase so far (`f207c74`…`a0128bc`). `.env*` ignored except `.env.example`.

---

## REMAINING PHASES — ALL COMPLETE

All 12 phases of the visual/animation spec have been implemented.
See the file structure and components listed in CURRENT STATE above.

Optional follow-up work (not part of the spec):
- Dynamic media integration (replace placeholders with MongoDB-driven slots)
- Birthday chapter (special in-journey chapter)
- Site settings collection for editable story text
- Audio/note/illustration media types
- HEIC support
- Multi-admin users

---

## AFTER ALL PHASES (optional ideas — do NOT build unprompted)
- siteSettings collection for editable story text
- audio/note/illustration media types (spec mentions as future)
- HEIC support investigation
- multi-admin users collection
