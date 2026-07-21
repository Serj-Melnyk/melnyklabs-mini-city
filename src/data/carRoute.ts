import { getLocation, locations, type LocationId } from './locations'

export type CarRoutePose = {
  position: [number, number, number]
  forward: [number, number, number]
  rotationY: number
}

export type CarTrip = {
  startProgress: number
  deltaProgress: number
  distance: number
  duration: number
}

export const carRouteConfig = {
  radius: 4.45,
  height: 0.38,
  speed: 4.6,
  minimumDuration: 0.65,
  maximumDuration: 3.2,
}

const fullTurn = Math.PI * 2

export const carNavigationOrder: LocationId[] = locations.map(({ id }) => id)

function wrapProgress(progress: number) {
  return ((progress % 1) + 1) % 1
}

export function sampleCarRoute(progress: number): CarRoutePose {
  const angle = wrapProgress(progress) * fullTurn

  return {
    position: [
      Math.sin(angle) * carRouteConfig.radius,
      carRouteConfig.height,
      Math.cos(angle) * carRouteConfig.radius,
    ],
    forward: [Math.cos(angle), 0, -Math.sin(angle)],
    rotationY: angle,
  }
}

export function getCarStopProgress(id: LocationId) {
  const [x, , z] = getLocation(id).carStop
  return wrapProgress(Math.atan2(x, z) / fullTurn)
}

export function createCarTrip(fromProgress: number, toId: LocationId): CarTrip {
  const startProgress = wrapProgress(fromProgress)
  const targetProgress = getCarStopProgress(toId)
  let deltaProgress = targetProgress - startProgress

  if (deltaProgress > 0.5) deltaProgress -= 1
  if (deltaProgress < -0.5) deltaProgress += 1

  const distance = Math.abs(deltaProgress) * fullTurn * carRouteConfig.radius
  const rawDuration = distance / carRouteConfig.speed
  const duration = distance === 0
    ? 0
    : Math.min(
        Math.max(rawDuration, carRouteConfig.minimumDuration),
        carRouteConfig.maximumDuration,
      )

  return { startProgress, deltaProgress, distance, duration }
}

export function sampleCarTrip(trip: CarTrip, amount: number) {
  const safeAmount = Math.min(Math.max(amount, 0), 1)
  const easedAmount = safeAmount < 0.5
    ? 4 * safeAmount * safeAmount * safeAmount
    : 1 - Math.pow(-2 * safeAmount + 2, 3) / 2
  return wrapProgress(
    trip.startProgress + trip.deltaProgress * easedAmount,
  )
}

export function getNextCarLocation(id: LocationId) {
  const currentIndex = carNavigationOrder.indexOf(id)
  return carNavigationOrder[(currentIndex + 1) % carNavigationOrder.length]
}
