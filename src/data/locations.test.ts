import { describe, expect, it } from 'vitest'
import { getLocation, locations, visibleLocations } from './locations'

describe('city locations', () => {
  it('keeps every location identifier unique', () => {
    const ids = locations.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('provides camera and car configuration for every stop', () => {
    for (const location of locations) {
      expect(location.cameraPosition).toHaveLength(3)
      expect(location.cameraTarget).toHaveLength(3)
      expect(location.carStop).toHaveLength(3)
    }
  })

  it('keeps the plaza out of the main navigation', () => {
    expect(visibleLocations).toHaveLength(5)
    expect(getLocation('plaza').title).toBe('Central Plaza')
  })
})
