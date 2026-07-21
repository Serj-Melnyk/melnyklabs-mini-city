export type LocationId =
  | 'plaza'
  | 'about'
  | 'projects'
  | 'services'
  | 'lab'
  | 'contact'

export type CityLocation = {
  id: LocationId
  navLabel: string
  title: string
  shortTitle: string
  description: string
  action: string
  color: string
  position: [number, number, number]
  size: [number, number, number]
  rotationY: number
  modelScale?: number
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  carStop: [number, number, number]
  callout?: {
    title: string
    description: string
    position: [number, number, number]
    compactPosition?: [number, number, number]
    accent?: string
    distanceFactor?: number
  }
}

export const locations: CityLocation[] = [
  {
    id: 'plaza',
    navLabel: 'Home',
    title: 'Central Plaza',
    shortTitle: 'Plaza',
    description: 'The starting point for a small city of selected work and ideas.',
    action: 'Explore the city',
    color: '#f4c97b',
    position: [0, 0.35, 0],
    size: [2.3, 2.6, 2.3],
    rotationY: 0,
    cameraPosition: [8.5, 14.6, 22],
    cameraTarget: [0, -1.1, 0],
    carStop: [0, 0.38, 4.7],
  },
  {
    id: 'about',
    navLabel: 'About',
    title: 'Developer Studio',
    shortTitle: 'Studio',
    description: 'Frontend development, React, AI and interactive product work.',
    action: 'About me',
    color: '#6ed8c5',
    position: [-2.8, 1.8, -7],
    size: [3.2, 3.6, 2.4],
    rotationY: 0.37,
    cameraPosition: [7.2, 6.6, 3.4],
    cameraTarget: [-2.8, 1.35, -7],
    carStop: [-1.75, 0.38, -4.36],
    callout: {
      title: 'Developer Studio',
      description: 'Build. Code. Innovate.',
      position: [0, 2.2, 0],
    },
  },
  {
    id: 'projects',
    navLabel: 'Projects',
    title: 'Project District',
    shortTitle: 'Projects',
    description: 'Selected apps, Telegram games and experiments built to be used.',
    action: 'View projects',
    color: '#e4ad52',
    position: [5.6, 1.15, -4.2],
    size: [2.8, 2.3, 2.4],
    rotationY: 0.11,
    cameraPosition: [12.7, 7, 2.6],
    cameraTarget: [5.6, 1, -4.2],
    carStop: [3.76, 0.38, -2.82],
    callout: {
      title: 'Project District 3',
      description: 'Plan. Design. Deliver.',
      position: [0.15, 2.55, 0],
      compactPosition: [-1.25, 2.55, 0],
    },
  },
  {
    id: 'services',
    navLabel: 'Services',
    title: 'Service Garage',
    shortTitle: 'Services',
    description: 'Landing pages, React interfaces, UI prototypes and AI integrations.',
    action: 'See services',
    color: '#8f91ad',
    position: [8, 1, 1.2],
    size: [3, 2, 2.4],
    rotationY: 0.03,
    cameraPosition: [13.5, 7.1, 9.8],
    cameraTarget: [8, 0.8, 1.2],
    carStop: [4.65, 0.38, 0.7],
    callout: {
      title: 'Service Garage',
      description: 'Support. Maintain. Improve.',
      position: [0.2, 2.25, 0],
      compactPosition: [-1.4, 2.25, 0],
    },
  },
  {
    id: 'lab',
    navLabel: 'Lab',
    title: 'Innovation Lab',
    shortTitle: 'Lab',
    description: 'A home for AI tools, micro-SaaS ideas and unfinished concepts.',
    action: 'Enter the lab',
    color: '#70bcb5',
    position: [-3.8, 0.85, 6.3],
    size: [3.4, 1.7, 2.4],
    rotationY: 0.65,
    cameraPosition: [-11.2, 7.6, 13],
    cameraTarget: [-3.8, 0.7, 6.3],
    carStop: [-2.43, 0.38, 4.02],
    callout: {
      title: 'Innovation Lab',
      description: 'Experiment. Learn. Ship.',
      position: [-0.2, 2.05, 0],
      compactPosition: [1.4, 2.05, 0],
      distanceFactor: 12,
    },
  },
  {
    id: 'contact',
    navLabel: 'Contact',
    title: 'Contact Station',
    shortTitle: 'Contact',
    description: 'The final stop for project ideas, collaborations and hello messages.',
    action: 'Start a conversation',
    color: '#f2866e',
    position: [4.2, 1.1, 6.65],
    size: [2.8, 2.2, 2.4],
    rotationY: 0.14,
    modelScale: 0.8,
    cameraPosition: [9.7, 7.1, 14],
    cameraTarget: [4.2, 0.8, 6.65],
    carStop: [2.51, 0.38, 3.97],
    callout: {
      title: 'Contact Station',
      description: "Let's connect.",
      position: [0, 2.4, 0],
      accent: '#8f91d8',
      distanceFactor: 10,
    },
  },
]

export const visibleLocations = locations.filter(({ id }) => id !== 'plaza')

const projectsLocation = locations.find(({ id }) => id === 'projects')!

export const supplementalBuildings: CityLocation[] = [
  {
    ...projectsLocation,
    title: 'Project District 1',
    shortTitle: 'Project 1',
    position: [-7, 1.4, -4.1],
    size: [3, 2.8, 2.4],
    rotationY: 0.52,
    callout: {
      title: 'Project District 1',
      description: 'Ideas take shape.',
      position: [-0.15, 2.65, 0],
      accent: '#f28a43',
    },
  },
  {
    ...projectsLocation,
    title: 'Project District 2',
    shortTitle: 'Project 2',
    position: [-8, 1, 0.5],
    size: [2.8, 2, 2.4],
    rotationY: 0.64,
    callout: {
      title: 'Project District 2',
      description: 'Explore. Prototype. Test.',
      position: [-0.2, 2.25, 0],
      compactPosition: [1.6, 2.25, 0],
      accent: '#6ed8c5',
    },
  },
]

export const buildingLocations = [...visibleLocations, ...supplementalBuildings]

export function getLocation(id: LocationId) {
  return locations.find((location) => location.id === id) ?? locations[0]
}
