import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ListDedup() {
  const navigate = useNavigate()
  const [inputList, setInputList] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (inputList.trim()) {
      dedupListHandler()
    }
  }, [inputList])

  const parseList = (input) => {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  }

  const dedupListHandler = () => {
    try {
      const items = parseList(inputList)
      const duplicates = []
      const seen = new Set()
      const unique = []
      
      items.forEach(item => {
        if (seen.has(item)) {
          if (!duplicates.includes(item)) {
            duplicates.push(item)
          }
        } else {
          seen.add(item)
          unique.push(item)
        }
      })
      
      setResult({
        original: items,
        deduplicated: unique,
        duplicates,
        originalCount: items.length,
        deduplicatedCount: unique.length,
        removedCount: items.length - unique.length
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
            🔄 List Deduplicator
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)'
        }}>
          $ remove duplicate items from your list
        </p>
      </div>

      {/* Input and Results side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem'
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
            placeholder="Enter items (one per line)&#10;apple&#10;banana&#10;apple&#10;cherry&#10;banana"
            style={{
              width: '100%',
              height: '300px',
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
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Original Items</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  {result.originalCount}
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
                <span style={{ color: 'var(--text-primary)' }}>Unique Items</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  {result.deduplicatedCount}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Removed</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {result.removedCount}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Deduplicated List
          </h2>
          
          {result ? (
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '1rem',
              background: 'var(--bg-primary)',
              height: '300px',
              overflowY: 'auto'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: 1.6
              }}>
                {result.deduplicated.map((item, index) => (
                  <div key={index} style={{
                    paddingBottom: '0.3rem',
                    borderBottom: index < result.deduplicated.length - 1 ? '1px solid var(--border-color)' : 'none',
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
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}>
              Enter a list to see deduplicated results
            </div>
          )}
          
          {result && result.duplicates.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--accent-color)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-mono)'
              }}>
                Duplicate Items Found ({result.duplicates.length})
              </h3>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {result.duplicates.map((item, index) => (
                  <div key={index} style={{
                    paddingBottom: '0.3rem',
                    borderBottom: index < result.duplicates.length - 1 ? '1px solid var(--border-color)' : 'none',
                    marginBottom: '0.3rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile responsive */}
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