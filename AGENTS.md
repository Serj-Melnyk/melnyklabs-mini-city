# MelnykLabs Mini City — Codex Instructions

## Project goal

Build an interactive low-poly 3D portfolio website presented as a toy city.

## Required documentation

Before making changes, read:

- `docs/PRODUCT_CONCEPT.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DESIGN_SYSTEM.md`

Treat `docs/IMPLEMENTATION_PLAN.md` as the living execution plan.

## Working rules

- Implement one milestone at a time.
- Update the implementation plan after completing a milestone.
- Do not start with detailed Blender assets. Build and validate the city blockout first.
- Preserve normal HTML navigation and accessible content.
- Keep 3D objects modular and configurable.
- Do not hardcode camera locations inside components; store them in data files.
- Optimize for desktop and mobile.
- Support `prefers-reduced-motion` and a fallback when WebGL is unavailable.

## Technology

Use React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Zustand, and GSAP.
Use the package manager already configured in the repository.

## Quality checks

Before marking a milestone complete, run linting, TypeScript checks, tests when
available, and the production build. Verify desktop and mobile layouts in a
browser. Do not report completion while build or type errors remain.
