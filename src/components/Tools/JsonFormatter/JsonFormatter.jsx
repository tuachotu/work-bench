import { useState, useEffect } from 'react'
import { formatJson, minifyJson, validateJson } from '../../../utils/formatters'
import { copyToClipboard } from '../../../utils/clipboard'
import SocialShare from '../../Layout/SocialShare'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const sampleJson = `{
  "name": "JSON Formatter",
  "version": "2.0.0",
  "features": [
    "Format JSON",
    "Minify JSON", 
    "Error Detection",
    "Syntax Highlighting",
    "Dark/Light Theme"
  ],
  "settings": {
    "autoFormat": true,
    "showLineNumbers": false,
    "theme": "auto"
  }
}`
    setInput(sampleJson)
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

  const handleFormat = () => {
    try {
      const result = formatJson(input)
      setOutput(result.formatted)
      
      if (result.success) {
        hideError()
        showSuccess('JSON formatted successfully! ✨')
      } else {
        showError(result.error)
      }
    } catch (err) {
      showError(err.message)
    }
  }

  const handleMinify = () => {
    try {
      const result = minifyJson(input)
      if (result.success) {
        setOutput(result.formatted)
        hideError()
        showSuccess('JSON minified successfully! 📦')
      } else {
        showError(result.error)
      }
    } catch (err) {
      showError(err.message)
    }
  }

  const handleValidate = () => {
    try {
      const result = validateJson(input)
      if (result.valid) {
        hideError()
        showSuccess(result.message)
      } else {
        showError(result.error)
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
        case 'Enter':
          e.preventDefault()
          handleFormat()
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
            Input JSON
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
              placeholder="Paste your JSON here..."
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
            Formatted Output
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              className="textarea"
              value={output}
              placeholder="Formatted JSON will appear here..."
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
        flexWrap: 'wrap',
        alignItems: 'center',
        minHeight: '60px'
      }}>
        <button className="btn" onClick={handleFormat}>
          📝 Format
        </button>
        <button className="btn" onClick={handleMinify}>
          📦 Minify
        </button>
        <button className="btn btn-success" onClick={handleCopy}>
          📋 Copy
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          🗑️ Clear
        </button>
        <button className="btn btn-secondary" onClick={handleValidate}>
          ✅ Validate
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
              text={`Just formatted JSON with this amazing free tool! 🎯\n\n📥 INPUT:\n${input}\n\n📤 OUTPUT:\n${output}`}
              hashtags={['JSON', 'developer', 'tools', 'formatting']}
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
          Ctrl+Enter: Format | Ctrl+K: Clear | Ctrl+Shift+C: Copy
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