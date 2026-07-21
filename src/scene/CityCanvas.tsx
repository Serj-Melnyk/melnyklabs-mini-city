import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { CityScene } from './CityScene'
import { CameraController } from './CameraController'
import type { QualityMode } from '../data/quality'

type CityCanvasProps = {
  onReady: () => void
  qualityMode: QualityMode
  reducedMotion: boolean
}

export function CityCanvas({ onReady, qualityMode, reducedMotion }: CityCanvasProps) {
  const lightweight = qualityMode === 'light'

  return (
    <Canvas
      dpr={lightweight ? 1 : [1, 1.5]}
      frameloop="demand"
      shadows={lightweight ? false : 'basic'}
      camera={{ position: [12.4, 12.4, 16.4], fov: 36, near: 0.1, far: 100 }}
      gl={{ antialias: !lightweight, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
    >
      <CameraController reducedMotion={reducedMotion} />
      <Suspense fallback={null}>
        <CityScene
          onReady={onReady}
          qualityMode={qualityMode}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  )
}
