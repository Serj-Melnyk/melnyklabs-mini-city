# MelnykLabs Mini City — Living Implementation Plan

Last updated: 2026-07-21

## Architecture

The application uses React + TypeScript + Vite. React Three Fiber owns the 3D
canvas, Drei provides focused scene helpers, Zustand stores navigation state,
and GSAP is reserved for later camera/vehicle timelines. Location coordinates,
camera targets, content, and colors live in `src/data/locations.ts` rather than
inside scene components.

```text
src/
├── app/             app shell and global styles
├── data/            location, content, camera and color configuration
├── hooks/           motion/device capability hooks
├── scene/           canvas, camera and lighting composition
├── store/           Zustand navigation/UI state
├── ui/              semantic HTML overlays and fallback
└── world/           configurable primitive city objects
```

## Milestones

### Milestone 1 — Foundation and city blockout

Status: **complete**

- [x] Initialize React + TypeScript + Vite.
- [x] Add Three.js, React Three Fiber, Drei, Zustand, and GSAP.
- [x] Create the proposed modular folder structure.
- [x] Add a basic R3F Canvas with configured camera and on-demand rendering.
- [x] Add simple lighting, loading screen, HTML navigation, and hero overlay.
- [x] Create a city blockout using primitive geometry only.
- [x] Add responsive CSS, reduced-motion handling, and WebGL fallback.
- [x] Complete lint, TypeScript, tests, production build, and browser QA.
- [x] Record final validation results and decisions below.

Acceptance criteria:

- the app starts with one command and renders the city without console errors;
- all navigation controls work with pointer and keyboard;
- a selected location is reflected in a readable HTML panel;
- the app remains navigable without WebGL;
- desktop and mobile compositions avoid clipped critical content;
- lint, typecheck, tests, and production build pass.

### Milestone 2 — Guided camera and scroll route

Status: **complete**

- [x] Interpolate through configured camera checkpoints from scroll progress.
- [x] Add constrained pointer look and touch swipe input.
- [x] Make menu navigation move the camera to a stop.
- [x] Add reduced-motion immediate transitions.
- [x] Preserve browser scroll and avoid trapping the visitor.

Acceptance criteria:

- wheel and touch scroll update one normalized route progress value;
- configured checkpoints are reached at 0%, 15%, 35%, 55%, 72%, 88%, and
  100%;
- HTML navigation and route dots move to deterministic location stops;
- the camera eases toward each target without React state updates in
  `useFrame`;
- mouse look remains within ±12° horizontally and ±6° vertically;
- reduced-motion navigation changes the camera immediately;
- the user can always reverse direction with native wheel or touch scrolling.

### Milestone 3 — Reusable interactions and content panels

Status: **not started**

- Extract a generic interactive-object contract.
- Add hover/focus/click highlight states and object tooltips.
- Build complete About, Projects, Services, Lab, and Contact content.
- Add responsive panel/bottom-sheet transitions and deep links.

### Milestone 4 — Navigation car

Status: **not started**

- Define road curve and configured stops.
- Animate position/orientation with a small state machine.
- Add follow camera and reduced-motion alternative.

### Milestone 5 — Guide character

Status: **not started**

- Introduce a modular low-poly character.
- Add Idle, Walk, and Point clips and transitions.
- Keep all guidance duplicated in accessible HTML.

### Milestone 6 — Production assets and scene polish

Status: **not started**

- Validate the blockout before replacing primitives.
- Export modular GLB assets from Blender.
- Add compressed textures/models, instancing, and restrained effects.
- Keep interactive buildings and characters as separate scene objects.

### Milestone 7 — Optimization, accessibility, and release

Status: **not started**

- Implement device quality selection and lightweight mode.
- Audit keyboard, screen-reader, reduced-motion, and no-WebGL paths.
- Test target browsers/devices and slow-network behavior.
- Add production metadata, analytics decision, deployment, and domain.

## Milestone 1 decisions

- The visual reference uses a dark indigo backdrop rather than an empty black
  canvas; it improves perceived loading and contrast.
- The blockout uses no external 3D assets, keeping the initial asset payload at
  zero and making scale/composition cheap to revise.
- The scene uses `frameloop="demand"` because the current milestone is static.
- Essential location content is rendered in HTML. Scene clicks and menu clicks
  update the same Zustand state.
- Location camera data is present now but will not animate until Milestone 2.
- The detailed taxi and character animations are intentionally deferred.

## Discoveries

- The repository started as an empty local Git repository with no remote.
- npm is the selected package manager because no prior lockfile existed.
- GitHub CLI authentication is available for the `Serj-Melnyk` account.

## Validation log

Completed on 2026-07-20:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed, 3/3 tests.
- `npm run build` — passed with one expected Vite chunk-size warning for the
  Three.js foundation (298 kB gzip); code splitting remains a later
  optimization task.
- Browser console — no errors after the final lighting change.
- Desktop — verified at the concept's native 1536×1024 viewport.
- Mobile — verified at 390×844; the menu opens, reports `aria-expanded`, and
  Contact Station appears as an in-viewport 366 px bottom sheet.
- Interaction — Projects opens Project District, updates `aria-current`, and
  the close control restores `aria-hidden="true"`.

### Visual fidelity ledger

| Comparison point | Result |
| --- | --- |
| Header brand and navigation order | Exact copy and placement family preserved |
| Hero heading, support copy, and CTA | Exact copy and hierarchy preserved |
| Indigo, cream, coral, mint, and mustard palette | Preserved in HTML and scene materials |
| Full-screen city, right route rail, bottom hint | Preserved |
| City framing and tabletop silhouette | Adjusted after browser QA so the full platform fits |
| Detailed façades, signs, props, and roads | Intentionally primitive in Milestone 1; deferred until the validated Blender asset milestone |

The above-the-fold copy diff is empty. The browser implementation was compared
directly with the generated concept at 1536×1024 using original-size images.
Within the explicit primitive-geometry constraint, no fixable visual mismatch
remains for Milestone 1.

### Performance discovery

The initial draft used Drei's remote environment preset. Browser QA showed that
it was unnecessary for the blockout, so it was removed in favor of the two
configured lights and basic shadows. The current scene has no external 3D or
environment asset request.

## Next milestone

Implement only Milestone 3: reusable interactions and complete content panels.
Re-inspect the existing implementation and this plan first.

## Milestone 2 decisions

- The experience uses a 650svh page with a sticky 100svh scene. This creates a
  real browser scroll range instead of intercepting or preventing wheel/touch
  gestures.
- `src/data/cameraRoute.ts` owns checkpoint progress and camera interpolation.
  Camera locations remain outside React components.
- Menu navigation sets the native scroll checkpoint immediately while the R3F
  camera eases toward the new target. This is deterministic even when browser
  animation frames are throttled.
- Camera motion uses `MathUtils.damp` and invalidates the demand-rendered canvas
  only while it is converging.
- Pointer look is mouse-only. Touch input remains available for native vertical
  scrolling.
- Scrollbars are visually hidden to preserve the full-screen composition, but
  scrolling remains native and fully functional.

## Milestone 2 validation log

Completed on 2026-07-21:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed, 6/6 tests across location and route configuration.
- `npm run build` — passed; 299.8 kB gzip with the known Three.js chunk warning.
- Browser console — no errors.
- Desktop 1536×1024 — Projects navigation reached 35% exactly, displayed the
  correct panel, and preserved the first-viewport design when returned to 0%.
- Native wheel — moving from 35% to 51% selected Services without trapping or
  snapping the scroll input.
- Pointer look — center and edge screenshots produced different rendered camera
  views while remaining within configured angular limits.
- Reduced motion — emulated `prefers-reduced-motion: reduce` and verified About
  moved immediately to 15%.
- Mobile 390×844 — a 710 px vertical swipe reached 15.3% and selected About;
  Contact navigation reached 88.0%, closed the menu, and kept the 366 px bottom
  sheet inside the viewport.

### Milestone 2 fidelity check

The generated concept and the final browser screenshot were inspected at the
same native 1536×1024 size. Header order, exact above-the-fold copy, typography
hierarchy, indigo/cream/coral palette, hero/CTA position, city silhouette,
right-side route rail, and bottom instruction remain aligned. The
above-the-fold copy diff is empty. Detailed façades and environmental props
remain the intentional production-asset deviation already recorded in
Milestone 1.
