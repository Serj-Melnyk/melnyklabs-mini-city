import { useMemo, useState } from 'react'
import { CityCanvas } from '../scene/CityCanvas'
import { HelpHint } from '../ui/HelpHint'
import { InfoPanel } from '../ui/InfoPanel'
import { LoadingScreen } from '../ui/LoadingScreen'
import { Navigation } from '../ui/Navigation'
import { WebGLFallback } from '../ui/WebGLFallback'
import { RouteRail } from '../ui/RouteRail'
import { useCityStore } from '../store/useCityStore'

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGL2RenderingContext && canvas.getContext('webgl2'),
    )
  } catch {
    return false
  }
}

export function App() {
  const [sceneReady, setSceneReady] = useState(false)
  const webGLAvailable = useMemo(() => canUseWebGL(), [])
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)

  return (
    <main className="app-shell">
      <a className="skip-link" href="#city-content">
        Skip the 3D scene
      </a>
      <Navigation />

      <section className="scene-shell" aria-label="Interactive city overview">
        {webGLAvailable ? (
          <CityCanvas onReady={() => setSceneReady(true)} />
        ) : (
          <WebGLFallback />
        )}
      </section>

      <section className="hero-copy" id="city-content" aria-labelledby="hero-title">
        <h1 id="hero-title">Digital products,<br />built with curiosity.</h1>
        <p>Explore a small city of selected work, experiments and ideas.</p>
        <button type="button" onClick={() => setActiveLocation('about')}>
          Explore the city
          <span aria-hidden="true">→</span>
        </button>
      </section>

      <RouteRail />
      <InfoPanel />
      <HelpHint />
      {webGLAvailable && <LoadingScreen visible={!sceneReady} />}
    </main>
  )
}
