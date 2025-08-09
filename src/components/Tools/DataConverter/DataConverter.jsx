import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { yamlToJson, xmlToJson, csvToJson } from '../../../utils/formatters'
import { copyToClipboard } from '../../../utils/clipboard'
import SocialShare from '../../Layout/SocialShare'

export default function DataConverter() {
  const navigate = useNavigate()
  const location = useLocation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [conversionType, setConversionType] = useState('yaml-to-json')
  const [csvOptions, setCsvOptions] = useState({
    delimiter: ',',
    hasHeaders: true
  })

  // Set conversion type based on route
  useEffect(() => {
    if (location.pathname === '/convert/csv') {
      setConversionType('csv-to-json')
    } else if (location.pathname === '/convert/yaml') {
      setConversionType('yaml-to-json')  
    } else if (location.pathname === '/convert/xml') {
      setConversionType('xml-to-json')
    }
  }, [location])

  useEffect(() => {
    const sampleData = getSampleData(conversionType)
    setInput(sampleData)
  }, [conversionType])

  const getSampleData = (type) => {
    switch (type) {
      case 'yaml-to-json':
        return `# Configuration File
app:
  name: DataConverter
  version: "1.0.0"
  enabled: true
  port: 8080
  features:
    - YAML to JSON
    - XML to JSON  
    - CSV to JSON
  
database:
  host: localhost
  port: 5432
  ssl: false
  credentials:
    username: admin
    password: "secret123"
    permissions:
      - read
      - write
    
environments:
  - name: production
    active: true
    config:
      debug: false
      logLevel: error
  - name: staging
    active: false
    config:
      debug: true
      logLevel: debug`

      case 'xml-to-json':
        return `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="1">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>12.99</price>
    <genre>Fiction</genre>
  </book>
  <book id="2">
    <title>To Kill a Mockingbird</title>
    <author>Harper Lee</author>
    <year>1960</year>
    <price>14.99</price>
    <genre>Fiction</genre>
  </book>
  <book id="3">
    <title>1984</title>
    <author>George Orwell</author>
    <year>1949</year>
    <price>13.99</price>
    <genre>Dystopian</genre>
  </book>
</catalog>`

      case 'csv-to-json':
        return `name,email,age,city,occupation
John Doe,john@example.com,28,New York,Developer
Jane Smith,jane@example.com,32,San Francisco,Designer
Bob Johnson,bob@example.com,45,Chicago,Manager
Alice Brown,alice@example.com,29,Austin,Developer
Charlie Wilson,charlie@example.com,35,Seattle,Product Manager
Diana Lee,diana@example.com,26,Boston,Data Analyst`

      default:
        return ''
    }
  }

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

  const handleConvert = () => {
    try {
      let result
      
      switch (conversionType) {
        case 'yaml-to-json':
          result = yamlToJson(input)
          break
        case 'xml-to-json':
          result = xmlToJson(input)
          break
        case 'csv-to-json':
          result = csvToJson(input, csvOptions)
          break
        default:
          throw new Error('Unknown conversion type')
      }
      
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

  const handleLoadSample = () => {
    const sampleData = getSampleData(conversionType)
    setInput(sampleData)
    setOutput('')
    hideError()
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          handleConvert()
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

  const getInputLabel = () => {
    switch (conversionType) {
      case 'yaml-to-json': return 'Input YAML'
      case 'xml-to-json': return 'Input XML'
      case 'csv-to-json': return 'Input CSV'
      default: return 'Input Data'
    }
  }

  const getInputPlaceholder = () => {
    switch (conversionType) {
      case 'yaml-to-json': return 'Paste your YAML here...'
      case 'xml-to-json': return 'Paste your XML here...'
      case 'csv-to-json': return 'Paste your CSV here...'
      default: return 'Paste your data here...'
    }
  }

  const getToolTitle = () => {
    switch (conversionType) {
      case 'csv-to-json': return 'CSV to JSON Converter'
      case 'yaml-to-json': return 'YAML to JSON Converter' 
      case 'xml-to-json': return 'XML to JSON Converter'
      default: return 'Data Converter'
    }
  }

  const getToolDescription = () => {
    switch (conversionType) {
      case 'csv-to-json': return '$ convert CSV data to structured JSON format'
      case 'yaml-to-json': return '$ convert YAML configuration to JSON format'
      case 'xml-to-json': return '$ convert XML markup to structured JSON'
      default: return '$ convert data formats to JSON'
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
            🔄 {getToolTitle()}
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)'
        }}>
          {getToolDescription()}
        </p>
      </div>

      <div style={{
        height: 'calc(100vh - 250px)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px'
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
            {getInputLabel()}
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
              placeholder={getInputPlaceholder()}
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
            JSON Output
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              className="textarea"
              value={output}
              placeholder="Converted JSON will appear here..."
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
        {/* Conversion Type and Options */}
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
              Convert:
            </label>
            <select 
              value={conversionType} 
              onChange={(e) => setConversionType(e.target.value)}
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="yaml-to-json">YAML → JSON</option>
              <option value="xml-to-json">XML → JSON</option>
              <option value="csv-to-json">CSV → JSON</option>
            </select>
          </div>

          {conversionType === 'csv-to-json' && (
            <>
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
                  Delimiter:
                </label>
                <select 
                  value={csvOptions.delimiter} 
                  onChange={(e) => setCsvOptions(prev => ({ ...prev, delimiter: e.target.value }))}
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <input
                    type="checkbox"
                    checked={csvOptions.hasHeaders}
                    onChange={(e) => setCsvOptions(prev => ({ ...prev, hasHeaders: e.target.checked }))}
                    style={{ margin: 0 }}
                  />
                  Has Headers
                </label>
              </div>
            </>
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
          <button className="btn" onClick={handleConvert}>
            🔄 Convert
          </button>
          <button className="btn btn-secondary" onClick={handleLoadSample}>
            📄 Load Sample
          </button>
          <button className="btn btn-success" onClick={handleCopy}>
            📋 Copy JSON
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
                text={`Converted data formats using work-bench.dev - a collection of 20+ developer tools! 🔄\n\n📥 INPUT (${conversionType.split('-')[0].toUpperCase()}):\n${input}\n\n📤 OUTPUT (JSON):\n${output}`}
                hashtags={['dataconversion', 'developer', 'tools', 'JSON']}
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
            Ctrl+Enter: Convert | Ctrl+K: Clear | Ctrl+Shift+C: Copy
          </div>
        </div>
      </div>
    </div>

      {successMessage && (
        <div className={`success-message ${successMessage ? 'visible' : ''}`}>
          {successMessage}
        </div>
      )}

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          button[style*="position: absolute"] {
            position: static !important;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
    </div>
  )
}