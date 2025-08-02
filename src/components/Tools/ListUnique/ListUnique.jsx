import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ListUnique() {
  const navigate = useNavigate()
  const [inputList, setInputList] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (inputList.trim()) {
      uniqueListHandler()
    }
  }, [inputList])

  const parseList = (input) => {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  }

  const uniqueListHandler = () => {
    try {
      const items = parseList(inputList)
      const counts = {}
      
      // Count occurrences
      items.forEach(item => {
        counts[item] = (counts[item] || 0) + 1
      })
      
      // Get unique items (appear exactly once)
      const uniqueItems = items.filter(item => counts[item] === 1)
      
      // Get duplicated items (appear more than once)
      const duplicatedItems = [...new Set(items.filter(item => counts[item] > 1))]
      
      // Get all unique values (deduplicated)
      const allUnique = [...new Set(items)]
      
      setResult({
        original: items,
        uniqueItems, // Items that appear exactly once
        duplicatedItems, // Items that appear more than once
        allUnique, // All items deduplicated
        originalCount: items.length,
        uniqueCount: uniqueItems.length,
        duplicatedCount: duplicatedItems.length,
        allUniqueCount: allUnique.length
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
            ⭐ Unique Items
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)'
        }}>
          $ find items that appear exactly once
        </p>
      </div>

      {/* Input and Results */}
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
            placeholder="Enter items (one per line)&#10;apple&#10;banana&#10;apple&#10;cherry&#10;date&#10;banana"
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
                <span style={{ color: 'var(--text-primary)' }}>Total Items</span>
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
                  {result.uniqueCount}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Duplicated Items</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {result.duplicatedCount}
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
            Unique Items ({result ? result.uniqueCount : 0})
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
                {result.uniqueItems.length === 0 ? (
                  <span style={{ color: 'var(--text-secondary)' }}>No unique items found</span>
                ) : (
                  result.uniqueItems.map((item, index) => (
                    <div key={index} style={{
                      paddingBottom: '0.3rem',
                      borderBottom: index < result.uniqueItems.length - 1 ? '1px solid var(--border-color)' : 'none',
                      marginBottom: '0.3rem',
                      color: 'var(--text-primary)'
                    }}>
                      {item}
                    </div>
                  ))
                )}
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
              Enter a list to find unique items
            </div>
          )}
          
          {result && result.duplicatedItems.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--accent-color)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-mono)'
              }}>
                Items with Duplicates ({result.duplicatedItems.length})
              </h3>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {result.duplicatedItems.map((item, index) => (
                  <div key={index} style={{
                    paddingBottom: '0.3rem',
                    borderBottom: index < result.duplicatedItems.length - 1 ? '1px solid var(--border-color)' : 'none',
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