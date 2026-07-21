import { locations } from '../data/locations'
import { useCityStore } from '../store/useCityStore'
import type { CSSProperties } from 'react'

export function RouteRail() {
  const activeLocation = useCityStore((state) => state.activeLocation)
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)
  const setHoveredLocation = useCityStore((state) => state.setHoveredLocation)
  const scrollProgress = useCityStore((state) => state.scrollProgress)

  return (
    <nav
      className="route-rail"
      aria-label="City stops"
      style={{ '--route-progress': `${scrollProgress * 100}%` } as CSSProperties}
    >
      {locations.map((location) => (
        <button
          key={location.id}
          type="button"
          aria-label={`Go to ${location.title}`}
          aria-current={activeLocation === location.id ? 'step' : undefined}
          onClick={() => setActiveLocation(location.id)}
          onFocus={() => setHoveredLocation(location.id)}
          onBlur={() => setHoveredLocation(null)}
          onPointerEnter={() => setHoveredLocation(location.id)}
          onPointerLeave={() => setHoveredLocation(null)}
        >
          <span>{location.shortTitle}</span>
        </button>
      ))}
    </nav>
  )
}
