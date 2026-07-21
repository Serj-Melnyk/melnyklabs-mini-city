# MelnykLabs Mini City — Design QA

Source visual truth: `docs/design/melnyklabs-mini-city-reference.png`

Final desktop evidence:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/melnyklabs-seven-building-neutral.png`

Final same-size comparison:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/reference-vs-seven-building-final.png`

Focused lighting and Studio-frame evidence:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/melnyklabs-reference-pass-final.jpg`

State: Central Plaza overview with `quality=full`.

Viewport: source and stable implementation captures are both 1568×1003. The
in-app browser accepted a 390×844 mobile emulation for CSS and DOM checks, but
its screenshot surface returned a compressed 390×249 frame. Mobile layout was
therefore verified through semantic DOM, menu interaction, Contact navigation,
and absence of application errors; the native-height screenshot mismatch is a
capture-surface limitation.

## Full-view comparison

The source and implementation were joined at their native 1568×1003 size and
inspected together. The implementation now follows the same seven-building
tabletop composition: three project districts, Developer Studio as the back
center landmark, Innovation Lab at lower left, Service Garage at right,
Contact Station at lower right, and a circular public plaza in the middle.

## Comparison points

| Surface | Result |
| --- | --- |
| Building inventory and hierarchy | Seven visible buildings now match the reference story and relative district hierarchy. |
| Façade identity | Every building has authored mesh lettering; code, project, lab, contact, and garage geometry remain readable without carrying essential content. |
| Roads and public space | Ring road, radial approaches, rotated foundations, green verge beds, two crosswalks, layered platform, lamps, benches, and trees reproduce the tabletop rhythm. |
| Lighting and materials | Warm directional light, darker fill, local shadows, matte materials, and a radial indigo background improve the reference's light/dark separation. |
| Header and hero | Brand, navigation order, exact heading, support copy, and CTA preserve the source hierarchy and placement family. |
| Vehicle and guide | The original coral sports car follows the road nose-first; the smaller authored guide sits inside the safe plaza. |
| Interaction | Menu, route rail, building clicks, one-way car travel, panels, contact form, reduced motion, and HTML fallback remain functional. |

## Closed findings

- [x] Added the two missing Project District GLBs and integrated a complete
  seven-building layout.
- [x] Added crisp façade names as Blender-generated mesh geometry and retained
  semantic equivalents in HTML.
- [x] Added connected approaches, rotated foundations, green verge modules,
  crosswalks, street furniture, and a layered platform base.
- [x] Tuned overview camera, building-facing angles, warmer light, background
  depth, hero scale, and landmark hierarchy against the source capture.
- [x] Removed the legacy car quarter-turn so the sports car travels nose-first.
- [x] Kept every building beyond the outer curb and every primary car stop on
  the configured one-way circular route.

## Intentional deviations

- The source is a rendered concept image; production uses original,
  reproducible low-poly GLBs rather than attempting to copy its exact meshes.
- Essential portfolio content remains semantic HTML instead of being baked
  exclusively into WebGL.
- The production UI includes the user-requested `Shift + scroll to zoom` hint,
  a working contact form, reduced-motion behavior, and WebGL fallback that are
  not visible in the static reference.
- The remaining difference is polish-level asset granularity (for example
  roof HVAC variations and more planted curb islands), not missing layout,
  identity, navigation, or interaction structure.

## Validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — 34/34 passed across nine suites.
- `npm run build` — passed.
- `VITE_BASE_PATH=/melnyklabs-mini-city/ npm run build` — passed.
- Ten project-owned GLBs total 696,940 bytes, below the 4 MB budget.
- Desktop Browser/IAB — full scene, header, hero, route rail, car, and props
  verified with no application error.
- Mobile Browser/IAB — menu opened, exact Contact navigation reached
  `#contact`, Contact Station content appeared, and no application error was
  logged.
- The only console warning is the upstream Three.js `Clock` deprecation in the
  development dependency path.

## Follow-up polish

- Add small roof and curb-island variations only if they do not compromise the
  current payload and mobile clarity.
- Replace the development-only upstream `Clock` warning when React Three Fiber
  updates its dependency path.

final result: passed
