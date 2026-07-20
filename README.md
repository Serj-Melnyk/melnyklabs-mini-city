# MelnykLabs Mini City

An interactive low-poly 3D portfolio presented as a small tabletop city. The
project is being delivered milestone by milestone; the current version is the
validated city blockout and accessible HTML shell.

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

Milestone 1 includes the React/Vite foundation, a React Three Fiber canvas,
primitive city blockout, lighting, HTML navigation, loading UI, responsive
layouts, reduced-motion support, and a WebGL fallback. Detailed models, camera
route animation, the taxi journey, and character animation belong to later
milestones.
