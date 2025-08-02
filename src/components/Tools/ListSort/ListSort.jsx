import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ListSort() {
  const navigate = useNavigate()
  const [inputList, setInputList] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (inputList.trim()) {
      sortListHandler()
    }
  }, [inputList])

  const parseList = (input) => {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  }

  const sortListHandler = () => {
    try {
      const items = parseList(inputList)
      
      const ascending = [...items].sort((a, b) => {
        // Try numeric sort first
        const numA = parseFloat(a)
        const numB = parseFloat(b)
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB
        }
        // Fall back to string sort
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
      })
      
      const descending = [...ascending].reverse()
      
      setResult({
        original: items,
        ascending,
        descending,
        itemCount: items.length
      })
    } catch (error) {
      setResult(null)
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
            🔀 List Sorter
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)'
        }}>
          $ sort your list alphabetically or numerically
        </p>
      </div>

      {/* Input and Results */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '2rem'
      }}>
        {/* Input */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Input List
          </h2>
          <textarea
            value={inputList}
            onChange={(e) => setInputList(e.target.value)}
            placeholder="Enter items (one per line)&#10;zebra&#10;apple&#10;banana&#10;10&#10;2&#10;100"
            style={{
              width: '100%',
              height: '400px',
              padding: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              resize: 'vertical'
            }}
          />
          
          {result && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginTop: '1rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Total Items</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  {result.itemCount}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Ascending Sort */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Ascending ↑
          </h2>
          
          {result ? (
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '1rem',
              background: 'var(--bg-primary)',
              height: '400px',
              overflowY: 'auto'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: 1.6
              }}>
                {result.ascending.map((item, index) => (
                  <div key={index} style={{
                    paddingBottom: '0.3rem',
                    borderBottom: index < result.ascending.length - 1 ? '1px solid var(--border-color)' : 'none',
                    marginBottom: '0.3rem',
                    color: 'var(--text-primary)'
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '1rem',
              background: 'var(--bg-primary)',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}>
              Enter a list to see sorted results
            </div>
          )}
        </div>

        {/* Descending Sort */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Descending ↓
          </h2>
          
          {result ? (
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '1rem',
              background: 'var(--bg-primary)',
              height: '400px',
              overflowY: 'auto'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: 1.6
              }}>
                {result.descending.map((item, index) => (
                  <div key={index} style={{
                    paddingBottom: '0.3rem',
                    borderBottom: index < result.descending.length - 1 ? '1px solid var(--border-color)' : 'none',
                    marginBottom: '0.3rem',
                    color: 'var(--text-primary)'
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '1rem',
              background: 'var(--bg-primary)',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}>
              Enter a list to see sorted results
            </div>
          )}
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 1fr 1fr'"] {
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