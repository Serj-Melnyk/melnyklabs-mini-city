import { Canvas } from '@react-three/fiber'
import { CityScene } from './CityScene'

type CityCanvasProps = {
  onReady: () => void
}

export function CityCanvas({ onReady }: CityCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="demand"
      shadows="basic"
      camera={{ position: [13, 13, 17], fov: 36, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => {
        camera.lookAt(0, -1.15, 0)
        onReady()
      }}
    >
      <CityScene />
    </Canvas>
  )
}
