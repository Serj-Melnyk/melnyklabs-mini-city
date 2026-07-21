import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { ReactNode } from 'react'
import type { CityLocation } from '../data/locations'
import { useCityStore } from '../store/useCityStore'

type InteractiveObjectProps = {
  location: CityLocation
  children: (state: { isActive: boolean; isHovered: boolean }) => ReactNode
}

export function InteractiveObject({ location, children }: InteractiveObjectProps) {
  const activeLocation = useCityStore((state) => state.activeLocation)
  const hoveredLocation = useCityStore((state) => state.hoveredLocation)
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)
  const setHoveredLocation = useCityStore((state) => state.setHoveredLocation)
  const isActive = activeLocation === location.id
  const isHovered = hoveredLocation === location.id

  const selectLocation = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    setActiveLocation(location.id)
  }

  return (
    <group
      position={location.position}
      rotation={[0, location.rotationY, 0]}
      onClick={selectLocation}
      onPointerEnter={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
        setHoveredLocation(location.id)
      }}
      onPointerLeave={() => {
        document.body.style.cursor = 'default'
        setHoveredLocation(null)
      }}
    >
      {children({ isActive, isHovered })}
      {isHovered && (
        <Html
          center
          position={[0, location.size[1] / 2 + 0.8, 0]}
          distanceFactor={10}
          className="object-tooltip-anchor"
          style={{ pointerEvents: 'none' }}
        >
          <span className="object-tooltip">{location.shortTitle}</span>
        </Html>
      )}
    </group>
  )
}
