import { describe, expect, it } from 'vitest'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  carAssetPath,
  cityAssetPaths,
  guideAssetPath,
  projectAnnexAssetPaths,
  productionAssetPaths,
} from './cityAssets'
import { locations } from './locations'

describe('production city assets', () => {
  it('maps every location to a distinct GLB model', () => {
    expect(Object.keys(cityAssetPaths)).toEqual(locations.map(({ id }) => id))
    expect(new Set(Object.values(cityAssetPaths)).size).toBe(locations.length)
    expect(Object.values(cityAssetPaths).every((path) => path.endsWith('.glb'))).toBe(true)
  })

  it('includes separate car and guide models in the preload manifest', () => {
    expect(productionAssetPaths).toContain(carAssetPath)
    expect(productionAssetPaths).toContain(guideAssetPath)
    expect(carAssetPath).not.toBe(guideAssetPath)
    expect(carAssetPath).toContain('melnyklabs-sports-car.glb')
    expect(statSync(resolve(process.cwd(), 'public', carAssetPath.slice(1))).size)
      .toBeLessThan(100 * 1024)
  })

  it('includes two original project annex models for the seven-building composition', () => {
    expect(projectAnnexAssetPaths).toHaveLength(2)
    expect(new Set(projectAnnexAssetPaths).size).toBe(2)
    expect(projectAnnexAssetPaths.every((path) => path.endsWith('.glb'))).toBe(true)
    expect(productionAssetPaths).toHaveLength(10)
  })

  it('keeps every model present and the combined GLB payload under 4 MB', () => {
    const totalBytes = productionAssetPaths.reduce((total, publicPath) => {
      const file = resolve(process.cwd(), 'public', publicPath.slice(1))
      const bytes = statSync(file).size
      expect(bytes).toBeGreaterThan(1_000)
      return total + bytes
    }, 0)

    expect(totalBytes).toBeLessThan(4 * 1024 * 1024)
  })
})
