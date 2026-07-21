/* eslint-disable react-hooks/immutability -- R3F cameras are intentionally mutated inside useFrame. */
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Spherical, Vector3 } from 'three'
import { sampleCameraRoute } from '../data/cameraRoute'
import { useCityStore } from '../store/useCityStore'
import { carRuntime } from './carRuntime'

type CameraControllerProps = {
  reducedMotion: boolean
}

const horizontalLookLimit = MathUtils.degToRad(12)
const verticalLookLimit = MathUtils.degToRad(6)

export function CameraController({ reducedMotion }: CameraControllerProps) {
  const { camera, invalidate } = useThree()
  const lookTarget = useRef(new Vector3())
  const desiredPosition = useRef(new Vector3())
  const desiredTarget = useRef(new Vector3())
  const offset = useRef(new Vector3())
  const spherical = useRef(new Spherical())
  const pointer = useRef({ x: 0, y: 0 })

  useLayoutEffect(() => {
    const initial = sampleCameraRoute(useCityStore.getState().scrollProgress)
    camera.position.set(...initial.position)
    lookTarget.current.set(...initial.target)
    camera.lookAt(lookTarget.current)
    invalidate()
  }, [camera, invalidate])

  useEffect(
    () =>
      useCityStore.subscribe((state, previousState) => {
        if (
          state.scrollProgress !== previousState.scrollProgress ||
          state.carStatus !== previousState.carStatus
        ) {
          invalidate()
        }
      }),
    [invalidate],
  )

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType !== 'mouse') return

      pointer.current.x = MathUtils.clamp(
        (event.clientX / window.innerWidth) * 2 - 1,
        -1,
        1,
      )
      pointer.current.y = MathUtils.clamp(
        -((event.clientY / window.innerHeight) * 2 - 1),
        -1,
        1,
      )
      invalidate()
    }

    const resetPointer = () => {
      pointer.current.x = 0
      pointer.current.y = 0
      invalidate()
    }

    window.addEventListener('pointermove', updatePointer, { passive: true })
    document.documentElement.addEventListener('mouseleave', resetPointer)

    return () => {
      window.removeEventListener('pointermove', updatePointer)
      document.documentElement.removeEventListener('mouseleave', resetPointer)
    }
  }, [invalidate, reducedMotion])

  useFrame((_, delta) => {
    const cityState = useCityStore.getState()
    const followsCar =
      !reducedMotion &&
      cityState.carStatus === 'driving' &&
      carRuntime.isTraveling

    if (followsCar) {
      desiredTarget.current.copy(carRuntime.position)
      desiredTarget.current.y += 0.55
      desiredPosition.current.copy(carRuntime.position)
      desiredPosition.current.addScaledVector(carRuntime.forward, -4.8)
      desiredPosition.current.y += 3.5
    } else {
      const route = sampleCameraRoute(cityState.scrollProgress)
      desiredTarget.current.set(...route.target)
      desiredPosition.current.set(...route.position)
    }

    offset.current.copy(desiredPosition.current).sub(desiredTarget.current)
    spherical.current.setFromVector3(offset.current)

    if (!reducedMotion) {
      spherical.current.theta += pointer.current.x * horizontalLookLimit
      spherical.current.phi = MathUtils.clamp(
        spherical.current.phi - pointer.current.y * verticalLookLimit,
        0.2,
        Math.PI - 0.2,
      )
    }

    offset.current.setFromSpherical(spherical.current)
    desiredPosition.current.copy(desiredTarget.current).add(offset.current)

    const damping = reducedMotion ? 1000 : 5.5
    camera.position.x = MathUtils.damp(
      camera.position.x,
      desiredPosition.current.x,
      damping,
      delta,
    )
    camera.position.y = MathUtils.damp(
      camera.position.y,
      desiredPosition.current.y,
      damping,
      delta,
    )
    camera.position.z = MathUtils.damp(
      camera.position.z,
      desiredPosition.current.z,
      damping,
      delta,
    )
    lookTarget.current.x = MathUtils.damp(
      lookTarget.current.x,
      desiredTarget.current.x,
      damping,
      delta,
    )
    lookTarget.current.y = MathUtils.damp(
      lookTarget.current.y,
      desiredTarget.current.y,
      damping,
      delta,
    )
    lookTarget.current.z = MathUtils.damp(
      lookTarget.current.z,
      desiredTarget.current.z,
      damping,
      delta,
    )
    camera.lookAt(lookTarget.current)

    const positionDistance = camera.position.distanceTo(desiredPosition.current)
    const targetDistance = lookTarget.current.distanceTo(desiredTarget.current)

    if (!reducedMotion && positionDistance + targetDistance > 0.002) {
      invalidate()
    }
  })

  return null
}
