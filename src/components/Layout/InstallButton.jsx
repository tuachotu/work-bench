import { useState } from 'react'
import { usePWAInstall } from '../../hooks/usePWAInstall'

export default function InstallButton() {
  const { isInstallable, isInstalled, install } = usePWAInstall()
  const [isInstalling, setIsInstalling] = useState(false)

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const success = await install()
      if (success) {
        // Installation successful
        console.log('App installed successfully')
      }
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  // Don't show button if not installable or already installed
  if (!isInstallable || isInstalled) {
    return null
  }

  return (
    <button
      className="btn"
      onClick={handleInstall}
      disabled={isInstalling}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'var(--success-color)',
        fontSize: '0.875rem',
        padding: '0.5rem 1rem'
      }}
    >
      {isInstalling ? (
        <>
          <span style={{ 
            display: 'inline-block',
            width: '12px',
            height: '12px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Installing...
        </>
      ) : (
        <>
          📱 Install App
        </>
      )}
    </button>
  )
}