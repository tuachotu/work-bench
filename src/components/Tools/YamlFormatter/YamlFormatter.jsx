import { useState, useEffect } from 'react'
import { formatYaml, validateYaml } from '../../../utils/formatters'
import { copyToClipboard } from '../../../utils/clipboard'

export default function YamlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const sampleYaml = `# Sample YAML Configuration
name: work-bench.dev
version: "2.0.0"
description: A terminal-inspired developer workbench
active: true
port: 3000

# Simple array
features:
  - JSON Formatter
  - UUID Generator
  - String Operations
  - YAML Formatter

# Nested object
settings:
  theme: dark
  autoFormat: true
  showLineNumbers: false
  maxFileSize: 10485760
  
# Complex nested structure
database:
  host: localhost
  port: 5432
  name: workbench_db
  ssl: false
  credentials:
    username: admin
    password: "secret123"
    roles:
      - read
      - write
      - admin

# Array of objects
servers:
  - name: production
    url: https://work-bench.dev
    active: true
    resources:
      cpu: 4
      memory: "8GB"
  - name: staging
    url: https://staging.work-bench.dev
    active: false
    resources:
      cpu: 2
      memory: "4GB"

# Mixed types
metadata:
  createdAt: "2024-12-29"
  version: 1.0
  tags:
    - production
    - web-app
    - developer-tools
  config:
    debug: false
    logLevel: info`
    setInput(sampleYaml)
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
      const result = formatYaml(input)
      setOutput(result.formatted)
      
      if (result.success) {
        hideError()
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (err) {
      showError(err.message)
    }
  }

  const handleValidate = () => {
    try {
      const result = validateYaml(input)
      if (result.valid) {
        hideError()
        showSuccess(result.message)
        setOutput(`✅ ${result.message}\n\n--- YAML Structure Analysis ---\n${input}`)
      } else {
        showError(result.error)
        setOutput('')
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
          YAML Formatter
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          margin: '0.5rem 0 0 0',
          fontFamily: 'var(--font-mono)'
        }}>
          Format, validate, and convert YAML configuration files
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
            Input YAML
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
              placeholder="Paste your YAML here..."
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
              placeholder="Formatted YAML will appear here..."
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
        <button className="btn btn-secondary" onClick={handleValidate}>
          ✅ Validate
        </button>
        <button className="btn btn-success" onClick={handleCopy}>
          📋 Copy
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          🗑️ Clear
        </button>
        
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