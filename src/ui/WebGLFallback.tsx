import { visibleLocations } from '../data/locations'
import { useCityStore } from '../store/useCityStore'

export function WebGLFallback() {
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)

  return (
    <div className="webgl-fallback">
      <div>
        <h2>The city is taking a lightweight route.</h2>
        <p>Your browser could not start WebGL, but every portfolio stop is still available.</p>
        <div className="fallback-links">
          {visibleLocations.map((location) => (
            <button key={location.id} type="button" onClick={() => setActiveLocation(location.id)}>
              {location.navLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
