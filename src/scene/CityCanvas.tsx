import { Canvas } from '@react-three/fiber'
import { CityScene } from './CityScene'
import { CameraController } from './CameraController'

type CityCanvasProps = {
  onReady: () => void
  reducedMotion: boolean
}

export function CityCanvas({ onReady, reducedMotion }: CityCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="demand"
      shadows="basic"
      camera={{ position: [13, 13, 17], fov: 36, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
      onCreated={onReady}
    >
      <CameraController reducedMotion={reducedMotion} />
      <CityScene />
    </Canvas>
  )
}
