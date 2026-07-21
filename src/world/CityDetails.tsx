import { Instance, Instances } from '@react-three/drei'
import type { QualityMode } from '../data/quality'

const treePositions: [number, number, number][] = [
  [-2.5, 0, -2.3], [2.7, 0, -2.4], [-2.7, 0, 2.3], [2.5, 0, 2.5],
  [-8.7, 0, -2.4], [-8.5, 0, 4.4], [-6.4, 0, 6.2], [8.8, 0, 0],
]

const lampPositions: [number, number, number][] = Array.from(
  { length: 8 },
  (_, index) => {
    const angle = (index / 8) * Math.PI * 2
    return [Math.sin(angle) * 2.75, 0, Math.cos(angle) * 2.75]
  },
)

const benchPoses = [
  { position: [1.9, 0.22, 1.15] as [number, number, number], rotation: -0.55 },
  { position: [-1.9, 0.22, -1.15] as [number, number, number], rotation: -0.55 },
  { position: [-1.65, 0.22, 1.55] as [number, number, number], rotation: 0.72 },
  { position: [1.65, 0.22, -1.55] as [number, number, number], rotation: 0.72 },
]

export function CityDetails({ qualityMode }: { qualityMode: QualityMode }) {
  const visibleTrees = qualityMode === 'light' ? treePositions.slice(0, 4) : treePositions

  return (
    <group>
      <Instances limit={visibleTrees.length} castShadow={qualityMode === 'full'}>
        <cylinderGeometry args={[0.12, 0.16, 1.3, 8]} />
        <meshStandardMaterial color="#735041" roughness={1} />
        {visibleTrees.map((position) => (
          <Instance
            key={`trunk-${position.join('-')}`}
            position={[position[0], 0.65, position[2]]}
          />
        ))}
      </Instances>

      <Instances limit={visibleTrees.length} castShadow={qualityMode === 'full'}>
        <dodecahedronGeometry args={[0.72, 0]} />
        <meshStandardMaterial color="#788954" roughness={0.96} />
        {visibleTrees.map((position, index) => (
          <Instance
            key={`crown-${position.join('-')}`}
            position={[position[0], 1.55, position[2]]}
            scale={index < 4 ? 0.84 + (index % 3) * 0.06 : 0.72 + (index % 3) * 0.05}
            rotation={[0, index * 0.7, 0]}
          />
        ))}
      </Instances>

      {qualityMode === 'full' && <Instances limit={lampPositions.length} castShadow>
        <cylinderGeometry args={[0.035, 0.055, 1.18, 8]} />
        <meshStandardMaterial color="#243454" roughness={0.76} />
        {lampPositions.map((position) => (
          <Instance
            key={`lamp-${position.join('-')}`}
            position={[position[0], 0.59, position[2]]}
          />
        ))}
      </Instances>}

      {qualityMode === 'full' && <Instances limit={lampPositions.length}>
        <sphereGeometry args={[0.105, 10, 8]} />
        <meshStandardMaterial
          color="#fff0d3"
          emissive="#fff0d3"
          emissiveIntensity={0.24}
          roughness={0.48}
        />
        {lampPositions.map((position) => (
          <Instance
            key={`light-${position.join('-')}`}
            position={[position[0], 1.22, position[2]]}
          />
        ))}
      </Instances>}

      {qualityMode === 'full' && <Instances limit={benchPoses.length} castShadow>
        <boxGeometry args={[1.0, 0.12, 0.38]} />
        <meshStandardMaterial color="#8b5c42" roughness={0.9} />
        {benchPoses.map(({ position, rotation }) => (
          <Instance
            key={`bench-seat-${position.join('-')}`}
            position={position}
            rotation={[0, rotation, 0]}
          />
        ))}
      </Instances>}

      {qualityMode === 'full' && <Instances limit={benchPoses.length} castShadow>
        <boxGeometry args={[1.0, 0.42, 0.1]} />
        <meshStandardMaterial color="#735041" roughness={0.92} />
        {benchPoses.map(({ position, rotation }) => (
          <Instance
            key={`bench-back-${position.join('-')}`}
            position={[position[0], 0.45, position[2] - 0.18]}
            rotation={[0, rotation, 0]}
          />
        ))}
      </Instances>}
    </group>
  )
}
