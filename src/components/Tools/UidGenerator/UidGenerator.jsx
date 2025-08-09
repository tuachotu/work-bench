import { useState, useEffect } from 'react'
import { generateUuid, validateUuid, formatUuid, generateShortId, generateNanoid } from '../../../utils/formatters'
import { copyToClipboard } from '../../../utils/clipboard'
import SocialShare from '../../Layout/SocialShare'

export default function UidGenerator() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [generatorType, setGeneratorType] = useState('uuid-v4')
  const [formatType, setFormatType] = useState('standard')
  const [shortIdLength, setShortIdLength] = useState(8)
  const [nanoidLength, setNanoidLength] = useState(21)

  useEffect(() => {
    const sampleUuid = generateUuid(4)
    setInput(sampleUuid)
    setOutput(sampleUuid)
  }, [])

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const showError = (message) => {
    setError(message)
  }

  const hideError = () => {
    setError('')
  }

  const handleGenerate = () => {
    try {
      let generated = ''
      
      switch (generatorType) {
        case 'uuid-v4':
          generated = generateUuid(4)
          break
        case 'uuid-v1':
          generated = generateUuid(1)
          break
        case 'short-id':
          generated = generateShortId(shortIdLength)
          break
        case 'nanoid':
          generated = generateNanoid(nanoidLength)
          break
        default:
          generated = generateUuid(4)
      }
      
      setInput(generated)
      setOutput(generated)
      hideError()
      showSuccess(`New ${generatorType.replace('-', ' ').toUpperCase()} generated! 🎲`)
    } catch (err) {
      showError(err.message)
    }
  }

  const handleValidate = () => {
    try {
      if (generatorType.startsWith('uuid')) {
        const result = validateUuid(input)
        if (result.valid) {
          hideError()
          showSuccess(result.message)
          setOutput(`✅ ${result.message}\n\nType: ${result.type}\nVersion: ${result.version}`)
        } else {
          showError(result.error)
          setOutput('')
        }
      } else {
        const isValidShortId = /^[A-Za-z0-9_-]+$/.test(input.trim())
        if (isValidShortId) {
          hideError()
          showSuccess('Valid ID format! ✅')
          setOutput(`✅ Valid ID format\n\nLength: ${input.trim().length} characters\nType: ${generatorType === 'short-id' ? 'Short ID' : 'Nano ID'}`)
        } else {
          showError('Invalid ID format. Should only contain letters, numbers, underscores, and hyphens.')
          setOutput('')
        }
      }
    } catch (err) {
      showError(err.message)
    }
  }

  const handleFormat = () => {
    try {
      if (generatorType.startsWith('uuid')) {
        const result = formatUuid(input, formatType)
        if (result.success) {
          setOutput(result.formatted)
          hideError()
          showSuccess(`UUID formatted as ${formatType}! 📝`)
        } else {
          showError(result.error)
        }
      } else {
        const trimmed = input.trim()
        switch (formatType) {
          case 'uppercase':
            setOutput(trimmed.toUpperCase())
            break
          case 'lowercase':
            setOutput(trimmed.toLowerCase())
            break
          default:
            setOutput(trimmed)
        }
        hideError()
        showSuccess('ID formatted! 📝')
      }
    } catch (err) {
      showError(err.message)
    }
  }

  const handleCopy = async () => {
    try {
      await copyToClipboard(output)
      showSuccess('Copied to clipboard!')
    } catch (err) {
      showError(err.message)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    hideError()
  }

  const handleGenerateBulk = () => {
    try {
      const count = 10
      const ids = []
      
      for (let i = 0; i < count; i++) {
        switch (generatorType) {
          case 'uuid-v4':
            ids.push(generateUuid(4))
            break
          case 'uuid-v1':
            ids.push(generateUuid(1))
            break
          case 'short-id':
            ids.push(generateShortId(shortIdLength))
            break
          case 'nanoid':
            ids.push(generateNanoid(nanoidLength))
            break
          default:
            ids.push(generateUuid(4))
        }
      }
      
      setOutput(ids.join('\n'))
      hideError()
      showSuccess(`Generated ${count} ${generatorType.replace('-', ' ').toUpperCase()}s! 🎲`)
    } catch (err) {
      showError(err.message)
    }
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          handleGenerate()
          break
        case 'k':
          e.preventDefault()
          handleClear()
          break
        case 'c':
          if (e.shiftKey) {
            e.preventDefault()
            handleCopy()
          }
          break
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [input, output])

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          fontFamily: 'var(--font-mono)'
        }}>
          UID Tool
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          margin: '0.5rem 0 0 0',
          fontFamily: 'var(--font-mono)'
        }}>
          Generate, validate, and format UUIDs and other unique identifiers
        </p>
      </div>
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        minHeight: 0
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-primary)',
          minHeight: 0
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0.75rem 1rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Input UID
          </div>
          
          {error && (
            <div className="error-panel">
              {error}
            </div>
          )}
          
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              className="textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your UID here or generate a new one..."
              spellCheck={false}
              style={{
                height: '100%',
                border: 'none',
                borderRadius: 0,
                margin: 0
              }}
            />
          </div>
        </div>

        <div style={{
          width: '4px',
          background: 'var(--border-color)',
          cursor: 'col-resize'
        }} />

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-primary)',
          minHeight: 0
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0.75rem 1rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Output / Result
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              className="textarea"
              value={output}
              placeholder="Generated UID or validation result will appear here..."
              readOnly
              spellCheck={false}
              style={{
                height: '100%',
                border: 'none',
                borderRadius: 0,
                margin: 0,
                background: 'var(--bg-secondary)'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '0.75rem 1rem',
        display: 'flex',
        gap: '0.75rem',
        flexDirection: 'column'
      }}>
        {/* Generator Type and Options */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <label style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontWeight: 500
            }}>
              Type:
            </label>
            <select 
              value={generatorType} 
              onChange={(e) => setGeneratorType(e.target.value)}
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="uuid-v4">UUID v4 (Random)</option>
              <option value="uuid-v1">UUID v1 (Time-based)</option>
              <option value="short-id">Short ID</option>
              <option value="nanoid">Nano ID</option>
            </select>
          </div>

          {generatorType.startsWith('uuid') && (
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <label style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}>
                Format:
              </label>
              <select 
                value={formatType} 
                onChange={(e) => setFormatType(e.target.value)}
                style={{
                  padding: '0.25rem 0.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem'
                }}
              >
                <option value="standard">Standard</option>
                <option value="uppercase">Uppercase</option>
                <option value="no-hyphens">No Hyphens</option>
                <option value="braces">With Braces</option>
                <option value="urn">URN Format</option>
              </select>
            </div>
          )}

          {generatorType === 'short-id' && (
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <label style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}>
                Length:
              </label>
              <input
                type="number"
                min="4"
                max="32"
                value={shortIdLength}
                onChange={(e) => setShortIdLength(parseInt(e.target.value) || 8)}
                style={{
                  width: '60px',
                  padding: '0.25rem 0.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          )}

          {generatorType === 'nanoid' && (
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <label style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}>
                Length:
              </label>
              <input
                type="number"
                min="8"
                max="64"
                value={nanoidLength}
                onChange={(e) => setNanoidLength(parseInt(e.target.value) || 21)}
                style={{
                  width: '60px',
                  padding: '0.25rem 0.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          minHeight: '40px'
        }}>
          <button className="btn" onClick={handleGenerate}>
            🎲 Generate
          </button>
          <button className="btn" onClick={handleGenerateBulk}>
            📦 Generate 10
          </button>
          <button className="btn btn-secondary" onClick={handleValidate}>
            ✅ Validate
          </button>
          <button className="btn btn-secondary" onClick={handleFormat}>
            📝 Format
          </button>
          <button className="btn btn-success" onClick={handleCopy}>
            📋 Copy
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            🗑️ Clear
          </button>
          
          {/* Social Share Buttons - show when there's valid output */}
          {output && !error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '1rem',
              marginLeft: '1rem',
              borderLeft: '1px solid var(--border-color)'
            }}>
              <SocialShare 
                text={`Generated unique IDs using work-bench.dev - a collection of 20+ developer tools! 🎲\n\n⚙️ SETTINGS:\nType: ${generatorType}\nFormat: ${formatType}${generatorType === 'short-id' ? `\nLength: ${shortIdLength}` : ''}${generatorType === 'nanoid' ? `\nLength: ${nanoidLength}` : ''}\n\n📤 COMPLETE OUTPUT:\n${output}`}
                hashtags={['UUID', 'developer', 'tools', 'coding']}
                size="small"
                showLabel={true}
              />
            </div>
          )}
          
          <div style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            Ctrl+Enter: Generate | Ctrl+K: Clear | Ctrl+Shift+C: Copy
          </div>
        </div>
      </div>

      {successMessage && (
        <div className={`success-message ${successMessage ? 'visible' : ''}`}>
          {successMessage}
        </div>
      )}
    </div>
  )
}