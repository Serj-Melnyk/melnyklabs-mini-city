import { Html, useGLTF } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Box3, Group, Vector3 } from 'three'
import {
  createCarTrip,
  getCarTripDuration,
  getCarStopProgress,
  getNextCarLocation,
  sampleCarRoute,
  sampleCarTrip,
} from '../data/carRoute'
import { getLocation, type LocationId } from '../data/locations'
import { carAssetPath } from '../data/cityAssets'
import { carRuntime } from '../scene/carRuntime'
import { useCityStore } from '../store/useCityStore'
import { cloneModel } from './modelUtils'
import type { QualityMode } from '../data/quality'

type NavigationCarProps = {
  qualityMode: QualityMode
  reducedMotion: boolean
}

const localForward = new Vector3()

export function NavigationCar({ qualityMode, reducedMotion }: NavigationCarProps) {
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
  const { scene: carSource } = useGLTF(carAssetPath)
  const carModel = useMemo(() => {
    const model = cloneModel(carSource)
    const bounds = new Box3().setFromObject(model)
    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    const scale = 1.48 / Math.max(size.x, size.z)

    model.position.set(-center.x, -bounds.min.y, -center.z)
    return { model, scale }
  }, [carSource])

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
    const duration = getCarTripDuration(state.trip, qualityMode === 'light')
    const amount = Math.min(state.elapsed / duration, 1)
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
      <group
        position={[0, -0.32, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={carModel.scale}
      >
        <primitive object={carModel.model} />
      </group>

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

useGLTF.preload(carAssetPath)
