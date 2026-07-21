import { describe, expect, it } from 'vitest'
import { getLocationHash, parseLocationHash } from './locationHash'

describe('location hashes', () => {
  it('parses supported city stops', () => {
    expect(parseLocationHash('#projects')).toBe('projects')
    expect(parseLocationHash('CONTACT')).toBe('contact')
  })

  it('rejects unknown hashes', () => {
    expect(parseLocationHash('#unknown')).toBeNull()
    expect(parseLocationHash('')).toBeNull()
  })

  it('keeps the plaza at the clean root URL', () => {
    expect(getLocationHash('plaza')).toBe('')
    expect(getLocationHash('lab')).toBe('#lab')
  })
})
