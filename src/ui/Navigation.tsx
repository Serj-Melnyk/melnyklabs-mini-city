import { useState } from 'react'
import { visibleLocations } from '../data/locations'
import { useCityStore } from '../store/useCityStore'

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeLocation = useCityStore((state) => state.activeLocation)
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)
  const setHoveredLocation = useCityStore((state) => state.setHoveredLocation)

  const navigate = (id: (typeof visibleLocations)[number]['id']) => {
    setActiveLocation(id)
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={() => navigate('plaza')}>
        MelnykLabs
      </button>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? 'Close' : 'Menu'}
      </button>
      <nav id="primary-navigation" className={menuOpen ? 'nav-open' : ''} aria-label="Primary navigation">
        {visibleLocations.map((location) => (
          <button
            key={location.id}
            type="button"
            aria-current={activeLocation === location.id ? 'page' : undefined}
            onClick={() => navigate(location.id)}
            onFocus={() => setHoveredLocation(location.id)}
            onBlur={() => setHoveredLocation(null)}
            onPointerEnter={() => setHoveredLocation(location.id)}
            onPointerLeave={() => setHoveredLocation(null)}
          >
            {location.navLabel}
          </button>
        ))}
      </nav>
    </header>
  )
}
