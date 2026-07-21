import { locations } from '../data/locations'
import { Building } from '../world/Building'
import { CityDetails } from '../world/CityDetails'
import { CityGround } from '../world/CityGround'
import { NavigationCar } from '../world/NavigationCar'
import { Lighting } from './Lighting'

type CitySceneProps = {
  reducedMotion: boolean
}

export function CityScene({ reducedMotion }: CitySceneProps) {
  return (
    <>
      <color attach="background" args={['#07142b']} />
      <fog attach="fog" args={['#07142b', 20, 35]} />
      <Lighting />
      <group rotation={[0, -0.15, 0]} position={[0, -0.5, 0]}>
        <CityGround />
        {locations.map((location) => (
          <Building key={location.id} location={location} />
        ))}
        <NavigationCar reducedMotion={reducedMotion} />
        <CityDetails />
      </group>
    </>
  )
}
