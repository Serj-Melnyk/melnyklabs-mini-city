import { create } from 'zustand'
import type { LocationId } from '../data/locations'

type CityState = {
  activeLocation: LocationId
  hoveredLocation: LocationId | null
  isPanelOpen: boolean
  scrollProgress: number
  navigationSequence: number
  navigationRequest: { id: LocationId; token: number } | null
  carStatus: 'idle' | 'driving' | 'arrived'
  carDestination: LocationId
  carEnabled: boolean
  guideStatus: 'idle' | 'walking' | 'pointing'
  guideTarget: LocationId
  setActiveLocation: (id: LocationId) => void
  syncActiveLocation: (id: LocationId) => void
  setHoveredLocation: (id: LocationId | null) => void
  setScrollProgress: (progress: number) => void
  completeNavigation: (token: number) => void
  completeCarTrip: (id: LocationId) => void
  setCarEnabled: (enabled: boolean) => void
  setGuideState: (
    status: 'idle' | 'walking' | 'pointing',
    target: LocationId,
  ) => void
  closePanel: () => void
}

export const useCityStore = create<CityState>((set) => ({
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
  setActiveLocation: (activeLocation) =>
    set((state) => {
      const token = state.navigationSequence + 1

      return {
        activeLocation,
        isPanelOpen: state.carEnabled ? false : activeLocation !== 'plaza',
        navigationSequence: token,
        navigationRequest: { id: activeLocation, token },
        carStatus: state.carEnabled ? 'driving' : 'arrived',
        carDestination: activeLocation,
      }
    }),
  syncActiveLocation: (activeLocation) => set({ activeLocation }),
  setHoveredLocation: (hoveredLocation) => set({ hoveredLocation }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  completeNavigation: (token) =>
    set((state) =>
      state.navigationRequest?.token === token
        ? { navigationRequest: null }
        : state,
    ),
  completeCarTrip: (id) =>
    set((state) =>
      state.carDestination === id
        ? {
            carStatus: 'arrived',
            isPanelOpen: id !== 'plaza',
          }
        : state,
    ),
  setCarEnabled: (carEnabled) =>
    set((state) => ({
      carEnabled,
      carStatus: carEnabled ? state.carStatus : 'arrived',
    })),
  setGuideState: (guideStatus, guideTarget) =>
    set({ guideStatus, guideTarget }),
  closePanel: () => set({ isPanelOpen: false }),
}))
