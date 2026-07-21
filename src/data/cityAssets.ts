import type { LocationId } from './locations'

const fromPublic = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const cityAssetPaths: Record<LocationId, string> = {
  plaza: fromPublic('assets/models/plaza-landmark.glb'),
  about: fromPublic('assets/models/developer-studio.glb'),
  projects: fromPublic('assets/models/project-district.glb'),
  services: fromPublic('assets/models/service-garage.glb'),
  lab: fromPublic('assets/models/innovation-lab.glb'),
  contact: fromPublic('assets/models/contact-station.glb'),
}

export const guideAssetPath = fromPublic('assets/models/guide-character.glb')
export const carAssetPath = fromPublic('assets/models/melnyklabs-sports-car.glb')
export const projectAnnexAssetPaths = [
  fromPublic('assets/models/project-district-one.glb'),
  fromPublic('assets/models/project-district-two.glb'),
] as const
export const dracoDecoderPath = fromPublic('draco/')

export const productionAssetPaths = [
  ...Object.values(cityAssetPaths),
  ...projectAnnexAssetPaths,
  guideAssetPath,
  carAssetPath,
]
