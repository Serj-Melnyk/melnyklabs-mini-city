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
