import { usePWAInstall } from '../../hooks/usePWAInstall'

export default function InstallInstructions() {
  const { isInstalled, isInstallable } = usePWAInstall()

  // Show installed message as one-liner
  if (isInstalled) {
    return (
      <div style={{
        color: 'var(--success-color)',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-mono)'
      }}>
        ✅ App installed! Access from home screen or app drawer.
      </div>
    )
  }

  // Don't show manual instructions if auto-install is available
  if (isInstallable) {
    return null
  }

  return (
    <div style={{
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
      fontFamily: 'var(--font-mono)'
    }}>
      📱 Install: Chrome/Edge (address bar icon) • Safari (Share → Add to Home Screen) • Mobile (Menu → Add to Home Screen)
    </div>
  )
}