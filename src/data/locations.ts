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
    size: [1.15, 0.7, 1.15],
    cameraPosition: [13, 13, 17],
    cameraTarget: [0, 0, 0],
    carStop: [0, 0.35, 4.5],
  },
  {
    id: 'about',
    navLabel: 'About',
    title: 'Developer Studio',
    shortTitle: 'Studio',
    description: 'Frontend development, React, AI and interactive product work.',
    action: 'About me',
    color: '#6ed8c5',
    position: [0, 1.5, -4.6],
    size: [3.2, 3, 2.4],
    cameraPosition: [7, 6.6, 6],
    cameraTarget: [0, 1, -4.6],
    carStop: [2.3, 0.3, -3.3],
  },
  {
    id: 'projects',
    navLabel: 'Projects',
    title: 'Project District',
    shortTitle: 'Projects',
    description: 'Selected apps, Telegram games and experiments built to be used.',
    action: 'View projects',
    color: '#e4ad52',
    position: [5, 1.15, -1.8],
    size: [2.8, 2.3, 2.4],
    cameraPosition: [12.5, 7, 6.9],
    cameraTarget: [5, 1, -1.8],
    carStop: [3.8, 0.3, 1],
  },
  {
    id: 'services',
    navLabel: 'Services',
    title: 'Service Garage',
    shortTitle: 'Services',
    description: 'Landing pages, React interfaces, UI prototypes and AI integrations.',
    action: 'See services',
    color: '#8f91ad',
    position: [5.2, 1, 3.8],
    size: [3, 2, 2.4],
    cameraPosition: [12.4, 7.1, 11.6],
    cameraTarget: [5.2, 0.8, 3.8],
    carStop: [2.6, 0.3, 4.5],
  },
  {
    id: 'lab',
    navLabel: 'Lab',
    title: 'Innovation Lab',
    shortTitle: 'Lab',
    description: 'A home for AI tools, micro-SaaS ideas and unfinished concepts.',
    action: 'Enter the lab',
    color: '#70bcb5',
    position: [-4.8, 0.85, 3.5],
    size: [3.4, 1.7, 2.4],
    cameraPosition: [-9.9, 7.6, 12.3],
    cameraTarget: [-4.8, 0.7, 3.5],
    carStop: [-2.4, 0.3, 4.5],
  },
  {
    id: 'contact',
    navLabel: 'Contact',
    title: 'Contact Station',
    shortTitle: 'Contact',
    description: 'The final stop for project ideas, collaborations and hello messages.',
    action: 'Start a conversation',
    color: '#f2866e',
    position: [-5, 1.1, -2.3],
    size: [2.8, 2.2, 2.4],
    cameraPosition: [-11, 7.1, 5.7],
    cameraTarget: [-5, 0.8, -2.3],
    carStop: [-3.5, 0.3, -0.2],
  },
]

export const visibleLocations = locations.filter(({ id }) => id !== 'plaza')

export function getLocation(id: LocationId) {
  return locations.find((location) => location.id === id) ?? locations[0]
}
