# MelnykLabs Mini City — Design System

## Visual reference

The source of truth for the first viewport is
[`melnyklabs-mini-city-concept.png`](design/melnyklabs-mini-city-concept.png),
generated as a desktop 16:10 concept before implementation.

The detailed production reference is
[`melnyklabs-mini-city-reference.png`](design/melnyklabs-mini-city-reference.png).
Use it for the final city composition and asset-detail pass while preserving
the accessible HTML interaction model established by the product concept.

The building interaction-state reference is
[`melnyklabs-hover-labels-reference.png`](design/melnyklabs-hover-labels-reference.png).
On pointer hover, each building shows a dark two-line HTML callout with its
own accent border and a short connector line. The label remains crisp, does
not intercept pointer input, and identifies only the hovered building. Its
screen size is fixed rather than changing with camera distance, and it is
hidden while the matching information panel is open.

## Design principles

1. The city is the focal point; interface chrome stays quiet.
2. The scene feels like a crafted tabletop object, not a realistic game.
3. Real text and controls remain crisp, semantic HTML overlays.
4. Color communicates location and interaction without neon effects.
5. Motion is gentle, purposeful, and optional.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ink-950` | `#07142b` | page and scene backdrop |
| `--ink-900` | `#0d1c38` | elevated backdrop |
| `--cream-100` | `#fff0d3` | primary text |
| `--cream-200` | `#e7d8bd` | secondary text |
| `--coral-500` | `#f26b4f` | primary action, active stop |
| `--coral-300` | `#ff9a7f` | hover highlight |
| `--mint-400` | `#6ed8c5` | Developer Studio accent |
| `--mustard-400` | `#e4ad52` | Projects accent |
| `--lavender-500` | `#676886` | roads and foundations |
| `--shadow` | `rgba(0, 0, 0, .3)` | city depth and overlay separation |

## Typography

The UI uses `Inter`, falling back to system sans-serif. Headline copy is bold,
tightly tracked, and editorial; navigation/control text is smaller and
deliberate. The responsive headline uses `clamp(2.25rem, 4.5vw, 5rem)` with a
line-height near `0.95`.

## Layout

- full-viewport WebGL canvas;
- transparent navigation across the top safe area;
- hero copy at bottom-left with no enclosing card;
- route rail at the right edge on large screens;
- interaction hint centered near the bottom;
- information panel on the right, changing to a bottom sheet below 720 px.

## Components

- **Navigation:** brand, desktop links, mobile menu button, strong focus rings.
- **Hero copy:** headline, supporting copy, coral primary action.
- **Route rail:** one understated button per configured city location.
- **Info panel:** translucent dark surface, plain HTML content, close action.
- **Loading screen:** branded indigo surface and a short progress line.
- **WebGL fallback:** same information hierarchy, with direct location links.

## 3D materials and lighting

Use matte materials with low metalness and restrained roughness variation.
Lighting consists of hemisphere/ambient fill and one warm directional key.
Shadows are soft and limited. Do not introduce detailed textures, particles,
bloom, depth of field, or complex reflections in the blockout milestone.

## Responsive and motion rules

- Desktop DPR is capped at 1.5; compact/touch devices use DPR 1.
- Maintain at least 44×44 px touch targets.
- Avoid text overlap with the city at short viewport heights.
- Under `prefers-reduced-motion`, remove transitions and skip timed loading
  flourishes; later camera travel should become immediate location changes.
