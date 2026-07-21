# MelnykLabs Mini City — Design QA

Source visual truth:
`docs/design/melnyklabs-hover-labels-reference.png`

Final desktop overview evidence:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/melnyklabs-final-reference-aligned-1280x720.png`

Final desktop hover evidence:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/melnyklabs-final-developer-hover-1280x720.png`

Final compact evidence:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/melnyklabs-final-compact-821x814.png`

Final compact hover evidence:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/melnyklabs-final-compact-developer-hover-821x814.png`

State: Central Plaza overview with `quality=full`, plus the Developer Studio
hover state. The supplied source is a fixed 1536×1024 render; the selected
in-app browser supplied native 1280×720 and 821×814 viewports. The source and
browser captures were inspected together at original resolution rather than
distorting the reference to a different aspect ratio.

## Reference comparison

The implementation now follows the reference's concrete layout:

- Project District 1, Developer Studio, and Project District 3 form the back
  row;
- Project District 2 and Service Garage balance the left and right edges;
- Innovation Lab and Contact Station complete the lower arc;
- Developer Studio, the monument, the guide, and Contact Station share the
  main vertical axis;
- the guide stands in front of the monument in a green shirt with visible hair;
- the original sports car remains on the circular road;
- labels appear only over the building currently under the pointer.

## Comparison points

| Surface | Result |
| --- | --- |
| Building inventory | Seven buildings are visible and distributed around the ring without occupying the car lane. |
| Reference hierarchy | Developer Studio is the back-center landmark; Contact Station is smaller and centered on the lower axis. |
| Hover labels | All seven buildings expose a dark two-line card, colored outline, glow, and connector matching the reference language. |
| Edge safety | Desktop and compact label positions were checked; left, right, and top cards remain inside the viewport. |
| Character | The project-owned guide asset now uses the reference's green shirt, dark trousers, skin tone, and low-poly hair instead of the former mustard jacket and visor. |
| Camera | Wide screens start closer to the diorama so the city carries similar visual weight to the supplied render. |
| Interaction | Navigation, one-way car travel, camera look, zoom, content panels, contact form, reduced motion, and HTML fallback remain intact. |

## Closed findings

- [x] Replaced the earlier uneven arrangement with the reference's back-row,
  side-pair, and lower-arc composition.
- [x] Moved Contact Station onto the Developer–monument axis and added its
  aligned pedestrian crossing.
- [x] Reduced Contact Station's model scale so it no longer dominates the
  lower foreground.
- [x] Moved the guide into the visible center-front position and regenerated
  the original GLB with reference-aligned colors and hair.
- [x] Added hover-only callouts for all seven buildings, including responsive
  offsets and per-building scale where depth required it.
- [x] Increased the wide-screen visual weight of the city and verified the
  compact menu layout at 821×814.

## Intentional deviations

- The source is a rendered concept; production keeps reproducible, original
  low-poly GLBs instead of copying the exact meshes or textures.
- The seventh building is retained at the owner's request and integrated as
  the Innovation Lab in the lower-left arc.
- Essential portfolio content remains semantic HTML rather than being baked
  exclusively into WebGL.
- The hero copy, working form, route rail, reduced-motion behavior, WebGL
  fallback, and `Shift + scroll to zoom` hint remain functional production
  additions beyond the static reference.

## Validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — 35/35 passed across nine suites.
- `VITE_BASE_PATH=/melnyklabs-mini-city/ npm run build` — passed.
- Browser/IAB desktop — final overview and Developer Studio hover checked.
- Browser/IAB compact 821×814 — city, menu layout, character, and hover card
  checked.
- All seven hover labels were exercised individually and their client bounds
  inspected.
- No application error was logged. The only console warning is the upstream
  Three.js `Clock` deprecation in the development dependency path.

## Compact callout regression QA

Source defect evidence:
`/Users/serhii/Desktop/Знімок екрана 2026-07-21 о 13.45.02.png`

Post-fix implementation evidence:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/melnyklabs-compact-contact-callout-1280x720.png`

Viewport and state: the source is a browser-framed close Contact Station view
with its panel open; the selected IAB surface supplied a native 1280×720
close Contact Station view. The focused callout regions were inspected
together. The post-fix card was also measured directly in the browser.

**Findings and comparison history**

- [P1 closed] The original callout inherited camera-distance scaling and grew
  to cover most of the scene. The fix removes `distanceFactor`; the same
  Contact callout now remains 220×56.7 px at the close camera.
- [P2 closed] The callout duplicated the title and summary while the Contact
  information panel was open. The fix suppresses the matching callout whenever
  that panel is open; pointer highlighting remains active.
- No actionable P0/P1/P2 finding remains.

**Required fidelity surfaces**

- Typography: Inter, uppercase title hierarchy, weight, and copy are retained
  at a smaller `.78rem`/`.68rem` desktop scale.
- Spacing and layout rhythm: width, padding, radius, connector, and shadow are
  reduced to the compact proportions visible in the supplied concept family.
- Colors and tokens: the existing ink background, cream copy, and per-location
  accent border remain unchanged.
- Image and asset fidelity: no 3D model, texture, crop, or lighting asset was
  changed by this UI-only correction.
- Copy and content: every location title and description remains unchanged;
  duplicate visible content is removed only while the full panel is open.

**Validation**

- Contact hover with panel closed: 220×56.7 px and inside the 1280×720 viewport.
- Contact hover with panel open: no `.building-callout` rendered.
- Lint, TypeScript, 35/35 tests, and GitHub Pages base-path build passed.
- Browser console: no application error; only the known upstream Three.js
  `Clock` deprecation warning.

final result: passed
