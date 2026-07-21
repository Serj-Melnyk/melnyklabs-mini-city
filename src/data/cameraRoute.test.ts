import { describe, expect, it } from 'vitest'
import {
  cameraRoute,
  getLocationProgress,
  getNearestLocationId,
  sampleCameraRoute,
} from './cameraRoute'

describe('camera route', () => {
  it('keeps checkpoints ordered from zero to one', () => {
    expect(cameraRoute[0].progress).toBe(0)
    expect(cameraRoute.at(-1)?.progress).toBe(1)

    for (let index = 1; index < cameraRoute.length; index += 1) {
      expect(cameraRoute[index].progress).toBeGreaterThan(
        cameraRoute[index - 1].progress,
      )
    }
  })

  it('returns the configured position at a checkpoint', () => {
    const projectProgress = getLocationProgress('projects')
    expect(sampleCameraRoute(projectProgress).position).toEqual(
      cameraRoute.find(({ id }) => id === 'projects')?.position,
    )
  })

  it('clamps progress and keeps the overview mapped to the nearest location', () => {
    expect(sampleCameraRoute(-1)).toEqual(sampleCameraRoute(0))
    expect(sampleCameraRoute(2)).toEqual(sampleCameraRoute(1))
    expect(getNearestLocationId(1)).toBe('contact')
  })
})
