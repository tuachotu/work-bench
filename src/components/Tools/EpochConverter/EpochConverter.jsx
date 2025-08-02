import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DateTime } from 'luxon'

export default function EpochConverter() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(DateTime.now())
  
  // Section 2: Epoch to Time
  const [inputEpoch, setInputEpoch] = useState('')
  const [epochResult, setEpochResult] = useState(null)
  
  // Section 3: Time to Epoch
  const [inputTime, setInputTime] = useState('')
  const [inputDate, setInputDate] = useState('')
  const [timeResult, setTimeResult] = useState(null)
  
  // Section 4: Epoch Difference
  const [epoch1, setEpoch1] = useState('')
  const [epoch2, setEpoch2] = useState('')
  const [diffResult, setDiffResult] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (inputEpoch) {
      convertEpochToTime()
    }
  }, [inputEpoch])

  useEffect(() => {
    if (inputTime && inputDate) {
      convertTimeToEpoch()
    }
  }, [inputTime, inputDate])

  useEffect(() => {
    if (epoch1 && epoch2) {
      calculateEpochDifference()
    }
  }, [epoch1, epoch2])

  const convertEpochToTime = () => {
    try {
      const epochValue = parseInt(inputEpoch)
      if (isNaN(epochValue)) return
      
      // Handle both seconds and milliseconds
      const timestamp = epochValue.toString().length === 10 ? epochValue * 1000 : epochValue
      const dt = DateTime.fromMillis(timestamp)
      
      if (!dt.isValid) return
      
      setEpochResult({
        utc: dt.toUTC().toFormat('yyyy-MM-dd HH:mm:ss'),
        local: dt.toFormat('yyyy-MM-dd HH:mm:ss'),
        timezone: dt.zoneName
      })
    } catch (error) {
      setEpochResult(null)
    }
  }

  const convertTimeToEpoch = () => {
    try {
      const dateTimeString = `${inputDate} ${inputTime}`
      const dt = DateTime.fromFormat(dateTimeString, 'yyyy-MM-dd HH:mm')
      
      if (!dt.isValid) return
      
      setTimeResult({
        epoch: Math.floor(dt.toMillis() / 1000),
        epochMs: dt.toMillis()
      })
    } catch (error) {
      setTimeResult(null)
    }
  }

  const calculateEpochDifference = () => {
    try {
      const e1 = parseInt(epoch1)
      const e2 = parseInt(epoch2)
      
      if (isNaN(e1) || isNaN(e2)) return
      
      // Handle both seconds and milliseconds
      const ts1 = e1.toString().length === 10 ? e1 * 1000 : e1
      const ts2 = e2.toString().length === 10 ? e2 * 1000 : e2
      
      const dt1 = DateTime.fromMillis(ts1)
      const dt2 = DateTime.fromMillis(ts2)
      
      if (!dt1.isValid || !dt2.isValid) return
      
      const diff = dt2.diff(dt1, ['years', 'months', 'days', 'hours', 'minutes', 'seconds'])
      const diffSeconds = Math.abs(Math.floor((ts2 - ts1) / 1000))
      const diffDays = Math.floor(diffSeconds / 86400)
      
      setDiffResult({
        seconds: diffSeconds,
        days: diffDays,
        formatted: diff.toFormat('y years, M months, d days, h hours, m minutes, s seconds'),
        direction: ts2 > ts1 ? 'later' : 'earlier'
      })
    } catch (error) {
      setDiffResult(null)
    }
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
            ⏰ Epoch Converter
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)'
        }}>
          $ unix timestamp conversion tool
        </p>
      </div>

      {/* Grid layout for 4 sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* Section 1: Current Epoch */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Current Epoch
          </h2>
          
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '0.5rem'
            }}>
              <span style={{ color: 'var(--text-primary)' }}>Epoch (seconds)</span>
              <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                {Math.floor(currentTime.toMillis() / 1000)}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '0.5rem'
            }}>
              <span style={{ color: 'var(--text-primary)' }}>UTC Time</span>
              <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                {currentTime.toUTC().toFormat('yyyy-MM-dd HH:mm:ss')}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-primary)' }}>Local Time</span>
              <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                {currentTime.toFormat('yyyy-MM-dd HH:mm:ss')}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Epoch to Time */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Epoch to Time
          </h2>
          
          <div style={{
            marginBottom: '1.5rem'
          }}>
            <input
              type="text"
              value={inputEpoch}
              onChange={(e) => setInputEpoch(e.target.value)}
              placeholder="1640995200 or 1640995200000"
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

          {epochResult && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>UTC Time</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  {epochResult.utc}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Local Time</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  {epochResult.local}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Time to Epoch */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Time to Epoch
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
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
            <input
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
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

          {timeResult && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Epoch (seconds)</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  {timeResult.epoch}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Epoch (milliseconds)</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  {timeResult.epochMs}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Epoch Difference */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Epoch Difference
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <input
              type="text"
              value={epoch1}
              onChange={(e) => setEpoch1(e.target.value)}
              placeholder="First epoch"
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
            <input
              type="text"
              value={epoch2}
              onChange={(e) => setEpoch2(e.target.value)}
              placeholder="Second epoch"
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

          {diffResult && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Difference</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  {diffResult.seconds} seconds
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Days</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  {diffResult.days} days
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Direction</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  Second is {diffResult.direction}
                </span>
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