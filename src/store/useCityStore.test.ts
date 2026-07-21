import { beforeEach, describe, expect, it } from 'vitest'
import { useCityStore } from './useCityStore'

describe('navigation car state', () => {
  beforeEach(() => {
    useCityStore.setState({
      activeLocation: 'plaza',
      hoveredLocation: null,
      isPanelOpen: false,
      scrollProgress: 0,
      navigationSequence: 0,
      navigationRequest: null,
      carStatus: 'idle',
      carDestination: 'plaza',
      carEnabled: true,
      guideStatus: 'idle',
      guideTarget: 'plaza',
    })
  })

  it('travels before revealing the destination panel', () => {
    const store = useCityStore.getState()
    store.setActiveLocation('projects')

    expect(useCityStore.getState().carStatus).toBe('driving')
    expect(useCityStore.getState().isPanelOpen).toBe(false)

    useCityStore.getState().completeCarTrip('projects')
    expect(useCityStore.getState().carStatus).toBe('arrived')
    expect(useCityStore.getState().isPanelOpen).toBe(true)
  })

  it('keeps fallback navigation immediate when the car is unavailable', () => {
    useCityStore.getState().setCarEnabled(false)
    useCityStore.getState().setActiveLocation('contact')

    expect(useCityStore.getState().carStatus).toBe('arrived')
    expect(useCityStore.getState().isPanelOpen).toBe(true)
  })

  it('publishes guide phases without changing navigation state', () => {
    useCityStore.getState().setGuideState('walking', 'lab')
    expect(useCityStore.getState().guideStatus).toBe('walking')
    expect(useCityStore.getState().guideTarget).toBe('lab')
    expect(useCityStore.getState().activeLocation).toBe('plaza')

    useCityStore.getState().setGuideState('pointing', 'lab')
    expect(useCityStore.getState().guideStatus).toBe('pointing')
  })
})
