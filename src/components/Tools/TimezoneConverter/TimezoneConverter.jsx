import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DateTime } from 'luxon'

const MAJOR_ZONES = [
  { name: 'Singapore', flag: '🇸🇬', zone: 'Asia/Singapore' },
  { name: 'India', flag: '🇮🇳', zone: 'Asia/Kolkata' },
  { name: 'Australia', flag: '🇦🇺', zone: 'Australia/Sydney' },
  { name: 'UK', flag: '🇬🇧', zone: 'Europe/London' },
  { name: 'US East', flag: '🇺🇸', zone: 'America/New_York' },
  { name: 'US Central', flag: '🇺🇸', zone: 'America/Chicago' },
  { name: 'US West', flag: '🇺🇸', zone: 'America/Los_Angeles' }
]

export default function TimezoneConverter() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(DateTime.now())
  const [inputTime, setInputTime] = useState('')
  const [selectedZone, setSelectedZone] = useState('America/New_York')
  const [convertedTimes, setConvertedTimes] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (inputTime) {
      convertTime()
    }
  }, [inputTime, selectedZone])

  const convertTime = () => {
    if (!inputTime) return

    try {
      // Parse input time and apply to selected timezone
      const parsedTime = DateTime.fromFormat(inputTime, 'HH:mm', { zone: selectedZone })
      
      if (!parsedTime.isValid) {
        const parsedTime12 = DateTime.fromFormat(inputTime, 'h:mm a', { zone: selectedZone })
        if (!parsedTime12.isValid) return
        
        const converted = MAJOR_ZONES.map(zone => ({
          ...zone,
          time: parsedTime12.setZone(zone.zone).toFormat('HH:mm'),
          time12: parsedTime12.setZone(zone.zone).toFormat('h:mm a')
        }))
        setConvertedTimes(converted)
        return
      }
      
      const converted = MAJOR_ZONES.map(zone => ({
        ...zone,
        time: parsedTime.setZone(zone.zone).toFormat('HH:mm'),
        time12: parsedTime.setZone(zone.zone).toFormat('h:mm a')
      }))
      setConvertedTimes(converted)
    } catch (error) {
      console.error('Time conversion error:', error)
    }
  }

  const getZoneTime = (zone) => {
    return currentTime.setZone(zone)
  }

  const getOffsetFromLocal = (zone) => {
    const local = currentTime
    const zoneTime = currentTime.setZone(zone)
    const diffMinutes = zoneTime.offset - local.offset
    
    if (diffMinutes === 0) return 'same'
    
    const hours = Math.floor(Math.abs(diffMinutes) / 60)
    const minutes = Math.abs(diffMinutes) % 60
    const sign = diffMinutes > 0 ? '+' : '-'
    
    if (minutes === 0) {
      return `${sign}${hours}h`
    }
    return `${sign}${hours}h${minutes}m`
  }

  return (
    <div style={{
      padding: '3rem 2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Header with Back Button */}
      <div style={{
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '1rem'
        }}>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              position: 'absolute',
              left: '2rem'
            }}
          >
            ← back
          </button>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            margin: 0
          }}>
            🌍 Timezone Converter
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)'
        }}>
          $ world clock + time conversion tool
        </p>
      </div>

      {/* Two sections side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* Section 1: World Clock */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)'
          }}>
            World Clock
          </h2>
          
          {/* Current Local Time Card */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              color: 'var(--accent-color)',
              fontFamily: 'var(--font-mono)',
              marginBottom: '0.5rem'
            }}>
              {currentTime.toFormat('HH:mm:ss')}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              marginBottom: '0.3rem'
            }}>
              {currentTime.toFormat('DDD')}
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              📍 {currentTime.zoneName}
            </div>
          </div>

          {/* World Zones List */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}>
            {MAJOR_ZONES.map((zone, index) => {
              const zoneTime = getZoneTime(zone.zone)
              const offset = getOffsetFromLocal(zone.zone)
              
              return (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.5rem',
                  borderBottom: index < MAJOR_ZONES.length - 1 ? '1px solid var(--border-color)' : 'none',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    color: 'var(--text-primary)',
                    minWidth: '80px'
                  }}>
                    {zone.name}
                  </span>
                  <span style={{
                    color: 'var(--accent-color)',
                    fontWeight: 600
                  }}>
                    {zoneTime.toFormat('HH:mm')}
                  </span>
                  <span style={{
                    color: offset === 'same' ? 'var(--accent-color)' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    minWidth: '50px',
                    textAlign: 'right'
                  }}>
                    {offset === 'same' ? 'local' : offset}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 2: Time Converter */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Time Converter
          </h2>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem'
                }}>
                  Time (24h or 12h format)
                </label>
                <input
                  type="text"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                  placeholder="14:00 or 2:00 PM"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem'
                }}>
                  From Timezone
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem'
                  }}
                >
                  {MAJOR_ZONES.map((zone, index) => (
                    <option key={index} value={zone.zone}>
                      {zone.flag} {zone.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {convertedTimes.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                marginBottom: '1rem'
              }}>
                → Converted Times
              </h3>
              
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: 1.6
              }}>
                {convertedTimes.map((zone, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.5rem',
                    borderBottom: index < convertedTimes.length - 1 ? '1px solid var(--border-color)' : 'none',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      color: 'var(--text-primary)',
                      minWidth: '80px'
                    }}>
                      {zone.name}
                    </span>
                    <span style={{
                      color: 'var(--accent-color)',
                      fontWeight: 600
                    }}>
                      {zone.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile responsive: stack on small screens */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          button[style*="position: absolute"] {
            position: static !important;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
    </div>
  )
}