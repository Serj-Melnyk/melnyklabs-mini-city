import { RoundedBox } from '@react-three/drei'
import type { CityLocation } from '../data/locations'
import { InteractiveObject } from './InteractiveObject'

type BuildingProps = {
  location: CityLocation
}

export function Building({ location }: BuildingProps) {
  const isPlaza = location.id === 'plaza'

  return (
    <InteractiveObject location={location}>
      {({ isActive, isHovered }) => (
        <>
          <RoundedBox
            args={location.size}
            radius={isPlaza ? 0.35 : 0.16}
            smoothness={3}
            castShadow
            receiveShadow
            scale={isHovered ? 1.025 : 1}
          >
            <meshStandardMaterial
              color={location.color}
              roughness={0.78}
              emissive={location.color}
              emissiveIntensity={isActive || isHovered ? 0.16 : 0}
            />
          </RoundedBox>

          {!isPlaza && (
            <>
              <mesh position={[0, -location.size[1] / 2 + 0.5, location.size[2] / 2 + 0.03]}>
                <boxGeometry args={[0.76, 1, 0.12]} />
                <meshStandardMaterial color="#18233e" roughness={0.5} />
              </mesh>
              <mesh position={[0, location.size[1] / 2 + 0.14, 0]} castShadow>
                <boxGeometry args={[location.size[0] * 0.72, 0.28, location.size[2] * 0.72]} />
                <meshStandardMaterial color="#fff0d3" roughness={0.84} />
              </mesh>
            </>
          )}
        </>
      )}
    </InteractiveObject>
  )
}
