import { useState, useEffect } from 'react'

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check for standalone mode (iOS Safari)
      if (window.navigator.standalone === true) {
        setIsInstalled(true)
        return
      }
      
      // Check for display-mode: standalone (Android Chrome)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return
      }
      
      // Check for display-mode: fullscreen
      if (window.matchMedia('(display-mode: fullscreen)').matches) {
        setIsInstalled(true)
        return
      }
    }

    checkIfInstalled()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) {
      return false
    }

    try {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error during installation:', error)
      return false
    }
  }

  return {
    isInstallable,
    isInstalled,
    install
  }
}