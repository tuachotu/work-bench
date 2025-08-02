import { useState, useEffect } from 'react'
import { formatSql, validateSql } from '../../../utils/formatters'
import { copyToClipboard } from '../../../utils/clipboard'

export default function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const sampleSql = `select u.id, u.name, u.email, p.title, p.content, p.created_at from users u inner join posts p on u.id = p.user_id where u.active = 1 and p.status = 'published' and p.created_at >= '2024-01-01' order by p.created_at desc, u.name asc limit 50;

INSERT INTO users (name, email, password, created_at, updated_at) VALUES ('John Doe', 'john@example.com', 'hashed_password', NOW(), NOW()), ('Jane Smith', 'jane@example.com', 'hashed_password', NOW(), NOW());

UPDATE products SET price = price * 1.1, updated_at = NOW() WHERE category_id IN (SELECT id FROM categories WHERE name IN ('Electronics', 'Computers')) AND stock_quantity > 0;

CREATE TABLE orders (id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id BIGINT NOT NULL, total_amount DECIMAL(10,2) NOT NULL, status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id));`
    setInput(sampleSql)
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
      const result = formatSql(input)
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
      const result = validateSql(input)
      if (result.valid) {
        hideError()
        showSuccess(result.message)
        setOutput(`✅ ${result.message}\n\n--- SQL Analysis ---\n${input}`)
      } else {
        showError(result.error)
        setOutput('')
      }
    } catch (err) {
      showError(err.message)
    }
  }

  const handleMinify = () => {
    try {
      const minified = input
        .replace(/\s+/g, ' ')
        .replace(/\s*([(),;])\s*/g, '$1')
        .trim()
      
      setOutput(minified)
      hideError()
      showSuccess('SQL minified successfully! 📦')
    } catch (err) {
      showError(err.message)
    }
  }

  const handleUppercase = () => {
    try {
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
        'FULL JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
        'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'PRIMARY KEY', 'FOREIGN KEY',
        'INDEX', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT',
        'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'AND', 'OR', 'NOT', 'NULL', 'IS',
        'LIKE', 'IN', 'BETWEEN', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
        'AS', 'ASC', 'DESC', 'UNION', 'INTERSECT', 'EXCEPT'
      ]
      
      let uppercased = input
      keywords.forEach(keyword => {
        const regex = new RegExp('\\b' + keyword.replace(/\s+/g, '\\s+') + '\\b', 'gi')
        uppercased = uppercased.replace(regex, keyword)
      })
      
      setOutput(uppercased)
      hideError()
      showSuccess('SQL keywords uppercased! 🔤')
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
          SQL Formatter
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          margin: '0.5rem 0 0 0',
          fontFamily: 'var(--font-mono)'
        }}>
          Format, validate, and beautify SQL queries and statements
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
            Input SQL
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
              placeholder="Paste your SQL here..."
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
              placeholder="Formatted SQL will appear here..."
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
        <button className="btn btn-secondary" onClick={handleMinify}>
          📦 Minify
        </button>
        <button className="btn btn-secondary" onClick={handleValidate}>
          ✅ Validate
        </button>
        <button className="btn btn-secondary" onClick={handleUppercase}>
          🔤 Uppercase Keywords
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