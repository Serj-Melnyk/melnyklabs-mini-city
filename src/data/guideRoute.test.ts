import { describe, expect, it } from 'vitest'
import { locations } from './locations'
import {
  createGuideWalk,
  getGuideYaw,
  guideMotionConfig,
  guideStops,
  sampleGuideWalk,
} from './guideRoute'

describe('guide character route', () => {
  it('configures a safe guide stop for every city location', () => {
    for (const { id } of locations) {
      expect(guideStops[id].position).toHaveLength(3)
      expect(guideStops[id].pointTarget).toHaveLength(3)
      expect(Math.hypot(guideStops[id].position[0], guideStops[id].position[2]))
        .toBeLessThan(2.6)
      expect(Number.isFinite(getGuideYaw(id))).toBe(true)
    }
  })

  it('samples the configured endpoints with eased movement', () => {
    const walk = createGuideWalk(guideStops.plaza.position, 'projects')
    expect(sampleGuideWalk(walk, 0)).toEqual(guideStops.plaza.position)
    expect(sampleGuideWalk(walk, 1)).toEqual(guideStops.projects.position)
    expect(walk.duration).toBeGreaterThanOrEqual(guideMotionConfig.minimumDuration)
    expect(walk.duration).toBeLessThanOrEqual(guideMotionConfig.maximumDuration)
  })

  it('avoids timed walking when already at the target stop', () => {
    const walk = createGuideWalk(guideStops.lab.position, 'lab')
    expect(walk.distance).toBe(0)
    expect(walk.duration).toBe(0)
  })
})
