import { lazy, Suspense, useLayoutEffect, useMemo, useState } from 'react'
import { HelpHint } from '../ui/HelpHint'
import { InfoPanel } from '../ui/InfoPanel'
import { LoadingScreen } from '../ui/LoadingScreen'
import { Navigation } from '../ui/Navigation'
import { WebGLFallback } from '../ui/WebGLFallback'
import { RouteRail } from '../ui/RouteRail'
import { CarStatus } from '../ui/CarStatus'
import { GuideStatus } from '../ui/GuideStatus'
import { useCityStore } from '../store/useCityStore'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useCityNavigation } from '../hooks/useCityNavigation'
import { useCityDeepLinks } from '../hooks/useCityDeepLinks'
import { useDeviceQuality } from '../hooks/useDeviceQuality'

const CityCanvas = lazy(async () => {
  const module = await import('../scene/CityCanvas')
  return { default: module.CityCanvas }
})

function canUseWebGL() {
  try {
    if (new URLSearchParams(window.location.search).get('mode') === 'html') {
      return false
    }

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
  const setCarEnabled = useCityStore((state) => state.setCarEnabled)
  const scrollProgress = useCityStore((state) => state.scrollProgress)
  const reducedMotion = useReducedMotion()
  const qualityMode = useDeviceQuality()
  useCityNavigation()
  useCityDeepLinks()

  useLayoutEffect(() => {
    setCarEnabled(webGLAvailable)
  }, [setCarEnabled, webGLAvailable])

  return (
    <main className="app-shell" data-quality={qualityMode}>
      <div className="experience-shell">
        <a className="skip-link" href="#city-content">
          Skip the 3D scene
        </a>
        <Navigation />

        <section className="scene-shell" aria-label="Interactive city overview">
          {webGLAvailable ? (
            <Suspense fallback={null}>
              <CityCanvas
                onReady={() => setSceneReady(true)}
                qualityMode={qualityMode}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          ) : (
            <WebGLFallback />
          )}
        </section>

        <section
          className={`hero-copy ${scrollProgress > 0.055 ? 'is-away' : ''}`}
          id="city-content"
          aria-labelledby="hero-title"
        >
          <h1 id="hero-title">Digital products,<br />built with curiosity.</h1>
          <p>Explore a small city of selected work, experiments and ideas.</p>
          <button type="button" onClick={() => setActiveLocation('about')}>
            Explore the city
            <span aria-hidden="true">→</span>
          </button>
        </section>

        <RouteRail />
        <CarStatus />
        <GuideStatus />
        <InfoPanel />
        <HelpHint interactive3d={webGLAvailable} />
        {webGLAvailable && <LoadingScreen visible={!sceneReady} />}
      </div>
    </main>
  )
}
