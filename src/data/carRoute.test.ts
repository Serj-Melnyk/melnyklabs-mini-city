import { describe, expect, it } from 'vitest'
import {
  carNavigationOrder,
  carRouteConfig,
  createCarTrip,
  getCarStopProgress,
  getCarTripDuration,
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

  it('aligns the model local +X nose with the road tangent', () => {
    for (const progress of [0, 0.125, 0.25, 0.5, 0.875]) {
      const pose = sampleCarRoute(progress)

      expect(Math.cos(pose.rotationY)).toBeCloseTo(pose.forward[0])
      expect(-Math.sin(pose.rotationY)).toBeCloseTo(pose.forward[2])
    }
  })

  it('always drives forward around the closed route', () => {
    const trip = createCarTrip(0.98, 'services')
    expect(trip.deltaProgress).toBeGreaterThan(0)
    expect(trip.deltaProgress).toBeLessThan(1)
    expect(trip.duration).toBeGreaterThan(0)
    expect(sampleCarTrip(trip, 0)).toBeCloseTo(0.98)
    expect(sampleCarTrip(trip, 1)).toBeCloseTo(getCarStopProgress('services'))
  })

  it('continues through the city instead of reversing to a previous stop', () => {
    const aboutProgress = getCarStopProgress('about')
    const projectsProgress = getCarStopProgress('projects')
    const trip = createCarTrip(aboutProgress, 'projects')

    expect(projectsProgress).toBeLessThan(aboutProgress)
    expect(trip.deltaProgress).toBeCloseTo(1 - aboutProgress + projectsProgress)
    expect(trip.distance).toBeGreaterThan(Math.PI * carRouteConfig.radius)
    expect(sampleCarTrip(trip, 0.5)).toBeGreaterThan(aboutProgress)
  })

  it('creates a zero-duration trip when already at a stop', () => {
    const progress = getCarStopProgress('projects')
    const trip = createCarTrip(progress, 'projects')
    expect(trip.distance).toBeCloseTo(0)
    expect(trip.duration).toBe(0)
  })

  it('shortens trips in lightweight mode', () => {
    const trip = createCarTrip(getCarStopProgress('plaza'), 'contact')

    expect(getCarTripDuration(trip, true)).toBeLessThan(trip.duration)
    expect(getCarTripDuration(trip, false)).toBe(trip.duration)
  })
})
