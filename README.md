# MelnykLabs Mini City

An interactive low-poly 3D portfolio presented as a small tabletop city. The
project is being delivered milestone by milestone; the current version has a
validated city blockout, guided camera route, reusable object interactions,
complete content panels, direct links, and a working navigation car.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Documentation

- [Product concept](docs/PRODUCT_CONCEPT.md)
- [Living implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Design system](docs/DESIGN_SYSTEM.md)

## Current scope

Milestones 1–4 include the React/Vite foundation, React Three Fiber canvas,
primitive city blockout, lighting, HTML navigation, loading UI, responsive
layouts, WebGL fallback, scroll/swipe camera route, menu-driven checkpoints,
constrained pointer look, reduced-motion behavior, shared hover/focus/click
interactions, responsive content panels, and URL hash deep links. Detailed
models and character animation belong to later milestones. The navigation car
now follows a configured ring road, accepts direct clicks, drives to menu
destinations, exposes accessible status, and supports reduced motion.
