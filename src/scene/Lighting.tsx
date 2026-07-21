import type { QualityMode } from '../data/quality'

export function Lighting({ qualityMode }: { qualityMode: QualityMode }) {
  const fullQuality = qualityMode === 'full'

  return (
    <>
      <hemisphereLight args={['#b9d6ff', '#201d3d', 2.1]} />
      <ambientLight color="#aebedc" intensity={0.32} />
      <directionalLight
        castShadow={fullQuality}
        color="#ffe6bd"
        intensity={3.2}
        position={[8, 12, 7]}
        shadow-mapSize-width={fullQuality ? 1024 : 512}
        shadow-mapSize-height={fullQuality ? 1024 : 512}
        shadow-camera-near={1}
        shadow-camera-far={35}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.00015}
        shadow-normalBias={0.055}
      />
    </>
  )
}
