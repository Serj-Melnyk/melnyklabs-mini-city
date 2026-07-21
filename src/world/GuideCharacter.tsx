import { Html } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Group, MathUtils, Vector3 } from 'three'
import { getNextCarLocation } from '../data/carRoute'
import {
  createGuideWalk,
  guideMotionConfig,
  guideStops,
  sampleGuideWalk,
} from '../data/guideRoute'
import { getLocation, type LocationId } from '../data/locations'
import { useCityStore } from '../store/useCityStore'

type GuideCharacterProps = {
  reducedMotion: boolean
}

type GuideAnimation = {
  phase: 'walking' | 'pointing'
  elapsed: number
  target: LocationId
  walk: ReturnType<typeof createGuideWalk>
}

const pointTransition = 0.38

export function GuideCharacter({ reducedMotion }: GuideCharacterProps) {
  const root = useRef<Group>(null)
  const body = useRef<Group>(null)
  const head = useRef<Group>(null)
  const leftArm = useRef<Group>(null)
  const rightArm = useRef<Group>(null)
  const leftLeg = useRef<Group>(null)
  const rightLeg = useRef<Group>(null)
  const currentPosition = useRef(new Vector3(...guideStops.plaza.position))
  const animation = useRef<GuideAnimation | null>(null)
  const [hovered, setHovered] = useState(false)
  const { invalidate } = useThree()
  const activeLocation = useCityStore((state) => state.activeLocation)
  const navigationSequence = useCityStore((state) => state.navigationSequence)
  const setGuideState = useCityStore((state) => state.setGuideState)
  const nextLocation = getNextCarLocation(activeLocation)

  const resetLimbs = useCallback(() => {
    if (body.current) body.current.position.y = 0
    if (head.current) head.current.rotation.y = 0
    if (leftArm.current) leftArm.current.rotation.set(0, 0, 0)
    if (rightArm.current) rightArm.current.rotation.set(0, 0, 0)
    if (leftLeg.current) leftLeg.current.rotation.set(0, 0, 0)
    if (rightLeg.current) rightLeg.current.rotation.set(0, 0, 0)
  }, [])

  const applyPointPose = useCallback((target: LocationId) => {
    if (!root.current) return
    const stop = guideStops[target]
    root.current.position.set(...stop.position)
    root.current.rotation.y = createGuideWalk(stop.position, target).targetYaw
    currentPosition.current.set(...stop.position)
    resetLimbs()
    if (rightArm.current) {
      rightArm.current.rotation.x = -1.25
      rightArm.current.rotation.z = -0.18
    }
  }, [resetLimbs])

  const startGuidance = useCallback((target: LocationId) => {
    const walk = createGuideWalk(
      currentPosition.current.toArray() as [number, number, number],
      target,
    )

    if (reducedMotion) {
      animation.current = null
      applyPointPose(target)
      setGuideState('pointing', target)
      invalidate()
      return
    }

    animation.current = {
      phase: walk.duration === 0 ? 'pointing' : 'walking',
      elapsed: 0,
      target,
      walk,
    }
    setGuideState(walk.duration === 0 ? 'pointing' : 'walking', target)
    invalidate()
  }, [applyPointPose, invalidate, reducedMotion, setGuideState])

  useLayoutEffect(() => {
    if (!root.current) return
    root.current.position.set(...guideStops.plaza.position)
  }, [])

  useEffect(() => {
    if (navigationSequence === 0) return
    startGuidance(activeLocation)
  }, [activeLocation, navigationSequence, startGuidance])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default'
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [hovered])

  useFrame((_, delta) => {
    const state = animation.current
    if (!state || !root.current) return

    state.elapsed += delta

    if (state.phase === 'walking') {
      const amount = Math.min(state.elapsed / state.walk.duration, 1)
      const position = sampleGuideWalk(state.walk, amount)
      const stride = Math.sin(amount * Math.PI * 6)

      root.current.position.set(...position)
      root.current.rotation.y = MathUtils.damp(
        root.current.rotation.y,
        state.walk.targetYaw,
        8,
        delta,
      )
      currentPosition.current.set(...position)
      if (body.current) body.current.position.y = Math.abs(stride) * 0.045
      if (leftArm.current) leftArm.current.rotation.x = -stride * 0.48
      if (rightArm.current) rightArm.current.rotation.x = stride * 0.48
      if (leftLeg.current) leftLeg.current.rotation.x = stride * 0.58
      if (rightLeg.current) rightLeg.current.rotation.x = -stride * 0.58

      if (amount >= 1) {
        state.phase = 'pointing'
        state.elapsed = 0
        root.current.position.set(...state.walk.to)
        root.current.rotation.y = state.walk.targetYaw
        currentPosition.current.set(...state.walk.to)
        resetLimbs()
        setGuideState('pointing', state.target)
      }

      invalidate()
      return
    }

    const holdEnd = guideMotionConfig.pointDuration - pointTransition
    const blend = state.elapsed < pointTransition
      ? MathUtils.smoothstep(state.elapsed, 0, pointTransition)
      : state.elapsed > holdEnd
        ? 1 - MathUtils.smoothstep(state.elapsed, holdEnd, guideMotionConfig.pointDuration)
        : 1

    if (rightArm.current) {
      rightArm.current.rotation.x = -1.25 * blend
      rightArm.current.rotation.z = -0.18 * blend
    }
    if (head.current) head.current.rotation.y = -0.12 * blend

    if (state.elapsed >= guideMotionConfig.pointDuration) {
      const target = state.target
      animation.current = null
      resetLimbs()
      setGuideState('idle', target)
      return
    }

    invalidate()
  })

  useEffect(
    () => () => {
      animation.current = null
    },
    [],
  )

  const showNextDirection = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    setHovered(false)
    startGuidance(nextLocation)
  }

  return (
    <group
      ref={root}
      scale={hovered ? 1.05 : 1}
      onClick={showNextDirection}
      onPointerEnter={(event) => {
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerLeave={() => {
        setHovered(false)
      }}
    >
      <group ref={body}>
        <mesh castShadow position={[0, 0.96, 0]}>
          <capsuleGeometry args={[0.22, 0.52, 4, 8]} />
          <meshStandardMaterial color="#e4ad52" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 1.08, 0.16]}>
          <boxGeometry args={[0.3, 0.26, 0.08]} />
          <meshStandardMaterial color="#f26b4f" roughness={0.86} />
        </mesh>
      </group>

      <group ref={head} position={[0, 1.52, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#9b644a" roughness={0.92} />
        </mesh>
        <mesh position={[0, 0.02, 0.22]}>
          <boxGeometry args={[0.24, 0.08, 0.08]} />
          <meshStandardMaterial color="#2a2430" roughness={0.8} />
        </mesh>
      </group>

      <group ref={leftArm} position={[-0.29, 1.17, 0]}>
        <mesh castShadow position={[0, -0.24, 0]}>
          <capsuleGeometry args={[0.075, 0.34, 4, 8]} />
          <meshStandardMaterial color="#e4ad52" roughness={0.9} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.29, 1.17, 0]}>
        <mesh castShadow position={[0, -0.24, 0]}>
          <capsuleGeometry args={[0.075, 0.34, 4, 8]} />
          <meshStandardMaterial color="#e4ad52" roughness={0.9} />
        </mesh>
      </group>

      <group ref={leftLeg} position={[-0.12, 0.58, 0]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.09, 0.34, 4, 8]} />
          <meshStandardMaterial color="#243454" roughness={0.9} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.12, 0.58, 0]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.09, 0.34, 4, 8]} />
          <meshStandardMaterial color="#243454" roughness={0.9} />
        </mesh>
      </group>

      {hovered && (
        <Html
          center
          position={[0, 2.08, 0]}
          distanceFactor={10}
          className="object-tooltip-anchor"
          style={{ pointerEvents: 'none' }}
        >
          <span className="object-tooltip">Point to {getLocation(nextLocation).shortTitle}</span>
        </Html>
      )}
    </group>
  )
}
