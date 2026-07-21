# MelnykLabs Mini City

An interactive low-poly 3D portfolio presented as a small tabletop city. The
production scene includes seven portfolio buildings, a central plaza, a one-way
navigation car, a guide character, guided camera travel, accessible HTML
content, a contact workflow, and an automatic lightweight mode.

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

The GitHub Pages build uses the repository base path:

```bash
npm run build -- --base=/melnyklabs-mini-city/
```

## Controls

- Scroll or swipe to follow the guided city route.
- Move the pointer for a small constrained look adjustment.
- Click a building, the car, the guide, or any HTML navigation control.
- Hold Shift while scrolling to change the camera distance.
- Add `?quality=light` or `?quality=full` to override automatic quality.
- Add `?mode=html` to use the complete non-WebGL experience.

## Production assets

City GLBs are reproducibly generated with Blender 3.6 LTS:

```bash
npm run assets:generate
```

The authored models use Draco compression and local decoder files. Repeated
trees, lamps, and benches are instanced. The original low-poly MelnykLabs
sports car is generated from project-owned primitive geometry alongside the
city assets, so it has no external model or attribution dependency.

![Original MelnykLabs low-poly sports car](docs/design/melnyklabs-sports-car-preview.png)

## Contact workflow

Without configuration, Contact Station validates the form and copies a
portable inquiry locally without transmitting visitor data. To send through a
private form service, expose a JSON POST endpoint at build time:

```bash
VITE_CONTACT_ENDPOINT=https://your-private-endpoint.example npm run build
```

The endpoint receives `name`, `email`, `projectType`, `message`, and `source`.

## Documentation

- [Product concept](docs/PRODUCT_CONCEPT.md)
- [Living implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Design system](docs/DESIGN_SYSTEM.md)

## Deployment

`.github/workflows/deploy-pages.yml` validates and deploys `main` to GitHub
Pages. The expected public URL is
`https://serj-melnyk.github.io/melnyklabs-mini-city/`.
