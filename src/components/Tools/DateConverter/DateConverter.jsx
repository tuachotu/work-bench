import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDateInAllFormats, calculateDateDifference, analyzeSingleDate } from '../../../utils/formatters'
import { copyToClipboard } from '../../../utils/clipboard'
import SocialShare from '../../Layout/SocialShare'

export default function DateConverter() {
  const navigate = useNavigate()
  
  // Single date formatting
  const [singleDateInput, setSingleDateInput] = useState('')
  const [formattedDate, setFormattedDate] = useState(null)
  const [singleDateError, setSingleDateError] = useState('')
  const [singleDateSuccess, setSingleDateSuccess] = useState('')
  
  // Date difference calculation
  const [date1Input, setDate1Input] = useState('')
  const [date2Input, setDate2Input] = useState('')
  const [dateDifference, setDateDifference] = useState(null)
  const [diffError, setDiffError] = useState('')
  const [diffSuccess, setDiffSuccess] = useState('')
  
  // Date analysis
  const [analysisDateInput, setAnalysisDateInput] = useState('')
  const [dateAnalysis, setDateAnalysis] = useState(null)
  const [analysisError, setAnalysisError] = useState('')
  const [analysisSuccess, setAnalysisSuccess] = useState('')
  
  const [activeTab, setActiveTab] = useState('format')

  // Auto-format when input changes
  useEffect(() => {
    if (singleDateInput.trim()) {
      handleFormatDate()
    } else {
      setFormattedDate(null)
      setSingleDateError('')
      setSingleDateSuccess('')
    }
  }, [singleDateInput])

  // Clear difference results when inputs change (but don't auto-calculate)
  useEffect(() => {
    if (!date1Input.trim() || !date2Input.trim()) {
      setDateDifference(null)
      setDiffError('')
      setDiffSuccess('')
    }
  }, [date1Input, date2Input])

  // Auto-analyze when date input changes
  useEffect(() => {
    if (analysisDateInput.trim()) {
      handleAnalyzeDate()
    } else {
      setDateAnalysis(null)
      setAnalysisError('')
      setAnalysisSuccess('')
    }
  }, [analysisDateInput])

  const handleFormatDate = () => {
    try {
      const result = formatDateInAllFormats(singleDateInput)
      setFormattedDate(result.result)
      setSingleDateSuccess(result.message)
      setSingleDateError('')
    } catch (error) {
      setSingleDateError(error.message)
      setSingleDateSuccess('')
      setFormattedDate(null)
    }
  }

  const handleCalculateDifference = () => {
    if (!date1Input.trim() || !date2Input.trim()) {
      setDiffError('Please enter both dates to calculate the difference.')
      setDiffSuccess('')
      setDateDifference(null)
      return
    }

    try {
      const result = calculateDateDifference(date1Input, date2Input)
      setDateDifference(result.result)
      setDiffSuccess(result.message)
      setDiffError('')
    } catch (error) {
      setDiffError(error.message)
      setDiffSuccess('')
      setDateDifference(null)
    }
  }

  const handleAnalyzeDate = () => {
    try {
      const result = analyzeSingleDate(analysisDateInput)
      setDateAnalysis(result.result)
      setAnalysisSuccess(result.message)
      setAnalysisError('')
    } catch (error) {
      setAnalysisError(error.message)
      setAnalysisSuccess('')
      setDateAnalysis(null)
    }
  }

  const copyFormattedOutput = (content) => {
    const text = typeof content === 'object' ? JSON.stringify(content, null, 2) : content
    copyToClipboard(text, () => {
      // Success feedback already handled by copyToClipboard
    })
  }

  const clearAll = () => {
    if (activeTab === 'format') {
      setSingleDateInput('')
      setFormattedDate(null)
      setSingleDateError('')
      setSingleDateSuccess('')
    } else if (activeTab === 'difference') {
      setDate1Input('')
      setDate2Input('')
      setDateDifference(null)
      setDiffError('')
      setDiffSuccess('')
    } else if (activeTab === 'analysis') {
      setAnalysisDateInput('')
      setDateAnalysis(null)
      setAnalysisError('')
      setAnalysisSuccess('')
    }
  }

  // Set current date
  const setCurrentDate = (targetTab, field = null) => {
    const now = new Date()
    const currentDateStr = now.toISOString().split('T')[0] // YYYY-MM-DD format
    
    if (targetTab === 'format') {
      setSingleDateInput(currentDateStr)
    } else if (targetTab === 'analysis') {
      setAnalysisDateInput(currentDateStr)
    } else if (targetTab === 'difference') {
      if (field === 'date1') {
        setDate1Input(currentDateStr)
      } else if (field === 'date2') {
        setDate2Input(currentDateStr)
      }
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'k') {
          e.preventDefault()
          clearAll()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab])

  const renderFormatTab = () => (
    <div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        fontFamily: 'var(--font-mono)'
      }}>
        📅 Date Format Converter
      </h3>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <label style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)'
          }}>
            Enter a date:
          </label>
          <button
            onClick={() => setCurrentDate('format')}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              background: 'var(--accent-color)',
              color: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            Today
          </button>
        </div>
        <input
          type="text"
          value={singleDateInput}
          onChange={(e) => setSingleDateInput(e.target.value)}
          placeholder="2024-03-15, March 15 2024, 3/15/2024, etc."
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${singleDateError ? 'var(--error-color)' : 'var(--border-color)'}`,
            borderRadius: '4px',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontFamily: 'var(--font-mono)'
          }}
        />
      </div>

      {singleDateError && (
        <div style={{
          padding: '0.75rem',
          background: 'var(--error-bg)',
          border: '1px solid var(--error-color)',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: 'var(--error-color)',
          fontFamily: 'var(--font-mono)'
        }}>
          ❌ {singleDateError}
        </div>
      )}

      {singleDateSuccess && (
        <div style={{
          padding: '0.75rem',
          background: 'var(--success-bg)',
          border: '1px solid var(--accent-color)',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: 'var(--accent-color)',
          fontFamily: 'var(--font-mono)'
        }}>
          {singleDateSuccess}
        </div>
      )}

      {formattedDate && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-mono)'
            }}>
              → All Popular Formats
            </h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => copyFormattedOutput(formattedDate)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--accent-color)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                📋 Copy All
              </button>
              
              <SocialShare 
                text={`Formatted dates in all popular formats using work-bench.dev - a collection of 20+ developer tools! 📅\n\n📥 INPUT:\n${singleDateInput}\n\n📤 ALL FORMATS:\n${Object.entries(formattedDate).map(([key, value]) => `${key}: ${value}`).join('\n')}`}
                hashtags={['date', 'developer', 'tools', 'formatting']}
                size="small"
                showLabel={false}
              />
            </div>
          </div>
          
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {Object.entries(formattedDate).map(([format, value]) => (
              <div key={format} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                marginBottom: '0.5rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <span style={{ 
                  color: 'var(--text-secondary)',
                  minWidth: '140px',
                  fontSize: '0.85rem'
                }}>
                  {format}:
                </span>
                <span style={{ 
                  color: 'var(--text-primary)',
                  flex: 1,
                  textAlign: 'right',
                  wordBreak: 'break-word',
                  marginLeft: '1rem'
                }}>
                  {value}
                </span>
                <button
                  onClick={() => copyFormattedOutput(value)}
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem',
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                  title="Copy this format"
                >
                  📋
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderDifferenceTab = () => (
    <div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        fontFamily: 'var(--font-mono)'
      }}>
        ⏱️ Date Difference Calculator
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <label style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              First Date:
            </label>
            <button
              onClick={() => setCurrentDate('difference', 'date1')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                background: 'var(--accent-color)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)'
              }}
            >
              Today
            </button>
          </div>
          <input
            type="text"
            value={date1Input}
            onChange={(e) => setDate1Input(e.target.value)}
            placeholder="2024-01-01, Jan 1 2024, 1/1/2024, etc."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${diffError ? 'var(--error-color)' : 'var(--border-color)'}`,
              borderRadius: '4px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)'
            }}
          />
        </div>
        
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <label style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              Second Date:
            </label>
            <button
              onClick={() => setCurrentDate('difference', 'date2')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                background: 'var(--accent-color)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)'
              }}
            >
              Today
            </button>
          </div>
          <input
            type="text"
            value={date2Input}
            onChange={(e) => setDate2Input(e.target.value)}
            placeholder="2024-12-31, Dec 31 2024, 12/31/2024, etc."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${diffError ? 'var(--error-color)' : 'var(--border-color)'}`,
              borderRadius: '4px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)'
            }}
          />
        </div>
      </div>

      {/* Manual Calculate Button */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={handleCalculateDifference}
          disabled={!date1Input.trim() || !date2Input.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            background: (!date1Input.trim() || !date2Input.trim()) ? 'var(--bg-secondary)' : 'var(--accent-color)',
            color: (!date1Input.trim() || !date2Input.trim()) ? 'var(--text-secondary)' : 'var(--bg-primary)',
            border: 'none',
            borderRadius: '4px',
            cursor: (!date1Input.trim() || !date2Input.trim()) ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            transition: 'all 0.2s ease'
          }}
        >
          ⏱️ Calculate Difference
        </button>
      </div>

      {diffError && (
        <div style={{
          padding: '0.75rem',
          background: 'var(--error-bg)',
          border: '1px solid var(--error-color)',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: 'var(--error-color)',
          fontFamily: 'var(--font-mono)'
        }}>
          ❌ {diffError}
        </div>
      )}

      {diffSuccess && (
        <div style={{
          padding: '0.75rem',
          background: 'var(--success-bg)',
          border: '1px solid var(--accent-color)',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: 'var(--accent-color)',
          fontFamily: 'var(--font-mono)'
        }}>
          {diffSuccess}
        </div>
      )}

      {dateDifference && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-mono)'
            }}>
              → Time Difference Results
            </h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => copyFormattedOutput(dateDifference)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--accent-color)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                📋 Copy Results
              </button>
              
              <SocialShare 
                text={`Calculated precise date differences using work-bench.dev - a collection of 20+ developer tools! ⏱️\n\n📥 INPUT:\nDate 1: ${date1Input}\nDate 2: ${date2Input}\n\n📤 COMPLETE RESULTS:\n${Object.entries(dateDifference.formatted).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\nFrom: ${dateDifference.dates.date1}\nTo: ${dateDifference.dates.date2}`}
                hashtags={['dates', 'calculator', 'developer', 'tools']}
                size="small"
                showLabel={false}
              />
            </div>
          </div>

          {/* Date comparison */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--accent-color)' }}>From:</strong> {dateDifference.dates.date1}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--accent-color)' }}>To:</strong> {dateDifference.dates.date2}
              </div>
            </div>
          </div>

          {/* Main differences */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem'
          }}>
            {Object.entries(dateDifference.formatted).map(([label, value]) => (
              <div key={label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                marginBottom: '0.5rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <span style={{ 
                  color: 'var(--text-secondary)',
                  minWidth: '120px'
                }}>
                  {label}:
                </span>
                <span style={{ 
                  color: 'var(--text-primary)',
                  fontWeight: 500
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderAnalysisTab = () => (
    <div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        fontFamily: 'var(--font-mono)'
      }}>
        📊 Date Analysis
      </h3>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <label style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)'
          }}>
            Enter a date:
          </label>
          <button
            onClick={() => setCurrentDate('analysis')}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              background: 'var(--accent-color)',
              color: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            Today
          </button>
        </div>
        <input
          type="text"
          value={analysisDateInput}
          onChange={(e) => setAnalysisDateInput(e.target.value)}
          placeholder="2024-06-15, June 15 2024, etc."
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${analysisError ? 'var(--error-color)' : 'var(--border-color)'}`,
            borderRadius: '4px',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontFamily: 'var(--font-mono)'
          }}
        />
      </div>

      {analysisError && (
        <div style={{
          padding: '0.75rem',
          background: 'var(--error-bg)',
          border: '1px solid var(--error-color)',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: 'var(--error-color)',
          fontFamily: 'var(--font-mono)'
        }}>
          ❌ {analysisError}
        </div>
      )}

      {analysisSuccess && (
        <div style={{
          padding: '0.75rem',
          background: 'var(--success-bg)',
          border: '1px solid var(--accent-color)',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: 'var(--accent-color)',
          fontFamily: 'var(--font-mono)'
        }}>
          {analysisSuccess}
        </div>
      )}

      {dateAnalysis && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-mono)'
            }}>
              → Date Analysis Results
            </h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => copyFormattedOutput(dateAnalysis)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--accent-color)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                📋 Copy Analysis
              </button>
              
              <SocialShare 
                text={`Analyzed date with week numbers, quarters, and detailed info using work-bench.dev - a collection of 20+ developer tools! 📊\n\n📥 INPUT:\n${analysisDateInput}\n\n📤 COMPLETE ANALYSIS:\n${Object.entries(dateAnalysis.formatted).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\n🔍 DETAILED INFO:\n${Object.entries(dateAnalysis.detailed).map(([key, value]) => `${key}: ${value}`).join('\n')}`}
                hashtags={['date', 'analysis', 'developer', 'tools']}
                size="small"
                showLabel={false}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h5 style={{ 
              margin: '0 0 0.75rem 0', 
              color: 'var(--accent-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}>
              Key Information
            </h5>
            {Object.entries(dateAnalysis.basic).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>{key}:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Formatted Display */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h5 style={{ 
              margin: '0 0 0.75rem 0', 
              color: 'var(--accent-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}>
              Summary
            </h5>
            {Object.entries(dateAnalysis.formatted).map(([key, value]) => (
              <div key={key} style={{
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: 'var(--text-primary)'
              }}>
                <strong style={{ color: 'var(--accent-color)' }}>{key}:</strong> {value}
              </div>
            ))}
          </div>

          {/* Detailed Info */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1rem'
          }}>
            <h5 style={{ 
              margin: '0 0 0.75rem 0', 
              color: 'var(--accent-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}>
              Detailed Information
            </h5>
            {Object.entries(dateAnalysis.detailed).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>{key}:</span>
                <span style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div style={{
      padding: '3rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Header */}
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
            📅 Date Tools
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)'
        }}>
          $ comprehensive date formatting, analysis & calculation
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {[
          { id: 'format', label: 'Format Converter', icon: '📅' },
          { id: 'difference', label: 'Date Difference', icon: '⏱️' },
          { id: 'analysis', label: 'Date Analysis', icon: '📊' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-color)' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={clearAll}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--bg-secondary)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent'
          }}
        >
          🧹 Clear All (Ctrl+K)
        </button>
      </div>

      {/* Tab Content */}
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '2rem'
      }}>
        {activeTab === 'format' && renderFormatTab()}
        {activeTab === 'difference' && renderDifferenceTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .date-tabs {
            flex-direction: column !important;
          }
          .date-tabs button {
            padding: 0.75rem !important;
          }
          button[style*="position: absolute"] {
            position: static !important;
            margin-bottom: 1rem !important;
          }
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}