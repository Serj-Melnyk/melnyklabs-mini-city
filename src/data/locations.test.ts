import { describe, expect, it } from 'vitest'
import { carRouteConfig } from './carRoute'
import {
  buildingLocations,
  getLocation,
  locations,
  supplementalBuildings,
  visibleLocations,
} from './locations'

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

  it('keeps every building beyond the car road with a visible safety gap', () => {
    for (const location of buildingLocations) {
      const buildingRadius = Math.hypot(location.position[0], location.position[2])
      const innerFacadeRadius = buildingRadius - location.size[2] / 2

      expect(innerFacadeRadius).toBeGreaterThan(carRouteConfig.roadOuterRadius + 0.25)
    }
  })

  it('aligns each navigation stop with its building on the circular route', () => {
    for (const location of visibleLocations) {
      const buildingRadius = Math.hypot(location.position[0], location.position[2])
      const stopRadius = Math.hypot(location.carStop[0], location.carStop[2])
      const buildingAngle = Math.atan2(location.position[0], location.position[2])
      const stopAngle = Math.atan2(location.carStop[0], location.carStop[2])

      expect(stopRadius).toBeCloseTo(carRouteConfig.radius, 1)
      expect(Math.abs(buildingAngle - stopAngle)).toBeLessThan(0.02)
      expect(buildingRadius - location.size[2] / 2 - stopRadius).toBeLessThan(2.7)
    }
  })

  it('adds two project annexes without creating extra navigation stops', () => {
    expect(supplementalBuildings).toHaveLength(2)
    expect(supplementalBuildings.every(({ id }) => id === 'projects')).toBe(true)
    expect(buildingLocations).toHaveLength(7)
  })

  it('provides a complete hover callout for every visible building', () => {
    expect(buildingLocations.every(({ callout }) => (
      Boolean(callout?.title) &&
      Boolean(callout?.description) &&
      callout?.position.length === 3 &&
      (callout?.compactPosition === undefined || callout.compactPosition.length === 3)
    ))).toBe(true)
    expect(new Set(buildingLocations.map(({ callout }) => callout?.title)).size).toBe(7)
  })
})
