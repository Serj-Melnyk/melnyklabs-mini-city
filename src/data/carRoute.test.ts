import { describe, expect, it } from 'vitest'
import {
  carNavigationOrder,
  carRouteConfig,
  createCarTrip,
  getCarStopProgress,
  getNextCarLocation,
  sampleCarRoute,
  sampleCarTrip,
} from './carRoute'

describe('navigation car route', () => {
  it('keeps every configured location in the navigation order', () => {
    expect(carNavigationOrder).toEqual([
      'plaza',
      'about',
      'projects',
      'services',
      'lab',
      'contact',
    ])
    expect(getNextCarLocation('contact')).toBe('plaza')
  })

  it('samples every stop on the configured ring road', () => {
    for (const id of carNavigationOrder) {
      const pose = sampleCarRoute(getCarStopProgress(id))
      const radius = Math.hypot(pose.position[0], pose.position[2])
      expect(radius).toBeCloseTo(carRouteConfig.radius)
      expect(pose.position[1]).toBe(carRouteConfig.height)
    }
  })

  it('chooses the shortest direction around the closed route', () => {
    const trip = createCarTrip(0.98, 'services')
    expect(Math.abs(trip.deltaProgress)).toBeLessThanOrEqual(0.5)
    expect(trip.duration).toBeGreaterThan(0)
    expect(sampleCarTrip(trip, 0)).toBeCloseTo(0.98)
    expect(sampleCarTrip(trip, 1)).toBeCloseTo(getCarStopProgress('services'))
  })

  it('creates a zero-duration trip when already at a stop', () => {
    const progress = getCarStopProgress('projects')
    const trip = createCarTrip(progress, 'projects')
    expect(trip.distance).toBeCloseTo(0)
    expect(trip.duration).toBe(0)
  })
})
