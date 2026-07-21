export function HelpHint({ interactive3d }: { interactive3d: boolean }) {
  if (!interactive3d) {
    return <p className="help-hint"><span>Use navigation to explore</span></p>
  }

  return (
    <p className="help-hint">
      <span>Scroll to explore</span>
      <span>Click buildings to interact</span>
      <span className="zoom-hint">Shift + scroll to zoom</span>
    </p>
  )
}
