import { useEffect } from 'react'
import { locations } from '../data/locations'
import { Building } from '../world/Building'
import { CityDetails } from '../world/CityDetails'
import { CityGround } from '../world/CityGround'
import { NavigationCar } from '../world/NavigationCar'
import { GuideCharacter } from '../world/GuideCharacter'
import { Lighting } from './Lighting'
import type { QualityMode } from '../data/quality'

type CitySceneProps = {
  onReady: () => void
  qualityMode: QualityMode
  reducedMotion: boolean
}

export function CityScene({ onReady, qualityMode, reducedMotion }: CitySceneProps) {
  useEffect(() => {
    onReady()
  }, [onReady])

  return (
    <>
      <color attach="background" args={['#07142b']} />
      <fog attach="fog" args={['#07142b', 28, 45]} />
      <Lighting qualityMode={qualityMode} />
      <group rotation={[0, -0.15, 0]} position={[0, -0.5, 0]}>
        <CityGround />
        {locations.map((location) => (
          <Building key={location.id} location={location} />
        ))}
        <NavigationCar qualityMode={qualityMode} reducedMotion={reducedMotion} />
        {qualityMode === 'full' && <GuideCharacter reducedMotion={reducedMotion} />}
        <CityDetails qualityMode={qualityMode} />
      </group>
    </>
  )
}
