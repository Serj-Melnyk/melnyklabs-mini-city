import { carRouteConfig, sampleCarRoute } from '../data/carRoute'
import { buildingLocations } from '../data/locations'

const roadMarkers = Array.from({ length: 24 }, (_, index) =>
  sampleCarRoute(index / 24),
)

const crosswalkMarkers = [-0.55, 0.64].flatMap((angle, crosswalkIndex) =>
  Array.from({ length: 6 }, (_, stripeIndex) => {
    const offset = -0.75 + stripeIndex * 0.3
    const radius = 5.52

    return {
      id: `${crosswalkIndex}-${stripeIndex}`,
      position: [
        Math.sin(angle) * radius + Math.cos(angle) * offset,
        0.095,
        Math.cos(angle) * radius - Math.sin(angle) * offset,
      ] as [number, number, number],
      rotationY: angle,
    }
  }),
)

const roadOuterRadius = carRouteConfig.roadOuterRadius

const driveways = buildingLocations.map((location, index) => {
  const buildingRadius = Math.hypot(location.position[0], location.position[2])
  const buildingHalfDepth = Math.min(location.size[0], location.size[2]) / 2
  const outerEdge = buildingRadius - buildingHalfDepth - 0.24
  const length = Math.max(outerEdge - roadOuterRadius, 0.28)
  const centerRadius = roadOuterRadius + length / 2
  const angle = Math.atan2(location.position[0], location.position[2])

  return {
    id: `${location.id}-${index}`,
    length,
    position: [
      Math.sin(angle) * centerRadius,
      0.08,
      Math.cos(angle) * centerRadius,
    ] as [number, number, number],
    rotationY: angle,
  }
})

export function CityGround() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.52, 0]}>
        <cylinderGeometry args={[10.22, 10.35, 0.32, 10]} />
        <meshStandardMaterial color="#3d4565" roughness={0.97} />
      </mesh>
      <mesh receiveShadow position={[0, -0.25, 0]}>
        <cylinderGeometry args={[10.1, 10.4, 0.5, 10]} />
        <meshStandardMaterial color="#5e607f" roughness={0.95} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.35, roadOuterRadius, 64]} />
        <meshStandardMaterial color="#777994" roughness={0.94} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <circleGeometry args={[3.05, 64]} />
        <meshStandardMaterial color="#b1a9bd" roughness={0.96} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]}>
        <ringGeometry args={[3.12, 3.34, 64]} />
        <meshStandardMaterial color="#d6c9bd" roughness={0.96} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.052, 0]}>
        <ringGeometry args={[roadOuterRadius, 5.47, 64]} />
        <meshStandardMaterial color="#d6c9bd" roughness={0.96} />
      </mesh>
      {buildingLocations.map((location, index) => (
        <mesh
          key={`green-bed-${location.id}-${index}`}
          receiveShadow
          position={[location.position[0], 0.025, location.position[2]]}
          rotation={[0, location.rotationY, 0]}
        >
          <boxGeometry args={[location.size[0] + 0.92, 0.08, location.size[2] + 0.92]} />
          <meshStandardMaterial color="#77805d" roughness={0.99} />
        </mesh>
      ))}
      {buildingLocations.map((location, index) => (
        <mesh
          key={`sidewalk-${location.id}-${index}`}
          receiveShadow
          position={[location.position[0], 0.055, location.position[2]]}
          rotation={[0, location.rotationY, 0]}
        >
          <boxGeometry args={[location.size[0] + 0.48, 0.11, location.size[2] + 0.48]} />
          <meshStandardMaterial color="#aaa4b3" roughness={0.98} />
        </mesh>
      ))}
      {driveways.map((driveway) => (
        <mesh
          key={`driveway-${driveway.id}`}
          receiveShadow
          position={driveway.position}
          rotation={[0, driveway.rotationY, 0]}
        >
          <boxGeometry args={[1.3, 0.1, driveway.length]} />
          <meshStandardMaterial color="#777994" roughness={0.96} />
        </mesh>
      ))}
      {roadMarkers.map((pose, index) => (
        <mesh
          key={index}
          receiveShadow
          position={[pose.position[0], 0.065, pose.position[2]]}
          rotation={[0, pose.rotationY, 0]}
        >
          <boxGeometry args={[0.46, 0.025, 0.055]} />
          <meshStandardMaterial color="#d9d0c5" roughness={0.95} />
        </mesh>
      ))}
      {crosswalkMarkers.map((marker) => (
        <mesh
          key={`crosswalk-${marker.id}`}
          receiveShadow
          position={marker.position}
          rotation={[0, marker.rotationY, 0]}
        >
          <boxGeometry args={[0.18, 0.025, 0.72]} />
          <meshStandardMaterial color="#e3d9ce" roughness={0.96} />
        </mesh>
      ))}
    </group>
  )
}
