import type { LocationId } from './locations'

export type PanelLocationId = Exclude<LocationId, 'plaza'>

export type PanelItem = {
  title: string
  description: string
  meta?: string
}

export type PanelContent = {
  eyebrow: string
  introduction: string
  items: PanelItem[]
  nextLocation?: PanelLocationId
  nextLabel?: string
  links?: Array<{
    label: string
    href: string
  }>
}

export const panelContent: Record<PanelLocationId, PanelContent> = {
  about: {
    eyebrow: 'About MelnykLabs',
    introduction:
      'I build thoughtful digital products at the intersection of frontend engineering, product design and playful experimentation.',
    items: [
      {
        title: 'Product-minded frontend',
        description:
          'React, TypeScript, JavaScript, semantic HTML and resilient CSS — shaped around a clear user journey.',
      },
      {
        title: 'From interface to system',
        description:
          'Reusable component architecture, practical backend connections and maintainable delivery workflows.',
      },
      {
        title: 'Curious by default',
        description:
          'AI tools, mobile products and interactive web experiences are where the laboratory side of the studio comes alive.',
      },
    ],
    nextLocation: 'projects',
    nextLabel: 'See selected projects',
  },
  projects: {
    eyebrow: 'Selected work',
    introduction:
      'A compact collection of useful products and game-like ideas. Each project starts with a simple interaction worth making real.',
    items: [
      {
        title: 'Relaxation app',
        description:
          'A calm mobile-first experience for short reset sessions, focused on clarity, pacing and a low-friction routine.',
        meta: 'Mobile product · Wellbeing',
      },
      {
        title: 'Caption Battle',
        description:
          'A Telegram game where players turn shared images into fast rounds of creative caption competition.',
        meta: 'Telegram game · Social play',
      },
      {
        title: 'Hide-and-seek game',
        description:
          'An interactive Telegram concept that turns chat, clues and location-like decisions into a playful group journey.',
        meta: 'Game concept · Interaction design',
      },
    ],
    nextLocation: 'services',
    nextLabel: 'Explore services',
  },
  services: {
    eyebrow: 'Ways to work together',
    introduction:
      'Focused product work for founders and teams who need a clear interface, a strong prototype or an unusual digital experience.',
    items: [
      {
        title: 'Landing pages',
        description: 'Distinctive, responsive pages that communicate one idea quickly and clearly.',
      },
      {
        title: 'React interfaces',
        description: 'Production-ready frontend architecture for web apps, tools and internal products.',
      },
      {
        title: 'UI prototyping',
        description: 'Clickable concepts that make product decisions tangible before heavy development begins.',
      },
      {
        title: 'AI integrations',
        description: 'Useful AI workflows designed around a real job instead of a novelty chatbot.',
      },
      {
        title: 'Interactive web',
        description: 'Story-led WebGL and game-like experiences with an accessible HTML foundation.',
      },
    ],
    nextLocation: 'lab',
    nextLabel: 'Visit the lab',
  },
  lab: {
    eyebrow: 'Experiments in progress',
    introduction:
      'The lab is where unfinished ideas are allowed to stay rough long enough to become interesting.',
    items: [
      {
        title: 'Small software bets',
        description: 'Micro-SaaS concepts, mobile utilities and compact products with one strong purpose.',
      },
      {
        title: 'Playful platforms',
        description: 'Telegram games, social mechanics and lightweight multiplayer experiments.',
      },
      {
        title: 'Creative technology',
        description: 'AI tools, music and YouTube experiments, and new ways to combine code with storytelling.',
      },
    ],
    nextLocation: 'contact',
    nextLabel: 'Go to contact station',
  },
  contact: {
    eyebrow: 'Contact station',
    introduction:
      'Have a product idea, a tricky interface or an experiment that deserves a prototype? Start with a short hello and the problem you want to solve.',
    items: [
      {
        title: 'A useful first message',
        description:
          'Share the goal, current stage and the most important constraint. A perfect brief is not required.',
      },
      {
        title: 'Good fit',
        description:
          'Web products, interactive prototypes, Telegram experiences and practical AI integrations.',
      },
    ],
    links: [
      {
        label: 'Open GitHub profile',
        href: 'https://github.com/Serj-Melnyk',
      },
    ],
  },
}
