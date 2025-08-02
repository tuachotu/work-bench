import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function TextProcessing() {
  const navigate = useNavigate()
  const location = useLocation()
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [activeOperation, setActiveOperation] = useState('random-text')
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Random text generation options
  const [randomLength, setRandomLength] = useState(100)
  const [randomType, setRandomType] = useState('lorem')
  
  // Format options
  const [formatType, setFormatType] = useState('bold')
  
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  // Detect active operation from URL
  useState(() => {
    const path = location.pathname
    if (path.includes('/text/random')) setActiveOperation('random-text')
    else if (path.includes('/text/format')) setActiveOperation('text-format')
    else if (path.includes('/text/cleanup')) setActiveOperation('text-cleanup')
  }, [location.pathname])

  const showSuccessMessage = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccessMessage()
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Random text generation functions
  const generateLoremIpsum = (wordCount) => {
    const loremWords = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
      'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
      'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
      'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
      'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ]
    
    const words = []
    for (let i = 0; i < wordCount; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)])
    }
    
    // Create sentences (5-15 words each)
    const sentences = []
    let currentSentence = []
    
    for (let i = 0; i < words.length; i++) {
      currentSentence.push(words[i])
      
      if (currentSentence.length >= 5 && (Math.random() < 0.3 || currentSentence.length >= 15)) {
        sentences.push(currentSentence.join(' ').charAt(0).toUpperCase() + currentSentence.join(' ').slice(1) + '.')
        currentSentence = []
      }
    }
    
    if (currentSentence.length > 0) {
      sentences.push(currentSentence.join(' ').charAt(0).toUpperCase() + currentSentence.join(' ').slice(1) + '.')
    }
    
    return sentences.join(' ')
  }

  const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateRandomWords = (count) => {
    const words = [
      'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew',
      'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry',
      'strawberry', 'tangerine', 'watermelon', 'zebra', 'elephant', 'giraffe', 'lion',
      'tiger', 'bear', 'wolf', 'fox', 'rabbit', 'deer', 'mountain', 'river', 'ocean',
      'forest', 'desert', 'valley', 'island', 'sunset', 'sunrise', 'rainbow', 'storm'
    ]
    
    const result = []
    for (let i = 0; i < count; i++) {
      result.push(words[Math.floor(Math.random() * words.length)])
    }
    return result.join(' ')
  }

  // Text formatting functions
  const formatToBold = (text) => {
    return text.replace(/([a-zA-Z]+)/g, '**$1**')
  }

  const formatToItalic = (text) => {
    return text.replace(/([a-zA-Z]+)/g, '*$1*')
  }

  const formatToUpperCase = (text) => {
    return text.toUpperCase()
  }

  const formatToLowerCase = (text) => {
    return text.toLowerCase()
  }

  const formatToTitleCase = (text) => {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  }

  // Text cleanup functions
  const removeExtraSpaces = (text) => {
    return text.replace(/\s+/g, ' ').trim()
  }

  const removeLineBreaks = (text) => {
    return text.replace(/\n\r?/g, ' ').replace(/\s+/g, ' ').trim()
  }

  const removeSpecialChars = (text) => {
    return text.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim()
  }

  const trimWhitespace = (text) => {
    return text.split('\n').map(line => line.trim()).join('\n')
  }

  // Main processing function
  const processText = () => {
    let result = ''

    switch (activeOperation) {
      case 'random-text':
        switch (randomType) {
          case 'lorem':
            result = generateLoremIpsum(randomLength)
            break
          case 'random':
            result = generateRandomString(randomLength)
            break
          case 'words':
            result = generateRandomWords(randomLength)
            break
        }
        break

      case 'text-format':
        switch (formatType) {
          case 'bold':
            result = formatToBold(inputText)
            break
          case 'italic':
            result = formatToItalic(inputText)
            break
          case 'upper':
            result = formatToUpperCase(inputText)
            break
          case 'lower':
            result = formatToLowerCase(inputText)
            break
          case 'title':
            result = formatToTitleCase(inputText)
            break
        }
        break

      case 'text-cleanup':
        switch (formatType) {
          case 'spaces':
            result = removeExtraSpaces(inputText)
            break
          case 'lines':
            result = removeLineBreaks(inputText)
            break
          case 'special':
            result = removeSpecialChars(inputText)
            break
          case 'trim':
            result = trimWhitespace(inputText)
            break
        }
        break
    }

    setOutputText(result)
  }

  const getTitle = () => {
    switch (activeOperation) {
      case 'random-text': return 'Random Text Generator'
      case 'text-format': return 'Text Formatter'
      case 'text-cleanup': return 'Text Cleanup'
      default: return 'Text Processing'
    }
  }

  const getDescription = () => {
    switch (activeOperation) {
      case 'random-text': return 'Generate lorem ipsum, random strings, or random words'
      case 'text-format': return 'Convert text to bold, italic, uppercase, lowercase, or title case'
      case 'text-cleanup': return 'Remove extra spaces, line breaks, special characters, or trim whitespace'
      default: return 'Process and manipulate text in various ways'
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Back
          </button>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            margin: 0
          }}>
            {getTitle()}
          </h1>
        </div>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '1rem',
          fontFamily: 'var(--font-mono)' 
        }}>
          {getDescription()}
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        minHeight: '400px'
      }}>
        {/* Left Panel - Input/Options */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-mono)'
          }}>
            {activeOperation === 'random-text' ? 'Generation Options' : 'Input'}
          </h3>

          {activeOperation === 'random-text' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  Text Type:
                </label>
                <select
                  value={randomType}
                  onChange={(e) => setRandomType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="lorem">Lorem Ipsum</option>
                  <option value="random">Random String</option>
                  <option value="words">Random Words</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  {randomType === 'lorem' ? 'Word Count:' : randomType === 'random' ? 'Character Count:' : 'Word Count:'}
                </label>
                <input
                  type="number"
                  value={randomLength}
                  onChange={(e) => setRandomLength(parseInt(e.target.value) || 100)}
                  min="1"
                  max="10000"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div>
                <label style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  Operation:
                </label>
                <select
                  value={formatType}
                  onChange={(e) => setFormatType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                  }}
                >
                  {activeOperation === 'text-format' ? (
                    <>
                      <option value="bold">Bold (Markdown)</option>
                      <option value="italic">Italic (Markdown)</option>
                      <option value="upper">UPPERCASE</option>
                      <option value="lower">lowercase</option>
                      <option value="title">Title Case</option>
                    </>
                  ) : (
                    <>
                      <option value="spaces">Remove Extra Spaces</option>
                      <option value="lines">Remove Line Breaks</option>
                      <option value="special">Remove Special Characters</option>
                      <option value="trim">Trim Whitespace</option>
                    </>
                  )}
                </select>
              </div>
              
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="textarea"
                style={{
                  flex: 1,
                  minHeight: '200px',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          <button 
            onClick={processText}
            className="btn"
            style={{ marginTop: '1rem' }}
          >
            {activeOperation === 'random-text' ? '🎲 Generate' : '⚡ Process'}
          </button>
        </div>

        {/* Right Panel - Output */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--accent-color)',
              fontFamily: 'var(--font-mono)',
              margin: 0
            }}>
              Output
            </h3>
            {outputText && (
              <button 
                onClick={() => copyToClipboard(outputText)}
                className="btn btn-secondary"
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
              >
                📋 Copy
              </button>
            )}
          </div>

          <textarea
            ref={outputRef}
            value={outputText}
            readOnly
            placeholder="Processed text will appear here..."
            className="textarea"
            style={{
              flex: 1,
              minHeight: '200px',
              resize: 'vertical',
              cursor: outputText ? 'text' : 'default'
            }}
          />

          {outputText && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.5rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              Characters: {outputText.length} | Words: {outputText.split(/\s+/).filter(word => word.length > 0).length}
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      <div 
        className={`success-message ${showSuccess ? 'visible' : ''}`}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: 'var(--success-color)',
          color: '#fff',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-mono)',
          transform: showSuccess ? 'translate(0)' : 'translate(calc(100% + 1rem))',
          transition: 'transform 0.3s ease',
          zIndex: 1000
        }}
      >
        ✓ Copied to clipboard
      </div>
    </div>
  )
}