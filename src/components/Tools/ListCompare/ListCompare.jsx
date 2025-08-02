import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ListCompare() {
  const navigate = useNavigate()
  const [list1, setList1] = useState('')
  const [list2, setList2] = useState('')
  const [results, setResults] = useState(null)

  useEffect(() => {
    if (list1.trim() && list2.trim()) {
      compareListsHandler()
    }
  }, [list1, list2])

  const parseList = (input) => {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  }

  const compareListsHandler = () => {
    try {
      const arr1 = parseList(list1)
      const arr2 = parseList(list2)
      
      const set1 = new Set(arr1)
      const set2 = new Set(arr2)
      
      const onlyInFirst = arr1.filter(item => !set2.has(item))
      const onlyInSecond = arr2.filter(item => !set1.has(item))
      const inBoth = arr1.filter(item => set2.has(item))
      const allElements = [...new Set([...arr1, ...arr2])]
      
      setResults({
        onlyInFirst: [...new Set(onlyInFirst)],
        onlyInSecond: [...new Set(onlyInSecond)],
        inBoth: [...new Set(inBoth)],
        allElements
      })
    } catch (error) {
      setResults(null)
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
            📋 List Compare
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)'
        }}>
          $ compare two lists and find differences
        </p>
      </div>

      {/* Input sections side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* List 1 Input */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-mono)'
          }}>
            List 1
          </h2>
          <textarea
            value={list1}
            onChange={(e) => setList1(e.target.value)}
            placeholder="Enter items (one per line)&#10;apple&#10;banana&#10;cherry"
            style={{
              width: '100%',
              height: '200px',
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
        </div>

        {/* List 2 Input */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-mono)'
          }}>
            List 2
          </h2>
          <textarea
            value={list2}
            onChange={(e) => setList2(e.target.value)}
            placeholder="Enter items (one per line)&#10;banana&#10;date&#10;elderberry"
            style={{
              width: '100%',
              height: '200px',
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
        </div>
      </div>

      {/* Results sections */}
      {results && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem'
        }}>
          {/* Only in First */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--accent-color)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)'
            }}>
              Only in List 1 ({results.onlyInFirst.length})
            </h3>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {results.onlyInFirst.length === 0 ? (
                <span style={{ color: 'var(--text-secondary)' }}>No unique items</span>
              ) : (
                results.onlyInFirst.map((item, index) => (
                  <div key={index} style={{
                    paddingBottom: '0.3rem',
                    borderBottom: index < results.onlyInFirst.length - 1 ? '1px solid var(--border-color)' : 'none',
                    marginBottom: '0.3rem',
                    color: 'var(--text-primary)'
                  }}>
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Only in Second */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--accent-color)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)'
            }}>
              Only in List 2 ({results.onlyInSecond.length})
            </h3>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {results.onlyInSecond.length === 0 ? (
                <span style={{ color: 'var(--text-secondary)' }}>No unique items</span>
              ) : (
                results.onlyInSecond.map((item, index) => (
                  <div key={index} style={{
                    paddingBottom: '0.3rem',
                    borderBottom: index < results.onlyInSecond.length - 1 ? '1px solid var(--border-color)' : 'none',
                    marginBottom: '0.3rem',
                    color: 'var(--text-primary)'
                  }}>
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* In Both */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--accent-color)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)'
            }}>
              In Both Lists ({results.inBoth.length})
            </h3>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {results.inBoth.length === 0 ? (
                <span style={{ color: 'var(--text-secondary)' }}>No common items</span>
              ) : (
                results.inBoth.map((item, index) => (
                  <div key={index} style={{
                    paddingBottom: '0.3rem',
                    borderBottom: index < results.inBoth.length - 1 ? '1px solid var(--border-color)' : 'none',
                    marginBottom: '0.3rem',
                    color: 'var(--text-primary)'
                  }}>
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* All Elements */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--accent-color)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)'
            }}>
              All Elements ({results.allElements.length})
            </h3>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {results.allElements.map((item, index) => (
                <div key={index} style={{
                  paddingBottom: '0.3rem',
                  borderBottom: index < results.allElements.length - 1 ? '1px solid var(--border-color)' : 'none',
                  marginBottom: '0.3rem',
                  color: 'var(--text-primary)'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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