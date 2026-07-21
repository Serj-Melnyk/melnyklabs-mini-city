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
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  carStop: [number, number, number]
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
    cameraPosition: [12.4, 12.4, 16.4],
    cameraTarget: [0, -0.25, 0],
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
    position: [0, 1.5, -7],
    size: [3.2, 3, 2.4],
    rotationY: 0,
    cameraPosition: [7.2, 6.6, 3.4],
    cameraTarget: [0, 1, -7],
    carStop: [0, 0.38, -4.7],
  },
  {
    id: 'projects',
    navLabel: 'Projects',
    title: 'Project District',
    shortTitle: 'Projects',
    description: 'Selected apps, Telegram games and experiments built to be used.',
    action: 'View projects',
    color: '#e4ad52',
    position: [6.3, 1.15, -3.3],
    size: [2.8, 2.3, 2.4],
    rotationY: -1.088,
    cameraPosition: [13.5, 7, 4.5],
    cameraTarget: [6.3, 1, -3.3],
    carStop: [4.16, 0.38, -2.18],
  },
  {
    id: 'services',
    navLabel: 'Services',
    title: 'Service Garage',
    shortTitle: 'Services',
    description: 'Landing pages, React interfaces, UI prototypes and AI integrations.',
    action: 'See services',
    color: '#8f91ad',
    position: [6.2, 1, 4],
    size: [3, 2, 2.4],
    rotationY: -2.144,
    cameraPosition: [13.4, 7.1, 11.8],
    cameraTarget: [6.2, 0.8, 4],
    carStop: [3.95, 0.38, 2.55],
  },
  {
    id: 'lab',
    navLabel: 'Lab',
    title: 'Innovation Lab',
    shortTitle: 'Lab',
    description: 'A home for AI tools, micro-SaaS ideas and unfinished concepts.',
    action: 'Enter the lab',
    color: '#70bcb5',
    position: [-6.2, 0.85, 4],
    size: [3.4, 1.7, 2.4],
    rotationY: 2.144,
    cameraPosition: [-12.2, 7.6, 12.5],
    cameraTarget: [-6.2, 0.7, 4],
    carStop: [-3.95, 0.38, 2.55],
  },
  {
    id: 'contact',
    navLabel: 'Contact',
    title: 'Contact Station',
    shortTitle: 'Contact',
    description: 'The final stop for project ideas, collaborations and hello messages.',
    action: 'Start a conversation',
    color: '#f2866e',
    position: [-6.3, 1.1, -3.3],
    size: [2.8, 2.2, 2.4],
    rotationY: 1.088,
    cameraPosition: [-13.2, 7.1, 4.4],
    cameraTarget: [-6.3, 0.8, -3.3],
    carStop: [-4.16, 0.38, -2.18],
  },
]

export const visibleLocations = locations.filter(({ id }) => id !== 'plaza')

export function getLocation(id: LocationId) {
  return locations.find((location) => location.id === id) ?? locations[0]
}
