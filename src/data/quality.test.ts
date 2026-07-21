import { describe, expect, it } from 'vitest'
import { selectQualityMode } from './quality'

describe('device quality selection', () => {
  it('keeps capable desktop devices in full quality', () => {
    expect(selectQualityMode({
      width: 1440,
      coarsePointer: false,
      hardwareConcurrency: 10,
      deviceMemory: 8,
    })).toBe('full')
  })

  it('uses lightweight mode for compact or constrained devices', () => {
    expect(selectQualityMode({ width: 390, coarsePointer: true })).toBe('light')
    expect(selectQualityMode({
      width: 1280,
      coarsePointer: false,
      hardwareConcurrency: 4,
    })).toBe('light')
    expect(selectQualityMode({
      width: 1440,
      coarsePointer: false,
      saveData: true,
    })).toBe('light')
  })

  it('respects an explicit URL override', () => {
    expect(selectQualityMode({
      width: 390,
      coarsePointer: true,
      override: 'full',
    })).toBe('full')
  })
})
