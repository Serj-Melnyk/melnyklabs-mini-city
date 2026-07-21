import { useEffect, useState } from 'react'
import { selectQualityMode, type QualityMode } from '../data/quality'

type NavigatorWithCapabilities = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

function readQualityMode(): QualityMode {
  const query = new URLSearchParams(window.location.search)
  const navigatorWithCapabilities = navigator as NavigatorWithCapabilities

  return selectQualityMode({
    width: window.innerWidth,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigatorWithCapabilities.deviceMemory,
    saveData: navigatorWithCapabilities.connection?.saveData,
    override: query.get('quality'),
  })
}

export function useDeviceQuality() {
  const [qualityMode, setQualityMode] = useState<QualityMode>(() => readQualityMode())

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: coarse)')
    const update = () => setQualityMode(readQualityMode())

    window.addEventListener('resize', update, { passive: true })
    pointerQuery.addEventListener('change', update)

    return () => {
      window.removeEventListener('resize', update)
      pointerQuery.removeEventListener('change', update)
    }
  }, [])

  return qualityMode
}
