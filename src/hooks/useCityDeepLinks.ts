import { useEffect, useRef } from 'react'
import { getLocationHash, parseLocationHash } from '../data/locationHash'
import { useCityStore } from '../store/useCityStore'

export function useCityDeepLinks() {
  const navigationRequest = useCityStore((state) => state.navigationRequest)
  const isHistoryNavigation = useRef(false)

  useEffect(() => {
    const navigateFromHash = (includeRoot = true) => {
      const locationId = parseLocationHash(window.location.hash)

      if (!locationId && (!includeRoot || window.location.hash)) return

      isHistoryNavigation.current = true
      useCityStore.getState().setActiveLocation(locationId ?? 'plaza')
    }

    navigateFromHash(false)
    const handleHashChange = () => navigateFromHash()
    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (!navigationRequest) return

    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false
      return
    }

    const nextHash = getLocationHash(navigationRequest.id)
    if (window.location.hash === nextHash) return

    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`
    window.history.pushState({ cityLocation: navigationRequest.id }, '', nextUrl)
  }, [navigationRequest])
}
