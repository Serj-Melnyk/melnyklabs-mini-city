import { RoundedBox } from '@react-three/drei'
import { useCityStore } from '../store/useCityStore'
import type { CityLocation } from '../data/locations'

type BuildingProps = {
  location: CityLocation
}

export function Building({ location }: BuildingProps) {
  const activeLocation = useCityStore((state) => state.activeLocation)
  const hoveredLocation = useCityStore((state) => state.hoveredLocation)
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)
  const setHoveredLocation = useCityStore((state) => state.setHoveredLocation)
  const isActive = activeLocation === location.id
  const isHovered = hoveredLocation === location.id
  const isPlaza = location.id === 'plaza'

  return (
    <group position={location.position}>
      <RoundedBox
        args={location.size}
        radius={isPlaza ? 0.35 : 0.16}
        smoothness={3}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation()
          setActiveLocation(location.id)
        }}
        onPointerEnter={(event) => {
          event.stopPropagation()
          document.body.style.cursor = 'pointer'
          setHoveredLocation(location.id)
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'default'
          setHoveredLocation(null)
        }}
        scale={isHovered ? 1.025 : 1}
      >
        <meshStandardMaterial
          color={location.color}
          roughness={0.78}
          emissive={location.color}
          emissiveIntensity={isActive || isHovered ? 0.16 : 0}
        />
      </RoundedBox>

      {!isPlaza && (
        <>
          <mesh position={[0, -location.size[1] / 2 + 0.5, location.size[2] / 2 + 0.03]}>
            <boxGeometry args={[0.76, 1, 0.12]} />
            <meshStandardMaterial color="#18233e" roughness={0.5} />
          </mesh>
          <mesh position={[0, location.size[1] / 2 + 0.14, 0]} castShadow>
            <boxGeometry args={[location.size[0] * 0.72, 0.28, location.size[2] * 0.72]} />
            <meshStandardMaterial color="#fff0d3" roughness={0.84} />
          </mesh>
        </>
      )}
    </group>
  )
}
