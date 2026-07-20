const treePositions: [number, number, number][] = [
  [-2.5, 0, -2.3], [2.7, 0, -2.4], [-2.7, 0, 2.3], [2.5, 0, 2.5],
  [-7, 0, 0.8], [7, 0, 0.7], [-1.6, 0, 5.8], [1.8, 0, -6.2],
]

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 1.3, 8]} />
        <meshStandardMaterial color="#735041" roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 1.55, 0]}>
        <dodecahedronGeometry args={[0.72, 0]} />
        <meshStandardMaterial color="#788954" roughness={0.96} />
      </mesh>
    </group>
  )
}

export function CityDetails() {
  return (
    <group>
      {treePositions.map((position) => (
        <Tree key={position.join('-')} position={position} />
      ))}

      <group position={[0.7, 0.38, 4.8]} rotation={[0, -0.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.25, 0.42, 0.72]} />
          <meshStandardMaterial color="#f26b4f" roughness={0.78} />
        </mesh>
        <mesh castShadow position={[0, 0.33, -0.02]}>
          <boxGeometry args={[0.72, 0.28, 0.64]} />
          <meshStandardMaterial color="#f58a6f" roughness={0.75} />
        </mesh>
        {[-0.4, 0.4].map((x) => (
          <group key={x}>
            <mesh position={[x, -0.18, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.12, 16]} />
              <meshStandardMaterial color="#172036" roughness={0.7} />
            </mesh>
            <mesh position={[x, -0.18, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.12, 16]} />
              <meshStandardMaterial color="#172036" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      <group position={[-0.7, 0, 2.2]}>
        <mesh castShadow position={[0, 0.73, 0]}>
          <capsuleGeometry args={[0.22, 0.65, 4, 8]} />
          <meshStandardMaterial color="#e4ad52" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.27, 12, 12]} />
          <meshStandardMaterial color="#9b644a" roughness={0.92} />
        </mesh>
      </group>
    </group>
  )
}
