export type CityPropPosition = [number, number, number]

export const treePositions: CityPropPosition[] = [
  [-2.5, 0, -2.3], [2.7, 0, -2.4], [-2.7, 0, 2.3], [2.5, 0, 2.5],
  [-8.7, 0, -2.4], [-8.5, 0, 4.4], [-6.4, 0, 6.2], [8.8, 0, 0],
]

export const lampPositions: CityPropPosition[] = Array.from(
  { length: 8 },
  (_, index) => {
    const angle = (index / 8) * Math.PI * 2
    return [Math.sin(angle) * 2.75, 0, Math.cos(angle) * 2.75]
  },
)

export const benchPoses = [
  { position: [1.9, 0.22, 1.15] as CityPropPosition, rotation: -0.55 },
  { position: [-1.9, 0.22, -1.15] as CityPropPosition, rotation: -0.55 },
  { position: [-1.65, 0.22, 1.55] as CityPropPosition, rotation: 0.72 },
  { position: [1.65, 0.22, -1.55] as CityPropPosition, rotation: 0.72 },
]
