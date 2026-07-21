import { locations, type LocationId } from './locations'

const locationIds = new Set<LocationId>(locations.map(({ id }) => id))

export function parseLocationHash(hash: string): LocationId | null {
  const value = hash.replace(/^#/, '').toLowerCase()
  return locationIds.has(value as LocationId) ? (value as LocationId) : null
}

export function getLocationHash(id: LocationId) {
  return id === 'plaza' ? '' : `#${id}`
}
