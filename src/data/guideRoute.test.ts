import { describe, expect, it } from 'vitest'
import { benchPoses, lampPositions, treePositions } from './cityProps'
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
      expect(guideStops[id].position[2])
        .toBeGreaterThanOrEqual(guideMotionConfig.corridorMinimumZ)
      expect(Math.abs(guideStops[id].position[0]))
        .toBeLessThanOrEqual(guideMotionConfig.corridorMaximumAbsX)
      expect(Math.hypot(guideStops[id].position[0], guideStops[id].position[2]))
        .toBeGreaterThanOrEqual(guideMotionConfig.landmarkClearanceRadius)
      expect(Number.isFinite(getGuideYaw(id))).toBe(true)
    }
  })

  it('keeps every direct walk inside the obstacle-free front plaza corridor', () => {
    const obstacles = [
      ...benchPoses.map(({ position }) => ({ position, radius: 0.62 })),
      ...lampPositions.map((position) => ({ position, radius: 0.12 })),
      ...treePositions.map((position) => ({ position, radius: 0.24 })),
    ]

    for (const fromLocation of locations) {
      for (const toLocation of locations) {
        const walk = createGuideWalk(guideStops[fromLocation.id].position, toLocation.id)

        for (let step = 0; step <= 20; step += 1) {
          const position = sampleGuideWalk(walk, step / 20)
          expect(position[2]).toBeGreaterThanOrEqual(guideMotionConfig.corridorMinimumZ)
          expect(Math.abs(position[0]))
            .toBeLessThanOrEqual(guideMotionConfig.corridorMaximumAbsX)
          expect(Math.hypot(position[0], position[2]))
            .toBeGreaterThanOrEqual(guideMotionConfig.landmarkClearanceRadius)

          for (const obstacle of obstacles) {
            const clearance = Math.hypot(
              position[0] - obstacle.position[0],
              position[2] - obstacle.position[2],
            )
            expect(clearance).toBeGreaterThanOrEqual(
              obstacle.radius
                + guideMotionConfig.collisionRadius
                + guideMotionConfig.collisionMargin,
            )
          }
        }
      }
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
