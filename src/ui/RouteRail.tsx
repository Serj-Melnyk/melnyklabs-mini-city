import { locations } from '../data/locations'
import { useCityStore } from '../store/useCityStore'

export function RouteRail() {
  const activeLocation = useCityStore((state) => state.activeLocation)
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)

  return (
    <nav className="route-rail" aria-label="City stops">
      {locations.map((location) => (
        <button
          key={location.id}
          type="button"
          aria-label={`Go to ${location.title}`}
          aria-current={activeLocation === location.id ? 'step' : undefined}
          onClick={() => setActiveLocation(location.id)}
        />
      ))}
    </nav>
  )
}
