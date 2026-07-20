type LoadingScreenProps = {
  visible: boolean
}

export function LoadingScreen({ visible }: LoadingScreenProps) {
  return (
    <div className={`loading-screen ${visible ? '' : 'is-hidden'}`} role="status" aria-live="polite">
      <strong>MelnykLabs</strong>
      <div className="loading-line" aria-hidden="true"><span /></div>
      <p>Building the city…</p>
    </div>
  )
}
