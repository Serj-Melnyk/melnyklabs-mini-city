import { getLocation, type LocationId } from './locations'

export type VectorTuple = [number, number, number]

export type CameraStop = {
  id: LocationId | 'overview'
  progress: number
  position: VectorTuple
  target: VectorTuple
}

const locationStop = (id: LocationId, progress: number): CameraStop => {
  const location = getLocation(id)

  return {
    id,
    progress,
    position: location.cameraPosition,
    target: location.cameraTarget,
  }
}

export const cameraRoute: CameraStop[] = [
  locationStop('plaza', 0),
  locationStop('about', 0.15),
  locationStop('projects', 0.35),
  locationStop('services', 0.55),
  locationStop('lab', 0.72),
  locationStop('contact', 0.88),
  {
    id: 'overview',
    progress: 1,
    position: [13, 13, 17],
    target: [0, -1.15, 0],
  },
]

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum)

const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount

const mixTuple = (
  from: VectorTuple,
  to: VectorTuple,
  amount: number,
): VectorTuple => [
  mix(from[0], to[0], amount),
  mix(from[1], to[1], amount),
  mix(from[2], to[2], amount),
]

const smootherStep = (amount: number) =>
  amount * amount * amount * (amount * (amount * 6 - 15) + 10)

export function sampleCameraRoute(progress: number) {
  const safeProgress = clamp(progress, 0, 1)
  const lastStop = cameraRoute[cameraRoute.length - 1]

  if (safeProgress >= lastStop.progress) {
    return { position: lastStop.position, target: lastStop.target }
  }

  const nextIndex = cameraRoute.findIndex(
    (stop) => stop.progress >= safeProgress,
  )
  const nextStop = cameraRoute[Math.max(nextIndex, 1)]
  const previousStop = cameraRoute[Math.max(nextIndex - 1, 0)]
  const segmentLength = nextStop.progress - previousStop.progress
  const segmentProgress = segmentLength
    ? (safeProgress - previousStop.progress) / segmentLength
    : 0
  const easedProgress = smootherStep(clamp(segmentProgress, 0, 1))

  return {
    position: mixTuple(previousStop.position, nextStop.position, easedProgress),
    target: mixTuple(previousStop.target, nextStop.target, easedProgress),
  }
}

export function getLocationProgress(id: LocationId) {
  return cameraRoute.find((stop) => stop.id === id)?.progress ?? 0
}

export function getNearestLocationId(progress: number): LocationId {
  const locationStops = cameraRoute.filter(
    (stop): stop is CameraStop & { id: LocationId } => stop.id !== 'overview',
  )

  return locationStops.reduce((nearest, stop) =>
    Math.abs(stop.progress - progress) < Math.abs(nearest.progress - progress)
      ? stop
      : nearest,
  ).id
}
