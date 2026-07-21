import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { Color } from 'three'
import {
  cityAssetPaths,
  dracoDecoderPath,
  projectAnnexAssetPaths,
} from '../data/cityAssets'
import type { CityLocation } from '../data/locations'
import { InteractiveObject } from './InteractiveObject'
import { cloneModel, forEachStandardMaterial } from './modelUtils'

type BuildingProps = {
  assetPath?: string
  location: CityLocation
}

export function Building({ assetPath, location }: BuildingProps) {
  const modelPath = assetPath ?? cityAssetPaths[location.id]
  const { scene } = useGLTF(modelPath, dracoDecoderPath)
  const model = useMemo(() => cloneModel(scene), [scene])

  return (
    <InteractiveObject location={location}>
      {({ isActive, isHovered }) => (
        <ProductionBuildingModel
          active={isActive}
          hovered={isHovered}
          model={model}
          scale={location.modelScale ?? 1}
        />
      )}
    </InteractiveObject>
  )
}

function ProductionBuildingModel({
  active,
  hovered,
  model,
  scale,
}: {
  active: boolean
  hovered: boolean
  model: ReturnType<typeof cloneModel>
  scale: number
}) {
  useEffect(() => {
    forEachStandardMaterial(model, (material) => {
      if (!material.userData.baseEmissive) {
        material.userData.baseEmissive = material.emissive.getHex()
        material.userData.baseEmissiveIntensity = material.emissiveIntensity
      }

      const highlighted = active || hovered
      material.emissive = highlighted
        ? new Color(material.color).multiplyScalar(0.72)
        : new Color(material.userData.baseEmissive)
      material.emissiveIntensity = highlighted
        ? 0.18
        : material.userData.baseEmissiveIntensity
      material.needsUpdate = true
    })
  }, [active, hovered, model])

  return (
    <group scale={scale * (hovered ? 1.025 : 1)}>
      <primitive object={model} />
    </group>
  )
}

Object.values(cityAssetPaths).forEach((path) => useGLTF.preload(path, dracoDecoderPath))
projectAnnexAssetPaths.forEach((path) => useGLTF.preload(path, dracoDecoderPath))
