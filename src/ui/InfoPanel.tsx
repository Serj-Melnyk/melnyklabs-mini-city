import { useEffect, useRef } from 'react'
import { panelContent, type PanelLocationId } from '../data/panelContent'
import { getLocation } from '../data/locations'
import { useCityStore } from '../store/useCityStore'
import { ContactForm } from './ContactForm'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <path d="M3 9h11M10 5l4 4-4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

export function InfoPanel() {
  const activeLocation = useCityStore((state) => state.activeLocation)
  const isPanelOpen = useCityStore((state) => state.isPanelOpen)
  const navigationSequence = useCityStore((state) => state.navigationSequence)
  const closePanel = useCityStore((state) => state.closePanel)
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const location = getLocation(activeLocation)
  const content = activeLocation === 'plaza'
    ? null
    : panelContent[activeLocation as PanelLocationId]

  useEffect(() => {
    if (!isPanelOpen) return
    const frame = window.requestAnimationFrame(() => headingRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [isPanelOpen, navigationSequence])

  useEffect(() => {
    if (!isPanelOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closePanel, isPanelOpen])

  if (!content) return null

  return (
    <aside
      className={`info-panel ${isPanelOpen ? 'is-open' : ''}`}
      aria-hidden={!isPanelOpen}
      aria-labelledby="panel-title"
      aria-describedby="panel-introduction"
      inert={!isPanelOpen}
      role="dialog"
    >
      <button className="panel-close" type="button" aria-label="Close information panel" onClick={closePanel}>
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
          <path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        </svg>
      </button>

      <div className="panel-scroll">
        <p className="panel-index">{String(locationsIndex(activeLocation)).padStart(2, '0')} / 05</p>
        <p className="panel-kicker">{content.eyebrow}</p>
        <h2 id="panel-title" ref={headingRef} tabIndex={-1}>{location.title}</h2>
        <p className="panel-introduction" id="panel-introduction">{content.introduction}</p>

        <div className="panel-items">
          {content.items.map((item, index) => (
            <article className="panel-item" key={item.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{item.title}</h3>
                {item.meta && <p className="panel-meta">{item.meta}</p>}
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        {activeLocation === 'contact' && <ContactForm />}

        <div className="panel-actions">
          {content.nextLocation && content.nextLabel && (
            <button className="text-action" type="button" onClick={() => setActiveLocation(content.nextLocation!)}>
              {content.nextLabel}
              <ArrowIcon />
            </button>
          )}
          {content.links?.map((link) => (
            <a className="text-action" href={link.href} target="_blank" rel="noreferrer" key={link.href}>
              {link.label}
              <ArrowIcon />
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}

function locationsIndex(id: string) {
  const order = ['plaza', 'about', 'projects', 'services', 'lab', 'contact']
  return Math.max(1, order.indexOf(id))
}
