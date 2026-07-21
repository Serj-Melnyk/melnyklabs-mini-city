import type { LocationId } from './locations'

export type VectorTuple = [number, number, number]

export type GuideStop = {
  position: VectorTuple
  pointTarget: VectorTuple
}

export type GuideWalk = {
  from: VectorTuple
  to: VectorTuple
  distance: number
  duration: number
  targetYaw: number
}

export const guideMotionConfig = {
  speed: 1.7,
  minimumDuration: 0.65,
  maximumDuration: 1.55,
  pointDuration: 2.15,
}

export const guideStops: Record<LocationId, GuideStop> = {
  plaza: {
    position: [-0.7, 0, 2.2],
    pointTarget: [0, 0.35, 0],
  },
  about: {
    position: [-1.35, 0, -1.2],
    pointTarget: [0, 1.1, -4.6],
  },
  projects: {
    position: [1.45, 0, -0.8],
    pointTarget: [5, 1, -1.8],
  },
  services: {
    position: [1.45, 0, 1.15],
    pointTarget: [5.2, 0.9, 3.8],
  },
  lab: {
    position: [-1.35, 0, 1.25],
    pointTarget: [-4.8, 0.8, 3.5],
  },
  contact: {
    position: [-1.5, 0, -0.65],
    pointTarget: [-5, 1, -2.3],
  },
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum)

const easeInOutCubic = (amount: number) =>
  amount < 0.5
    ? 4 * amount * amount * amount
    : 1 - Math.pow(-2 * amount + 2, 3) / 2

export function getGuideYaw(id: LocationId) {
  const stop = guideStops[id]
  const x = stop.pointTarget[0] - stop.position[0]
  const z = stop.pointTarget[2] - stop.position[2]
  return Math.atan2(x, z)
}

export function createGuideWalk(from: VectorTuple, toId: LocationId): GuideWalk {
  const to = guideStops[toId].position
  const distance = Math.hypot(
    to[0] - from[0],
    to[1] - from[1],
    to[2] - from[2],
  )
  const duration = distance === 0
    ? 0
    : clamp(
        distance / guideMotionConfig.speed,
        guideMotionConfig.minimumDuration,
        guideMotionConfig.maximumDuration,
      )

  return {
    from: [...from],
    to: [...to],
    distance,
    duration,
    targetYaw: getGuideYaw(toId),
  }
}

export function sampleGuideWalk(walk: GuideWalk, amount: number): VectorTuple {
  const safeAmount = clamp(amount, 0, 1)
  if (safeAmount === 0) return [...walk.from]
  if (safeAmount === 1) return [...walk.to]

  const eased = easeInOutCubic(safeAmount)
  return [
    walk.from[0] + (walk.to[0] - walk.from[0]) * eased,
    walk.from[1] + (walk.to[1] - walk.from[1]) * eased,
    walk.from[2] + (walk.to[2] - walk.from[2]) * eased,
  ]
}
