import { getLocation } from '../data/locations'
import { useCityStore } from '../store/useCityStore'

export function GuideStatus() {
  const status = useCityStore((state) => state.guideStatus)
  const target = useCityStore((state) => state.guideTarget)

  if (status === 'idle') return null

  const location = getLocation(target)
  const message = status === 'walking'
    ? `City guide is walking to a viewpoint for ${location.title}.`
    : `City guide points toward ${location.title}. Use the ${location.navLabel} navigation button to open it.`

  return (
    <p className="sr-only" role="status" aria-live="polite">
      {message}
    </p>
  )
}
