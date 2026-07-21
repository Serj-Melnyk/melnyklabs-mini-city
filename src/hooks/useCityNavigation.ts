import { useEffect, useRef } from 'react'
import {
  getLocationProgress,
  getNearestLocationId,
} from '../data/cameraRoute'
import { useCityStore } from '../store/useCityStore'

export function useCityNavigation() {
  const navigationRequest = useCityStore((state) => state.navigationRequest)
  const frame = useRef(0)

  useEffect(() => {
    const updateFromScroll = () => {
      frame.current = 0
      const maximumScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      )
      const progress = Math.min(Math.max(window.scrollY / maximumScroll, 0), 1)
      const store = useCityStore.getState()

      store.setScrollProgress(progress)
      store.syncActiveLocation(getNearestLocationId(progress))
    }

    const scheduleUpdate = () => {
      if (!frame.current) {
        frame.current = window.requestAnimationFrame(updateFromScroll)
      }
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })

    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  useEffect(() => {
    if (!navigationRequest) return

    const maximumScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0,
    )
    const progress = getLocationProgress(navigationRequest.id)
    const top = maximumScroll * progress
    const scrollingElement = document.scrollingElement

    useCityStore.getState().setScrollProgress(progress)
    scrollingElement?.scrollTo({ top, behavior: 'auto' })
    useCityStore.getState().completeNavigation(navigationRequest.token)
  }, [navigationRequest])
}
