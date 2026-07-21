# MelnykLabs Mini City — Design QA

Source visual truth: `docs/design/melnyklabs-mini-city-reference.png`

Implementation evidence:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/melnyklabs-milestone-7-browser.png`

Car-heading evidence:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/melnyklabs-car-heading-fixed.png`

Comparison composite:
`/Users/serhii/.codex/visualizations/2026/07/20/019f8152-211e-7680-aa18-45a660cc8a42/reference-vs-current-city.png`

Viewport: source 1568×1003; implementation 1280×720. Browser/IAB continued
to report a 1280×720 CSS viewport after requesting the source dimensions, and
its Retina screenshot surface cropped the overview at the attempted override.
The stable 1280×720 first viewport is therefore used for the initial backlog.

State: Central Plaza overview. The car-heading fix is additionally checked at
the Developer Studio stop, where the road tangent points toward local `-X`.

## Full-view comparison evidence

The source and implementation were normalized to equal 1280×720 panels and
joined into one side-by-side image before review. The source uses a dense,
nearly edge-to-edge seven-building city with connected sidewalks and a bright
central plaza. The current implementation preserves the correct product story
and interaction frame but has five buildings, larger empty zones, fewer façade
details, and a flatter lighting/material balance.

## Focused comparison evidence

The Developer Studio car-heading capture was inspected separately because the
vehicle is too small to judge precisely in the full overview. Its spoiler sits
at the rear/right and its headlights and nose face left, matching the `-X`
road tangent at the About stop. No additional focused crop is required for the
remaining backlog because the missing building inventory, signs, curb network,
and lighting difference are unambiguous in the full-view composite.

## Findings

- [P1] City inventory and density do not yet match.
  Location: overview scene and `src/data/locations.ts`.
  Evidence: the reference has seven visible buildings, including three
  project façades; the implementation has five primary buildings and one
  project façade.
  Impact: the current city reads as a sparse prototype instead of the complete
  portfolio district shown in the target.
  Fix: add two project façades mapped to the three existing project cards and
  rebalance the city footprint around the ring road.

- [P1] Façade identity and signage are under-specified.
  Location: generated GLBs and building presentation.
  Evidence: the reference has readable district labels and distinct code,
  mountain, beaker, envelope, and wrench identities; the implementation relies
  mostly on color and simplified geometry.
  Impact: visitors cannot identify each building from the overview as quickly
  as the target implies.
  Fix: add crisp decorative façade labels and matching authored sign assets,
  while keeping all essential content duplicated in semantic HTML.

- [P2] Road, curb, and public-space rhythm is too simple.
  Location: `src/world/CityGround.tsx` and `src/world/CityDetails.tsx`.
  Evidence: the reference has connected corner sidewalks, multiple
  crosswalks, planters, planted verges, lamps, and a layered plaza; the
  implementation uses a broad ring and fewer connecting surfaces.
  Impact: the scene lacks the crafted tabletop density of the reference.
  Fix: author the visible sidewalk network, curb islands, crosswalks, and prop
  clusters as reusable low-poly modules.

- [P2] Overview lighting and material separation are flatter than the target.
  Location: `src/scene/Lighting.tsx` and generated asset materials.
  Evidence: the reference has warmer key light, clearer ambient occlusion, and
  stronger light/dark separation on façades; the implementation is cooler and
  more uniformly lit.
  Impact: building silhouettes and depth cues are weaker.
  Fix: tune warm key/fill balance, restrained AO/contact shadow, and material
  roughness/contrast without adding glossy realism or heavy effects.

- [P2] First-viewport city scale and framing require another camera pass.
  Location: overview checkpoint in `src/data/cameraRoute.ts`.
  Evidence: the reference city occupies most of the center frame while
  preserving hero and navigation space; the stable implementation capture
  leaves more negative space and gives the city less visual weight.
  Impact: the city is not yet the dominant first-view product signal.
  Fix: tune the overview position/target after the seven-building layout is
  complete, then recheck 1568×1003, 1280×720, and 390×844.

## Required fidelity surfaces

- Fonts and typography: Inter, cream text, bold two-line hero, navigation
  hierarchy, and CTA copy match the reference family. The implementation hero
  is slightly larger relative to the city; reassess after camera/layout work.
- Spacing and layout rhythm: header, hero, route rail, and bottom hint use the
  correct regions, but the 3D city is less dense and occupies less of the frame.
- Colors and visual tokens: indigo, cream, coral, teal, mustard, and lavender
  are aligned; lighting temperature and façade contrast remain actionable.
- Image quality and asset fidelity: GLBs are sharp, original, and lightweight,
  but two buildings, detailed signage, and much of the curb/prop language are
  missing compared with the source.
- Copy and content: above-the-fold navigation, headline, supporting copy, and
  CTA match. The only intentional addition is `Shift + scroll to zoom` in the
  bottom instruction.
- Icons: current authored signs are simplified; the reference's five distinct
  façade symbols and text labels remain to be matched.
- Interaction/accessibility: navigation, panels, car, reduced motion, and HTML
  fallback remain functional and should be preserved through the visual pass.

## Comparison history

### Pass 1 — 2026-07-21

Earlier functional issue: the new sports car inherited a `+90°` child rotation
from the former third-party model and travelled sideways.

Fix made: removed the child quarter-turn in `NavigationCar.tsx`; the generated
car's local `+X` nose now follows `sampleCarRoute().rotationY` directly. Added a
route contract test for that heading axis and inspected the revised About-stop
capture.

Post-fix evidence: the car is nose-first at Developer Studio and the browser
console has no application error. The broader reference findings above remain
open for the next production-asset pass.

## Implementation checklist

1. Add the two missing project façades and associated click targets.
2. Add building labels and authored symbols.
3. Build connected sidewalks, crosswalks, and planted curb modules.
4. Tune city composition, camera, and lighting.
5. Repeat same-state desktop/mobile capture and design QA.

## Follow-up polish

- Refine wheel rotation and subtle suspension only after composition fidelity.
- Add small roof HVAC and mailbox/planter variations where they support the
  reference without exceeding the performance budget.

final result: blocked
