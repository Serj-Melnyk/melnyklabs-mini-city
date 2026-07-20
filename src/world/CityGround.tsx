export function CityGround() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.25, 0]}>
        <cylinderGeometry args={[9.4, 9.7, 0.5, 8]} />
        <meshStandardMaterial color="#5e607f" roughness={0.95} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.1, 5.7, 64]} />
        <meshStandardMaterial color="#777994" roughness={0.94} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <circleGeometry args={[3.05, 64]} />
        <meshStandardMaterial color="#b1a9bd" roughness={0.96} />
      </mesh>
    </group>
  )
}
