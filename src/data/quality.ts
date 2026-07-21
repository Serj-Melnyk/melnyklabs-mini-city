export type QualityMode = 'full' | 'light'

export type QualitySignals = {
  width: number
  coarsePointer: boolean
  hardwareConcurrency?: number
  deviceMemory?: number
  saveData?: boolean
  override?: string | null
}

export function selectQualityMode({
  width,
  coarsePointer,
  hardwareConcurrency,
  deviceMemory,
  saveData,
  override,
}: QualitySignals): QualityMode {
  if (override === 'full' || override === 'light') return override

  const constrainedHardware =
    (hardwareConcurrency !== undefined && hardwareConcurrency <= 4) ||
    (deviceMemory !== undefined && deviceMemory <= 4)

  return width <= 820 || coarsePointer || constrainedHardware || saveData
    ? 'light'
    : 'full'
}
