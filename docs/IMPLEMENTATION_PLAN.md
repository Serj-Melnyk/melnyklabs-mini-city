# MelnykLabs Mini City — Living Implementation Plan

Last updated: 2026-07-21

## Architecture

The application uses React + TypeScript + Vite. React Three Fiber owns the 3D
canvas, Drei provides focused scene helpers, and Zustand stores navigation
state. The navigation car uses a frame-synchronized state machine so its motion
and the demand-rendered camera advance together. Location coordinates, camera
targets, content, and colors live in data modules rather than scene components.

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

Status: **complete**

- [x] Extract a generic interactive-object contract.
- [x] Add hover/focus/click highlight states and object tooltips.
- [x] Build complete About, Projects, Services, Lab, and Contact content.
- [x] Add responsive panel/bottom-sheet transitions and deep links.

Acceptance criteria:

- 3D objects, top navigation, and the route rail share one location state;
- pointer hover and HTML focus reveal the same location highlight and tooltip;
- every non-plaza stop has structured, readable HTML content;
- panels work as a right-side desktop surface and mobile bottom sheet;
- each location opens directly through a stable URL hash;
- panel headings receive focus after intentional navigation and Escape closes
  the panel;
- no-WebGL visitors retain access to every content panel.

### Milestone 4 — Navigation car

Status: **complete**

- [x] Define road curve and configured stops.
- [x] Animate position/orientation with a small state machine.
- [x] Add follow camera and reduced-motion alternative.

Acceptance criteria:

- every configured city stop maps to the closed ring road;
- menu, route rail, panel actions, and the car itself can start a trip;
- the car follows the one-way ring road, rotates with the road tangent, and
  reaches the exact configured destination without reversing;
- the camera follows the moving car and returns to the location camera after
  arrival;
- destination content opens only after normal-motion arrival;
- reduced-motion and no-WebGL navigation reveal content immediately;
- an HTML live region communicates travelling and arrived states.

### Milestone 5 — Guide character

Status: **complete**

- [x] Introduce a modular low-poly character.
- [x] Add Idle, Walk, and Point states and transitions.
- [x] Keep all guidance duplicated in accessible HTML.

Acceptance criteria:

- every location maps to a configured guide stop and point target;
- the guide walks to the safe inner-plaza stop, turns, points, and returns to
  idle without React state updates per frame;
- clicking the guide previews the next direction without replacing the HTML
  navigation;
- menu and route navigation trigger the same guide orientation cue;
- reduced motion uses an immediate static point pose;
- an HTML live region communicates walking and pointing guidance.

### Milestone 6 — Production assets and scene polish

Status: **complete**

- [x] Validate the blockout before replacing primitives.
- [x] Export modular GLB assets from Blender.
- [x] Add compressed models, instancing, and restrained scene polish.
- [x] Keep interactive buildings, car, and character as separate scene objects.

Acceptance criteria:

- every primary location loads from its own modular GLB;
- the guide and navigation car remain separate interactive objects;
- authored city models stay within the 3–4 MB initial 3D budget;
- repeated trees, lamps, and benches use instancing;
- the loading screen remains visible until the suspended 3D asset tree mounts;
- buildings stay outside the road and each configured car stop is curbside;
- building foundations follow the matching position, dimensions, and rotation;
- lint, typecheck, tests, build, and browser interaction checks pass.

### Milestone 7 — Optimization, accessibility, and release

Status: **complete**

- [x] Implement device quality selection and lightweight mode.
- [x] Add a functional contact-form workflow with a no-transmission fallback.
- [x] Audit keyboard, screen-reader, reduced-motion, and no-WebGL paths.
- [x] Test desktop, mobile, production-base, and slow-resource loading behavior.
- [x] Add production metadata, local fonts, manifest, favicon, and social image.
- [x] Add a validated GitHub Pages deployment workflow.
- [x] Publish the repository and deploy the production build with GitHub Pages.
- [x] Add and verify reference-driven hover labels for all seven buildings.
- [x] Re-verify the public URL after the hover-label release.
- [x] Keep the validated no-transmission contact fallback active until the
  owner optionally provides a private endpoint.

Acceptance criteria:

- compact, coarse-pointer, save-data, and constrained devices select `light`;
- lightweight mode uses DPR 1, removes dynamic shadows and secondary props,
  skips the guide model, and shortens car travel without hiding HTML content;
- the contact form validates all required fields and either posts to the
  configured endpoint or copies a complete portable inquiry locally;
- reduced motion, keyboard navigation, semantic panels, and forced HTML mode
  keep every portfolio stop accessible;
- the initial application shell is code-split from the 3D engine;
- production metadata and all assets resolve under the repository Pages base;
- the public deployment passes the same validation and browser smoke tests.

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

Implement only Milestone 7: finish device quality selection, accessibility,
contact workflow, production metadata, deployment, and release verification.
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

## Milestone 3 decisions

- `src/world/InteractiveObject.tsx` owns the shared pointer selection and hover
  contract. Buildings now supply only geometry and visual response.
- Keyboard focus on the top navigation and route rail updates the same hover
  state as the canvas, so the object highlight and tooltip are not pointer-only.
- Panel copy lives in `src/data/panelContent.ts`; components render structured
  content without location-specific branches.
- URL navigation uses deployment-safe hashes (`#about`, `#projects`,
  `#services`, `#lab`, and `#contact`) instead of adding a router dependency.
- The panel is a non-modal dialog: it focuses its heading after intentional
  navigation, supports Escape, and becomes inert while closed.
- Only the confirmed GitHub profile is linked. Email, LinkedIn, and Telegram
  details were not invented and can be added when the owner supplies them.

## Milestone 3 validation log

Completed on 2026-07-21:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed, 9/9 tests across locations, camera routes, and deep
  links.
- `npm run build` — passed; 304.7 kB gzip with the known Three.js chunk-size
  warning.
- Desktop browser — primary Projects navigation opened the correct panel,
  marked the navigation item current, and changed the URL to `#projects`.
- Responsive browser — desktop uses a right-side scrollable panel; the narrow
  viewport uses an in-frame bottom sheet with focused heading and accessible
  close control.
- Deep links — loading `#lab` directly opened Innovation Lab; Escape closed the
  panel and applied `aria-hidden` plus `inert`.
- Contact — the verified GitHub profile is exposed as a real external link.
- Browser console — no application errors; one upstream Three.js deprecation
  warning for `Clock` remains in the development dependency path.

### Milestone 3 fidelity check

The accepted concept and final browser capture were inspected together. The
header hierarchy, exact hero copy, cream/coral/indigo palette, isometric city
silhouette, right route rail, bottom instruction, and first-viewport content
placement remain aligned. The above-the-fold copy diff is empty. The current
scene intentionally keeps primitive façades and a simplified street/platform
layout until Milestone 6; this is the same documented blockout deviation, not a
new design direction. The richer information panels extend the concept without
changing the landing composition.

## Milestone 4 decisions

- `src/data/carRoute.ts` owns the circular one-way road geometry, derived stop
  progress, forward-only trip calculation, easing, speed, and navigation order.
- `NavigationCar` keeps elapsed trip time and route progress in refs. No React
  state is updated per animation frame.
- The first GSAP draft was replaced during browser QA because its ticker could
  remain paused in a throttled demand-rendered tab. The R3F delta-driven state
  machine shares the scene clock and completes deterministically.
- While driving, `carRuntime` exposes the actual world position and forward
  vector to `CameraController`; it contains no UI state.
- Normal motion closes an existing panel before travel and reopens destination
  content after arrival. Reduced motion skips travel and opens it immediately.
- Navigation remains immediate when WebGL is unavailable; the HTML fallback
  never waits for a 3D component that was not mounted.
- Clicking the visible car advances to the next configured city stop. The
  persistent HTML navigation remains its keyboard-accessible equivalent.

## Milestone 4 validation log

Completed on 2026-07-21:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed, 15/15 tests across route geometry, store state,
  deep links, locations, and camera checkpoints.
- `npm run build` — passed with the known Three.js chunk-size warning.
- Browser navigation — Contact drove from the plaza, announced travelling,
  announced arrival, and opened Contact Station only after completion.
- Car interaction — hovering the car showed `Next: Studio`; clicking the car
  changed the URL to `#about` and arrived at Developer Studio.
- Follow camera — the browser render changed to the moving-car camera during
  travel and returned to the destination view after arrival.
- Reduced motion — emulated `prefers-reduced-motion: reduce`; About arrived and
  opened immediately without a timed trip.
- Mobile 390×844 — the About bottom sheet measured 366×548.6 px and stayed
  inside the 844 px viewport.
- Native visual QA — captured at 1536×1024; the accepted reference is
  1568×1003, and the in-app viewport could not reproduce both native
  dimensions simultaneously.
- Browser console — no application errors; only the existing upstream
  Three.js `Clock` deprecation warning was present.

### Milestone 4 fidelity check

The accepted concept and final browser screenshot were inspected together.
Header order, exact hero copy, CTA, indigo/cream/coral palette, tabletop city
silhouette, ring road, coral car, right route rail, and bottom instruction stay
aligned. The above-the-fold copy diff remains empty. Road markers and the more
legible low-poly car move the blockout closer to the reference without adding
new interface chrome. Detailed façades, street furniture, signs, and production
models remain the intentional Milestone 6 deviation.

## Milestone 5 decisions

- `src/data/guideRoute.ts` owns guide stops, point targets, facing angles,
  timing, and walk sampling; no scene component hardcodes city coordinates.
- Stops stay inside the central plaza so the guide never clips through a
  building or crosses the navigation car's ring road.
- `GuideCharacter` uses a finite R3F state machine with refs. Idle is static,
  while Walk and Point invalidate the demand-rendered canvas only for their
  finite duration.
- Clicking the guide previews the next direction but deliberately does not
  navigate. The persistent HTML menu is the exact accessible action for
  opening that destination.
- Normal navigation triggers Walk then Point. Reduced motion places the guide
  at the target immediately in a static point pose.
- The character remained procedural primitive geometry during blockout
  validation; its modular production GLB was introduced in Milestone 6 while
  preserving the proven code-driven state machine.

## Milestone 5 validation log

Completed on 2026-07-21:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed, 19/19 tests across guide routing, car routing,
  store state, deep links, locations, and camera checkpoints.
- `npm run build` — passed with the known Three.js chunk-size warning.
- Guide interaction — hover exposed `Point to Studio`; clicking the guide
  announced walking without changing the URL or opening a panel.
- State transition — clicking from the destination stop announced pointing
  and named the matching About navigation control.
- Reduced motion — Projects opened immediately and the guide announced a
  static point toward Project District.
- Mobile 390×844 — the guide and city stayed inside the responsive scene with
  no horizontal overflow or broken layout.
- Native visual QA — captured at 1536×1024; the accepted reference is
  1568×1003, and the in-app viewport cannot reproduce both dimensions
  simultaneously.
- Browser console — no application errors; only the existing upstream
  Three.js `Clock` deprecation warning was present.

### Milestone 5 fidelity check

The accepted concept and final browser screenshot were inspected together.
Header order, exact hero copy, CTA, indigo/cream/coral palette, tabletop city
silhouette, central guide placement, coral car, right route rail, and bottom
instruction remain aligned. The above-the-fold copy diff is empty. The guide's
cream/coral/navy palette and compact toy proportions match the reference
family, while its visor and clearer limb separation are intentional blockout
choices that make Walk and Point readable. Detailed façades, street furniture,
signs, and authored character animation remain the planned Milestone 6
deviation.

## Milestone 6 decisions

- Production buildings, plaza landmark, and guide character are generated as
  separate Blender-authored GLBs by `tools/blender/generate_city_assets.py`.
  `npm run assets:generate` makes the asset build reproducible.
- Blender 3.6 LTS is used by the generation script on the current macOS host;
  newer Blender builds could not import their bundled NumPy extension on this
  OS version.
- Exported city assets use Draco geometry compression and local decoder files,
  avoiding a runtime dependency on a third-party CDN.
- The navigation car is an original Blender-generated MelnykLabs sports coupe:
  a low wedge body, wide stance, dark canopy, splitter, diffuser, spoiler, and
  chunky low-poly wheels. It is reproducible from the same project-owned asset
  generator and needs no external model attribution.
- Trees, lamp posts, bulbs, and benches are instanced. The scene keeps one
  directional shadow source plus restrained ambient fill and no post-processing.
- Buildings moved beyond the outer curb and rotate toward the road. Car stops
  share each building's radial angle, and short driveways connect the curb to
  the matching rotated foundation.
- The road is one-way: navigation always advances forward around the ring. A
  destination behind the current stop is reached by continuing through the
  city rather than reversing.
- `Shift + wheel` adjusts camera distance between safe limits while normal
  wheel input remains reserved for the guided journey.

## Milestone 6 validation log

Completed on 2026-07-21:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed, 25/25 tests across assets, road clearance, routes,
  deep links, store state, and camera checkpoints.
- `npm run build` — passed with the known Three.js chunk-size warning.
- Asset budget — eight GLBs total 247,620 bytes, below the 3–4 MB initial
  resource budget; all city-authored GLBs are Draco-compressed.
- Browser loading — the branded loading screen remained until the suspended
  model subtree resolved.
- Road layout — every building rendered beyond the outer curb; the car drove
  on the ring and stopped curbside without intersecting a façade.
- One-way travel — selecting a previous angular stop used a positive forward
  trip around the closed route; the car never reversed.
- Foundation alignment — all five building foundations were checked after
  applying each location's configured rotation; the Lab close-up confirmed the
  platform follows the building footprint.
- Camera distance — a native shifted wheel event visibly changed the Lab view
  from a close-up to a complete-city framing while preserving normal scroll.

### Milestone 6 fidelity check

The production render keeps the approved header, hero copy, CTA, dark indigo
backdrop, cream/coral/teal/mustard palette, tabletop silhouette, central plaza,
ring road, coral car, right-side route rail, and bottom instruction family.
The above-the-fold copy gains only the user-requested “Shift + scroll to zoom”
control hint. Production façades, street furniture, curb, crosswalk, local
shadows, and the original sports car replace the former blockout deviations without
changing the accepted composition.

## Milestone 7 decisions

- `src/data/quality.ts` selects `full` or `light` from viewport width,
  coarse-pointer input, hardware concurrency, device memory, and save-data.
  `?quality=full` and `?quality=light` provide deterministic overrides.
- Lightweight mode uses DPR 1, disables antialiasing and dynamic shadows,
  removes the guide and secondary street furniture, keeps four plaza trees,
  and runs car trips at 55% of the full duration.
- The HTML application shell and local Inter font load separately from the lazy
  Three.js canvas chunk, so visitors receive navigation and loading feedback
  before the 3D engine is parsed.
- Contact Station validates a real form. With `VITE_CONTACT_ENDPOINT`, it sends
  a JSON inquiry; without a private endpoint, it copies the full message
  locally and explicitly states that no form data leaves the page.
- `?mode=html` exposes the complete no-WebGL experience intentionally as well
  as serving the automatic fallback path.
- Analytics are intentionally omitted from the first release: the site has no
  consent requirement, tracking dependency, or invented measurement goal.
- Deployment targets the repository's GitHub Pages path and pins the official
  Pages actions used by the current Vite deployment guide.

## Milestone 7 validation log

Pre-deployment validation completed on 2026-07-21:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — passed, 30/30 tests across nine suites.
- `npm run build` — passed; the HTML shell is 67.9 kB gzip and the lazy 3D
  chunk is 263.7 kB gzip. The expected warning is isolated to the deferred
  Three.js chunk rather than the initial shell.
- `npm run build -- --base=/melnyklabs-mini-city/` — passed; HTML, JS, CSS,
  fonts, GLBs, Draco decoders, favicon, and manifest resolve under the Pages
  base. A local production preview loaded the complete model tree.
- Desktop — verified at 1280×720 in Browser/IAB; the platform, navigation,
  hero, route rail, and bottom controls remain in view.
- Mobile — verified at 390×844; `data-quality="light"` was selected and the
  Contact bottom sheet remained inside the viewport with its form scrollable.
- Contact — native field labels and validation were exposed; the fallback
  created the complete inquiry and confirmed it in a polite live region.
- Reduced motion — emulated `reduce`; the car arrived immediately, the guide
  used a static point state, and the destination panel opened after assets.
- HTML fallback — `?mode=html` removed the canvas, exposed all five direct
  location buttons, opened About immediately, and replaced 3D-only help copy.
- Browser console — no application errors; only the upstream Three.js `Clock`
  deprecation warning remains in the development dependency path.
- Original car — the former 1.7 MB third-party model and its attribution were
  removed. The 52 KB Draco-compressed sports coupe is authored entirely by the
  project generator and preserves the existing one-way route behavior.
- Car heading — the original sports car is authored nose-first along local
  `+X`. Removing the legacy imported-model quarter-turn aligns that axis with
  the configured road tangent, so the car no longer travels sideways.

### Milestone 7 fidelity check

The approved concept at `docs/design/melnyklabs-mini-city-concept.png` and the
latest Browser/IAB render were inspected together with `view_image`. Header
brand and navigation order, exact hero copy and CTA, indigo/cream/coral palette,
tabletop silhouette, central monument, ring road, car, right route rail, and
bottom instruction placement remain aligned. The city framing was enlarged,
fog moved farther away, and overlay opacity reduced after comparison so the
diorama regains the reference's visual weight and brightness. The
above-the-fold copy diff contains one intentional user-requested addition:
“Shift + scroll to zoom.” The later approved hover-label reference is recorded
at `docs/design/melnyklabs-hover-labels-reference.png`; its labels are rendered
as accessible-adjacent HTML overlays instead of being baked into WebGL.

Browser/IAB accepted the 1568×1003 emulated CSS viewport, but its native
screenshot surface tiled or clipped the sticky 650svh page at that override.
The stable visual comparison therefore uses the verified 1280×720 browser
capture plus separate 390×844 responsive QA; this is the recorded native-size
capture blocker, not an untested layout.

### Detailed reference pass

Completed on 2026-07-21:

- expanded the overview from five to seven buildings while preserving five
  primary navigation destinations;
- generated `project-district-one.glb` and
  `project-district-two.glb` as original project-owned Blender assets;
- baked readable façade names into the GLBs as mesh geometry while retaining
  all essential copy in semantic HTML;
- repositioned the seven foundations outside the ring road and kept the five
  primary car stops on matching radial approaches;
- added green verge beds, radial road approaches, two crosswalks, a lower
  platform layer, instanced lamps, benches, and non-blocking tree clusters;
- promoted Developer Studio as the back-center landmark, separated Contact
  Station from Service Garage, and tuned all overview-facing angles;
- added a restrained teal Studio frame, warmer key light, darker fill, radial
  indigo background, and a smaller guide character;
- compared the implementation and supplied reference at 1568×1003 in one
  side-by-side image and recorded the final audit in `design-qa.md`.

Final reference-pass validation:

- `npm run lint` — passed;
- `npm run typecheck` — passed;
- `npm test -- --run` — 35/35 tests passed across nine suites;
- `npm run build` — passed;
- `VITE_BASE_PATH=/melnyklabs-mini-city/ npm run build` — passed;
- ten original GLBs total 696,940 bytes, below the 4 MB budget;
- Browser/IAB desktop overview and mobile menu-to-Contact journey passed with
  no application error; the only console warning is the upstream Three.js
  `Clock` deprecation.

The above-the-fold copy diff remains limited to the intentional,
user-requested `Shift + scroll to zoom` hint. The remaining visual difference
from the rendered concept is polish-level mesh granularity rather than missing
composition, identity, or interaction structure.

### Hover-label reference pass

Completed locally on 2026-07-21:

- rearranged the seven buildings into the supplied back-row, side-pair, and
  lower-arc composition;
- moved Contact Station onto the Developer Studio–monument axis, reduced its
  foreground scale, and added the aligned crosswalk;
- moved the guide in front of the monument and regenerated the project-owned
  GLB with a green shirt and low-poly hair;
- added hover-only two-line callouts for all seven buildings with individual
  accent colors, connector lines, edge-safe offsets, and depth-aware scale;
- enlarged the initial wide-screen framing and checked both native 1280×720
  and compact 821×814 browser surfaces;
- inspected the reference and implementation together and recorded the latest
  evidence and closed findings in `design-qa.md`.

Validation passed with lint, TypeScript, 35 tests, the GitHub Pages base-path
production build, seven individual hover-state checks, compact-layout QA, and
no application error in Browser/IAB.

The release was merged through PR #7 as commit
`f782b180242ecb3ff50524df4d2199a7a64dedbb`. GitHub Pages run `29825850834`
completed successfully in 39 seconds. The public URL loaded the production
canvas, dismissed its loading screen, exposed the reference-style hover card,
and logged no application error:
`https://serj-melnyk.github.io/melnyklabs-mini-city/`.
