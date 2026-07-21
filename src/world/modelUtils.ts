import {
  Mesh,
  MeshStandardMaterial,
  Object3D,
  type Material,
} from 'three'

function cloneMaterial(material: Material) {
  return material.clone()
}

export function cloneModel(source: Object3D) {
  const clone = source.clone(true)

  clone.traverse((object) => {
    if (!(object instanceof Mesh)) return
    object.castShadow = true
    object.receiveShadow = true
    object.material = Array.isArray(object.material)
      ? object.material.map(cloneMaterial)
      : cloneMaterial(object.material)
  })

  return clone
}

export function forEachStandardMaterial(
  source: Object3D,
  callback: (material: MeshStandardMaterial, mesh: Mesh) => void,
) {
  source.traverse((object) => {
    if (!(object instanceof Mesh)) return
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material]

    materials.forEach((material) => {
      if (material instanceof MeshStandardMaterial) callback(material, object)
    })
  })
}
