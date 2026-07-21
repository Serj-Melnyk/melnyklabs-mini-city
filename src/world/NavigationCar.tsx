import { Html } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Group, Vector3 } from 'three'
import {
  createCarTrip,
  getCarStopProgress,
  getNextCarLocation,
  sampleCarRoute,
  sampleCarTrip,
} from '../data/carRoute'
import { getLocation, type LocationId } from '../data/locations'
import { carRuntime } from '../scene/carRuntime'
import { useCityStore } from '../store/useCityStore'

type NavigationCarProps = {
  reducedMotion: boolean
}

const localForward = new Vector3()

export function NavigationCar({ reducedMotion }: NavigationCarProps) {
  const group = useRef<Group>(null)
  const currentProgress = useRef(getCarStopProgress('plaza'))
  const tripState = useRef<{
    trip: ReturnType<typeof createCarTrip>
    elapsed: number
    destination: LocationId
  } | null>(null)
  const [hovered, setHovered] = useState(false)
  const { invalidate } = useThree()
  const activeLocation = useCityStore((state) => state.activeLocation)
  const navigationSequence = useCityStore((state) => state.navigationSequence)
  const completeCarTrip = useCityStore((state) => state.completeCarTrip)
  const setActiveLocation = useCityStore((state) => state.setActiveLocation)
  const nextLocation = getNextCarLocation(activeLocation)

  const applyPose = useCallback((progress: number, traveling: boolean) => {
    if (!group.current) return

    const pose = sampleCarRoute(progress)
    group.current.position.set(...pose.position)
    group.current.rotation.y = pose.rotationY
    group.current.updateWorldMatrix(true, false)
    group.current.getWorldPosition(carRuntime.position)

    localForward.set(...pose.forward)
    if (group.current.parent) {
      localForward.transformDirection(group.current.parent.matrixWorld)
    }
    carRuntime.forward.copy(localForward).normalize()
    carRuntime.isTraveling = traveling
    invalidate()
  }, [invalidate])

  useLayoutEffect(() => {
    applyPose(currentProgress.current, false)
  }, [applyPose])

  useLayoutEffect(() => {
    if (navigationSequence === 0) return

    const trip = createCarTrip(currentProgress.current, activeLocation)

    if (reducedMotion || trip.duration === 0) {
      tripState.current = null
      currentProgress.current = sampleCarTrip(trip, 1)
      applyPose(currentProgress.current, false)
      completeCarTrip(activeLocation)
      return
    }

    tripState.current = {
      trip,
      elapsed: 0,
      destination: activeLocation,
    }
    carRuntime.isTraveling = true
    invalidate()
  }, [activeLocation, applyPose, completeCarTrip, invalidate, navigationSequence, reducedMotion])

  useFrame((_, delta) => {
    const state = tripState.current
    if (!state) return

    state.elapsed += delta
    const amount = Math.min(state.elapsed / state.trip.duration, 1)
    currentProgress.current = sampleCarTrip(state.trip, amount)

    if (amount >= 1) {
      const destination = state.destination
      tripState.current = null
      applyPose(currentProgress.current, false)
      completeCarTrip(destination)
      return
    }

    applyPose(currentProgress.current, true)
    invalidate()
  })

  useEffect(() => {
    return () => {
      tripState.current = null
      carRuntime.isTraveling = false
      document.body.style.cursor = 'default'
    }
  }, [])

  const driveToNextStop = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    setActiveLocation(nextLocation)
  }

  return (
    <group
      ref={group}
      scale={hovered ? 1.05 : 1}
      onClick={driveToNextStop}
      onPointerEnter={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
        setHovered(true)
      }}
      onPointerLeave={() => {
        document.body.style.cursor = 'default'
        setHovered(false)
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[1.28, 0.38, 0.72]} />
        <meshStandardMaterial color="#f26b4f" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[-0.06, 0.32, 0]}>
        <boxGeometry args={[0.72, 0.3, 0.62]} />
        <meshStandardMaterial color="#f58a6f" roughness={0.75} />
      </mesh>
      <mesh position={[-0.06, 0.34, 0.316]}>
        <boxGeometry args={[0.5, 0.16, 0.02]} />
        <meshStandardMaterial color="#243454" roughness={0.5} />
      </mesh>
      <mesh position={[-0.06, 0.34, -0.316]}>
        <boxGeometry args={[0.5, 0.16, 0.02]} />
        <meshStandardMaterial color="#243454" roughness={0.5} />
      </mesh>
      {[0.48, -0.43].map((x) => (
        <group key={x} position={[x, -0.18, 0]}>
          {[0.38, -0.38].map((z) => (
            <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.13, 16]} />
              <meshStandardMaterial color="#172036" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
      {[0.22, -0.22].map((z) => (
        <mesh key={z} position={[0.65, 0, z]}>
          <boxGeometry args={[0.03, 0.12, 0.14]} />
          <meshStandardMaterial color="#fff0d3" emissive="#fff0d3" emissiveIntensity={0.16} />
        </mesh>
      ))}

      {hovered && (
        <Html
          center
          position={[0, 1.05, 0]}
          distanceFactor={10}
          className="object-tooltip-anchor"
          style={{ pointerEvents: 'none' }}
        >
          <span className="object-tooltip">Next: {getLocation(nextLocation).shortTitle}</span>
        </Html>
      )}
    </group>
  )
}
