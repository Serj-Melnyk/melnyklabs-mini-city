import { create } from 'zustand'
import type { LocationId } from '../data/locations'

type CityState = {
  activeLocation: LocationId
  hoveredLocation: LocationId | null
  isPanelOpen: boolean
  setActiveLocation: (id: LocationId) => void
  setHoveredLocation: (id: LocationId | null) => void
  closePanel: () => void
}

export const useCityStore = create<CityState>((set) => ({
  activeLocation: 'plaza',
  hoveredLocation: null,
  isPanelOpen: false,
  setActiveLocation: (activeLocation) =>
    set({ activeLocation, isPanelOpen: activeLocation !== 'plaza' }),
  setHoveredLocation: (hoveredLocation) => set({ hoveredLocation }),
  closePanel: () => set({ isPanelOpen: false }),
}))
