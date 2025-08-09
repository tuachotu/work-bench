import { useTheme } from '../../hooks/useTheme'
import InstallButton from './InstallButton'
import { useState, useEffect } from 'react'

export default function Header({ title = 'work-bench.dev', showBack = false, onBack }) {
  const { theme, toggleTheme } = useTheme()
  const [showNotepad, setShowNotepad] = useState(false)
  const [notepadContent, setNotepadContent] = useState('')

  const saveNotepad = () => {
    const element = document.createElement('a')
    const file = new Blob([notepadContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `notepad-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const takeScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { mediaSource: 'screen' }
      })
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
          a.click()
          URL.revokeObjectURL(url)
        })
        
        stream.getTracks().forEach(track => track.stop())
      })
    } catch (err) {
      alert('Screenshot not available or permission denied')
    }
  }

  const [timeInfo, setTimeInfo] = useState({
    date: '',
    timezone: '',
    currentTime: '',
    unixEpoch: '',
    sunrise: '',
    sunset: '',
    moonrise: '',
    moonset: ''
  })

  useEffect(() => {
    const updateTimeInfo = () => {
      const now = new Date()
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      setTimeInfo({
        date: now.toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        timezone: timeZone,
        currentTime: now.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        unixEpoch: Math.floor(now.getTime() / 1000).toString(),
        sunrise: '06:42', // Placeholder - would need location API
        sunset: '19:18',  // Placeholder - would need location API
        moonrise: '14:23', // Placeholder - would need astronomy API
        moonset: '03:47'   // Placeholder - would need astronomy API
      })
    }

    updateTimeInfo()
    const interval = setInterval(updateTimeInfo, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <header style={{
      background: 'var(--bg-primary)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '70px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          lineHeight: 1.2
        }}>
          <span>{timeInfo.date}</span>
          <span style={{ color: 'var(--accent-color)' }}>{timeInfo.currentTime}</span>
          <span>{timeInfo.timezone}</span>
          <span>↑{timeInfo.sunrise} ↓{timeInfo.sunset}</span>
          <span>🌙↑{timeInfo.moonrise} ↓{timeInfo.moonset}</span>
          <span>epoch: {timeInfo.unixEpoch}</span>
        </div>
        
        {showBack && (
          <button 
            className="btn btn-secondary"
            onClick={onBack}
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '1rem'
            }}
          >
            ← back
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <InstallButton />
        <button 
          className="btn btn-secondary"
          onClick={() => window.location.href = '/notebook'}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem'
          }}
        >
          📓 notebook
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowNotepad(true)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem'
          }}
        >
          📝 notepad
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => window.open('https://excalidraw.com', '_blank')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem'
          }}
        >
          🎨 whiteboard
        </button>
        <button 
          className="btn btn-secondary"
          onClick={takeScreenshot}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem'
          }}
        >
          📸 screenshot
        </button>
        <button 
          className="btn btn-secondary"
          onClick={toggleTheme}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem'
          }}
        >
          {theme === 'light' ? 'dark' : 'light'}
        </button>
      </div>
      
      {showNotepad && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                margin: 0,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.2rem'
              }}>
                📝 Notepad
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={saveNotepad}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  💾 save
                </button>
                <button
                  onClick={() => setShowNotepad(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  ✕ close
                </button>
              </div>
            </div>
            <textarea
              value={notepadContent}
              onChange={(e) => setNotepadContent(e.target.value)}
              placeholder="Start typing your notes here..."
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>
        </div>
      )}
    </header>
  )
}