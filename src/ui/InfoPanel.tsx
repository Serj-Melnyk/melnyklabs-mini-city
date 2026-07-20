import { getLocation } from '../data/locations'
import { useCityStore } from '../store/useCityStore'

export function InfoPanel() {
  const activeLocation = useCityStore((state) => state.activeLocation)
  const isPanelOpen = useCityStore((state) => state.isPanelOpen)
  const closePanel = useCityStore((state) => state.closePanel)
  const location = getLocation(activeLocation)

  return (
    <aside className={`info-panel ${isPanelOpen ? 'is-open' : ''}`} aria-hidden={!isPanelOpen}>
      <button className="panel-close" type="button" aria-label="Close information panel" onClick={closePanel}>
        ×
      </button>
      <p className="panel-index">{String(Math.max(1, locationsIndex(activeLocation))).padStart(2, '0')}</p>
      <h2>{location.title}</h2>
      <p>{location.description}</p>
      <button className="text-action" type="button">{location.action} <span aria-hidden="true">→</span></button>
    </aside>
  )
}

function locationsIndex(id: string) {
  const order = ['plaza', 'about', 'projects', 'services', 'lab', 'contact']
  return order.indexOf(id)
}
