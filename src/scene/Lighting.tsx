export function Lighting() {
  return (
    <>
      <hemisphereLight args={['#b9d6ff', '#201d3d', 2.1]} />
      <directionalLight
        castShadow
        color="#ffe6bd"
        intensity={3.2}
        position={[8, 12, 7]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={35}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
    </>
  )
}
