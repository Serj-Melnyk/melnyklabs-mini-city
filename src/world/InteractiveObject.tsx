import { Html } from '@react-three/drei'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { useState, type CSSProperties, type ReactNode } from 'react'
import type { CityLocation } from '../data/locations'
import { useCityStore } from '../store/useCityStore'

type InteractiveObjectProps = {
  location: CityLocation
  children: (state: { isActive: boolean; isHovered: boolean }) => ReactNode
}

export function InteractiveObject({ location, children }: InteractiveObjectProps) {
  const [isPointerHovered, setIsPointerHovered] = useState(false)
  const compactViewport = useThree((state) => state.size.width <= 900)
  const activeLocation = useCityStore((state) => state.activeLocation)
  const hoveredLocation = useCityStore((state) => state.hoveredLocation)
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)
  const setHoveredLocation = useCityStore((state) => state.setHoveredLocation)
  const isActive = activeLocation === location.id
  const isHovered = isPointerHovered || hoveredLocation === location.id

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
        setIsPointerHovered(true)
        setHoveredLocation(location.id)
      }}
      onPointerLeave={() => {
        document.body.style.cursor = 'default'
        setIsPointerHovered(false)
        setHoveredLocation(null)
      }}
    >
      {children({ isActive, isHovered })}
      {isPointerHovered && location.callout && (
        <Html
          center
          position={compactViewport && location.callout.compactPosition
            ? location.callout.compactPosition
            : location.callout.position}
          distanceFactor={location.callout.distanceFactor ?? 15}
          className="building-callout-anchor"
          style={{ pointerEvents: 'none' }}
        >
          <span
            aria-hidden="true"
            className="building-callout"
            style={{
              '--callout-accent': location.callout.accent ?? location.color,
            } as CSSProperties}
          >
            <strong>{location.callout.title}</strong>
            <span>{location.callout.description}</span>
          </span>
        </Html>
      )}
    </group>
  )
}
