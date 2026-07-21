# MelnykLabs Mini City — Product Concept

## Product idea

MelnykLabs Mini City is an interactive portfolio presented as a high-quality
tabletop city diorama. Visitors follow a guided route through the city instead
of navigating a free-roaming game. The site must always remain understandable,
fast, accessible, and useful even when its 3D layer is unavailable.

The primary interactions are:

- scroll or swipe to move along a predefined camera route;
- small pointer-driven changes to the viewing angle;
- hover or focus to highlight interactive objects;
- click a building to focus it and open an HTML information panel;
- use a small car as an optional visual navigation device;
- interact with a guide character for short orientation cues;
- use the persistent HTML menu at any time.

## City map

```text
                    Developer Studio
                           │
        Innovation Lab ─ Central Plaza ─ Project District
                │          │              │
        Service Garage ─ Road / Taxi ─ Contact Station
```

A ring road connects the core locations. Central Plaza is the entry point and
contains the MelnykLabs identity, short introduction, city map, helper
character, and primary “Explore the city” action.

## Locations and objects

1. **Central Plaza** — starting point and orientation.
2. **Developer Studio / About** — profile, frontend focus, React, JavaScript,
   HTML, CSS, backend interests, AI, mobile, and interactive products.
3. **Project District** — three initial projects: a relaxation app, Telegram
   Caption Battle, and a Telegram hide-and-seek game.
4. **Service Garage** — landing pages, React interfaces, UI prototypes, AI
   integrations, and interactive web experiences.
5. **Innovation Lab** — micro-SaaS, mobile apps, Telegram games, AI tools,
   music/YouTube work, and unfinished experiments.
6. **Navigation car** — offers About, Projects, Services, Lab, and Contact;
   later it will travel to the chosen stop while the camera follows.
7. **Contact Station** — contact form and links to GitHub, LinkedIn, and
   Telegram.
8. **Guide character** — idle, walk, and point states; never the only form of
   navigation.

## Guided journey

1. A branded loading screen says “Building the city…”.
2. The intro camera descends toward Central Plaza.
3. The user explores with scrolling, object clicks, or the HTML menu.
4. Information appears in a right-side HTML panel on desktop and a bottom
   sheet on mobile.
5. The route concludes at Contact Station.

Planned camera checkpoints:

| Progress | Stop |
| ---: | --- |
| 0% | Central Plaza |
| 15% | Developer Studio |
| 35% | Project District |
| 55% | Service Garage |
| 72% | Innovation Lab |
| 88% | Contact Station |
| 100% | City overview |

Pointer look is constrained to roughly ±12° horizontally and ±6° vertically.

## Overlay interface

The persistent navigation is `MelnykLabs · About · Projects · Services · Lab ·
Contact`. Content, actions, forms, and critical instructions are normal HTML,
not textures or text embedded in WebGL.

The desktop information panel opens at the right edge. On phones it becomes a
bottom sheet. Both versions have a title, description, content, action, and
close button.

## Visual direction

- stylized low-poly toy diorama;
- soft, slightly exaggerated geometric forms;
- clean modern architecture with minimal small detail;
- matte materials, soft daylight, ambient fill, and one primary shadow;
- restrained indigo, warm cream, coral, teal, mustard, and lavender palette;
- no glossy realism, heavy reflections, or visual-effect overload.

The approved Milestone 1 visual reference is
[`docs/design/melnyklabs-mini-city-concept.png`](design/melnyklabs-mini-city-concept.png).
The detailed production target supplied on 2026-07-21 is
[`docs/design/melnyklabs-mini-city-reference.png`](design/melnyklabs-mini-city-reference.png).
It is the source of truth for the final city density, building inventory,
façade signage, street detail, lighting balance, and first-viewport framing.
The approved interaction-state reference is
[`docs/design/melnyklabs-hover-labels-reference.png`](design/melnyklabs-hover-labels-reference.png).
It adds compact two-line callouts above hovered buildings and retains the
original MelnykLabs guide character as part of the final city scene.

## Mobile and quality strategy

Mobile uses a lower pixel ratio, limited shadows, fewer decorations, shorter
car routes, vertical swipe navigation, and bottom sheets. A future lightweight
mode will disable characters, particles, and complex shadows while retaining
the city and all HTML content.

## Accessibility and fallback

- persistent keyboard-accessible HTML navigation;
- visible focus states and semantic controls;
- `prefers-reduced-motion` support;
- skip/avoid decorative intro motion when reduced motion is requested;
- informative HTML fallback when WebGL cannot initialize;
- no essential information available only through a 3D object.

## Technical budgets for the MVP

- initial 3D resources: 3–4 MB maximum;
- total models: 8–10 MB maximum;
- mostly 512–1024 px textures;
- one primary directional light;
- desktop DPR capped at 1.5 and mobile at 1;
- no React state updates inside a continuous frame loop;
- reuse geometry/materials and instance repeated objects;
- render on demand whenever the scene is static.

## MVP definition of done

The first public MVP will include the plaza, five primary buildings, ring road,
one car, one character, three project cards, one contact form, guided camera
navigation, seven interactive objects, responsive/lightweight modes, content
fallback, and a deployed production build.
