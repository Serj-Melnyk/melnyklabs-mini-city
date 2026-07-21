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
  const isPanelOpen = useCityStore((state) => state.isPanelOpen)
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)
  const setHoveredLocation = useCityStore((state) => state.setHoveredLocation)
  const callout = location.callout
  const isActive = activeLocation === location.id
  const isHovered = isPointerHovered || hoveredLocation === location.id
  const showCallout = isPointerHovered && callout && !(isActive && isPanelOpen)

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
      {showCallout && callout && (
        <Html
          center
          position={compactViewport && callout.compactPosition
            ? callout.compactPosition
            : callout.position}
          className="building-callout-anchor"
          style={{ pointerEvents: 'none' }}
        >
          <span
            aria-hidden="true"
            className="building-callout"
            style={{
              '--callout-accent': callout.accent ?? location.color,
            } as CSSProperties}
          >
            <strong>{callout.title}</strong>
            <span>{callout.description}</span>
          </span>
        </Html>
      )}
    </group>
  )
}
