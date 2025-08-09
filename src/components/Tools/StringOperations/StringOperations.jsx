import { useState, useEffect } from 'react'
import { getStringLength, cleanupString, escapeString, slugifyString } from '../../../utils/formatters'
import { copyToClipboard } from '../../../utils/clipboard'
import SocialShare from '../../Layout/SocialShare'

export default function StringOperations() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [escapeType, setEscapeType] = useState('html')
  const [cleanupOptions, setCleanupOptions] = useState({
    removeExtraSpaces: true,
    removeLeadingTrailing: true,
    removeLineBreaks: false,
    removeSpecialChars: false,
    removeNumbers: false,
    toLowerCase: false,
    toUpperCase: false
  })
  const [slugifyOptions, setSlugifyOptions] = useState({
    separator: '-',
    lowercase: true,
    removeSpecialChars: true,
    maxLength: null,
    strict: false
  })

  useEffect(() => {
    const sampleText = `  Hello World! This is a SAMPLE text with    extra spaces,
special characters: @#$%, numbers 123, and multiple lines.
    It needs some cleanup...  `
    setInput(sampleText)
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

  const handleLength = () => {
    try {
      const result = getStringLength(input)
      if (result.success) {
        const stats = result.result
        const formatted = `📊 STRING ANALYSIS

Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Lines: ${stats.lines}
Paragraphs: ${stats.paragraphs}
Bytes (UTF-8): ${stats.bytes}

---
Detailed Breakdown:
• Total length: ${stats.characters} characters
• Without spaces: ${stats.charactersNoSpaces} characters  
• Word count: ${stats.words}
• Line count: ${stats.lines}
• Paragraph count: ${stats.paragraphs}
• Size in bytes: ${stats.bytes} bytes`

        setOutput(formatted)
        hideError()
        showSuccess(result.message)
      }
    } catch (err) {
      showError(err.message)
    }
  }

  const handleCleanup = () => {
    try {
      const result = cleanupString(input, cleanupOptions)
      if (result.success) {
        setOutput(result.result)
        hideError()
        showSuccess(result.message)
      }
    } catch (err) {
      showError(err.message)
    }
  }

  const handleEscape = () => {
    try {
      const result = escapeString(input, escapeType)
      if (result.success) {
        setOutput(result.result)
        hideError()
        showSuccess(result.message)
      }
    } catch (err) {
      showError(err.message)
    }
  }

  const handleSlugify = () => {
    try {
      const options = {
        ...slugifyOptions,
        maxLength: slugifyOptions.maxLength || null
      }
      const result = slugifyString(input, options)
      if (result.success) {
        setOutput(result.result)
        hideError()
        showSuccess(result.message)
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

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
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
  }, [output])

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
          String Operations
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          margin: '0.5rem 0 0 0',
          fontFamily: 'var(--font-mono)'
        }}>
          Analyze, clean, escape, and slugify text strings
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
            Input String
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
              placeholder="Enter your text here..."
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
            Result
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              className="textarea"
              value={output}
              placeholder="Results will appear here..."
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
        {/* Operation Options */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: '0.5rem',
          background: 'var(--bg-primary)',
          borderRadius: '4px',
          border: '1px solid var(--border-color)'
        }}>
          {/* Escape Type */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <label style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              textTransform: 'uppercase'
            }}>
              Escape:
            </label>
            <select 
              value={escapeType} 
              onChange={(e) => setEscapeType(e.target.value)}
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem'
              }}
            >
              <option value="html">HTML</option>
              <option value="javascript">JavaScript</option>
              <option value="url">URL</option>
              <option value="css">CSS</option>
              <option value="regex">Regex</option>
            </select>
          </div>

          {/* Cleanup Options */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              textTransform: 'uppercase'
            }}>
              Cleanup:
            </span>
            {[
              { key: 'removeExtraSpaces', label: 'Extra Spaces' },
              { key: 'removeLineBreaks', label: 'Line Breaks' },
              { key: 'removeSpecialChars', label: 'Special Chars' },
              { key: 'toLowerCase', label: 'Lowercase' }
            ].map(option => (
              <label key={option.key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={cleanupOptions[option.key]}
                  onChange={(e) => setCleanupOptions(prev => ({
                    ...prev,
                    [option.key]: e.target.checked
                  }))}
                  style={{ margin: 0 }}
                />
                {option.label}
              </label>
            ))}
          </div>

          {/* Slugify Options */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <label style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              textTransform: 'uppercase'
            }}>
              Slug Sep:
            </label>
            <select 
              value={slugifyOptions.separator} 
              onChange={(e) => setSlugifyOptions(prev => ({ ...prev, separator: e.target.value }))}
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                width: '60px'
              }}
            >
              <option value="-">-</option>
              <option value="_">_</option>
              <option value=".">.</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          minHeight: '40px'
        }}>
          <button className="btn" onClick={handleLength}>
            📊 Length
          </button>
          <button className="btn" onClick={handleCleanup}>
            🧹 Cleanup
          </button>
          <button className="btn" onClick={handleEscape}>
            🔒 Escape
          </button>
          <button className="btn" onClick={handleSlugify}>
            🔗 Slugify
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
                text={`Performed string manipulations using work-bench.dev - a collection of 20+ developer tools! 🔤\n\n📥 INPUT:\n"${input}"\n\n📤 OUTPUT:\n"${output}"`}
                hashtags={['string', 'developer', 'tools', 'text']}
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
            Ctrl+K: Clear | Ctrl+Shift+C: Copy
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