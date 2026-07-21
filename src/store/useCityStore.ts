import { create } from 'zustand'
import type { LocationId } from '../data/locations'

type CityState = {
  activeLocation: LocationId
  hoveredLocation: LocationId | null
  isPanelOpen: boolean
  scrollProgress: number
  navigationSequence: number
  navigationRequest: { id: LocationId; token: number } | null
  setActiveLocation: (id: LocationId) => void
  syncActiveLocation: (id: LocationId) => void
  setHoveredLocation: (id: LocationId | null) => void
  setScrollProgress: (progress: number) => void
  completeNavigation: (token: number) => void
  closePanel: () => void
}

export const useCityStore = create<CityState>((set) => ({
  activeLocation: 'plaza',
  hoveredLocation: null,
  isPanelOpen: false,
  scrollProgress: 0,
  navigationSequence: 0,
  navigationRequest: null,
  setActiveLocation: (activeLocation) =>
    set((state) => {
      const token = state.navigationSequence + 1

      return {
        activeLocation,
        isPanelOpen: activeLocation !== 'plaza',
        navigationSequence: token,
        navigationRequest: { id: activeLocation, token },
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
  closePanel: () => set({ isPanelOpen: false }),
}))
