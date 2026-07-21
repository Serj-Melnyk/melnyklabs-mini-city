import { describe, expect, it } from 'vitest'
import { formatContactMessage } from './contact'

describe('contact inquiry formatting', () => {
  it('creates a portable message with reply details', () => {
    const message = formatContactMessage({
      name: 'Alex',
      email: 'alex@example.com',
      projectType: 'Interactive website',
      message: 'I would like to discuss a small city experience.',
    })

    expect(message).toContain('MelnykLabs project inquiry')
    expect(message).toContain('alex@example.com')
    expect(message).toContain('Interactive website')
    expect(message).toContain('small city experience')
  })
})
