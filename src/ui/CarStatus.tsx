import { getLocation } from '../data/locations'
import { useCityStore } from '../store/useCityStore'

export function CarStatus() {
  const carStatus = useCityStore((state) => state.carStatus)
  const destination = useCityStore((state) => state.carDestination)

  if (carStatus === 'idle') return null

  const location = getLocation(destination)
  const message = carStatus === 'driving'
    ? `Navigation car is travelling to ${location.title}.`
    : `Navigation car arrived at ${location.title}.`

  return (
    <p className="sr-only" role="status" aria-live="polite">
      {message}
    </p>
  )
}
