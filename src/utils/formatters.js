export function formatJson(jsonString) {
  if (!jsonString.trim()) {
    throw new Error('Please enter some JSON to format.')
  }

  try {
    const parsed = JSON.parse(jsonString)
    const formatted = JSON.stringify(parsed, null, 2)
    return { formatted, success: true, error: null }
  } catch (error) {
    const result = attemptPartialFormat(jsonString)
    const errorInfo = getDetailedErrorInfo(error, jsonString)
    return { 
      formatted: result.formatted, 
      success: result.success, 
      error: `${errorInfo.type}: ${errorInfo.message} (Line ${errorInfo.line}, Column ${errorInfo.column})`
    }
  }
}

export function minifyJson(jsonString) {
  if (!jsonString.trim()) {
    throw new Error('Please enter some JSON to minify.')
  }

  try {
    const parsed = JSON.parse(jsonString)
    const minified = JSON.stringify(parsed)
    return { formatted: minified, success: true, error: null }
  } catch (error) {
    const errorInfo = getDetailedErrorInfo(error, jsonString)
    return {
      formatted: '',
      success: false,
      error: `Cannot minify invalid JSON: ${errorInfo.message} (Line ${errorInfo.line}, Column ${errorInfo.column})`
    }
  }
}

export function validateJson(jsonString) {
  if (!jsonString.trim()) {
    throw new Error('Please enter some JSON to validate.')
  }

  try {
    const parsed = JSON.parse(jsonString)
    const stats = getJsonStats(parsed)
    return {
      valid: true,
      error: null,
      message: `Valid JSON! ✅ (${stats.keys} keys, ${stats.depth} levels deep)`
    }
  } catch (error) {
    const errorInfo = getDetailedErrorInfo(error, jsonString)
    return {
      valid: false,
      error: `${errorInfo.type}: ${errorInfo.message} (Line ${errorInfo.line}, Column ${errorInfo.column})`,
      message: null
    }
  }
}

function attemptPartialFormat(jsonString) {
  const fixes = [
    { pattern: /,(\s*[}\]])/g, replacement: '$1', description: 'trailing commas' },
    { pattern: /'([^']*)'/g, replacement: '"$1"', description: 'single quotes' },
    { pattern: /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, replacement: '$1"$2":', description: 'unquoted keys' },
    { pattern: /:\s*undefined/g, replacement: ': null', description: 'undefined values' },
    { pattern: /,?\s*"?[a-zA-Z_$][a-zA-Z0-9_$]*"?\s*:\s*function[^,}]*/g, replacement: '', description: 'function values' }
  ]

  let fixed = jsonString
  let appliedFixes = []

  for (const fix of fixes) {
    const beforeLength = fixed.length
    fixed = fixed.replace(fix.pattern, fix.replacement)
    if (fixed.length !== beforeLength) {
      appliedFixes.push(fix.description)
    }
  }

  try {
    const parsed = JSON.parse(fixed)
    const formatted = JSON.stringify(parsed, null, 2)
    return { formatted, success: true, appliedFixes }
  } catch (e) {
    const basicFormatted = basicFormat(jsonString)
    return { formatted: basicFormatted, success: false, appliedFixes }
  }
}

function basicFormat(jsonString) {
  let formatted = ''
  let indentLevel = 0
  let inString = false
  let escapeNext = false

  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString[i]
    const nextChar = jsonString[i + 1]

    if (escapeNext) {
      formatted += char
      escapeNext = false
      continue
    }

    if (char === '\\' && inString) {
      formatted += char
      escapeNext = true
      continue
    }

    if (char === '"' && !escapeNext) {
      inString = !inString
    }

    if (!inString) {
      if (char === '{' || char === '[') {
        formatted += char
        if (nextChar !== '}' && nextChar !== ']') {
          indentLevel++
          formatted += '\n' + '  '.repeat(indentLevel)
        }
      } else if (char === '}' || char === ']') {
        if (formatted[formatted.length - 1] !== '\n') {
          indentLevel--
          formatted += '\n' + '  '.repeat(indentLevel)
        } else {
          indentLevel--
          formatted = formatted.slice(0, -2 * indentLevel) + '  '.repeat(indentLevel)
        }
        formatted += char
      } else if (char === ',') {
        formatted += char
        if (nextChar !== '\n') {
          formatted += '\n' + '  '.repeat(indentLevel)
        }
      } else if (char === ':') {
        formatted += char + ' '
      } else if (!/\s/.test(char)) {
        formatted += char
      }
    } else {
      formatted += char
    }
  }

  return formatted
}

function getDetailedErrorInfo(error, jsonString) {
  const message = error.message
  let line = 1
  let column = 1
  let type = 'JSON Error'

  const positionMatch = message.match(/position (\d+)/i) || 
                       message.match(/at position (\d+)/i) ||
                       message.match(/character (\d+)/i)
  
  if (positionMatch) {
    const position = parseInt(positionMatch[1])
    const lines = jsonString.substring(0, position).split('\n')
    line = lines.length
    column = lines[lines.length - 1].length + 1
  }

  if (message.includes('Unexpected token')) {
    type = 'Syntax Error'
  } else if (message.includes('Unexpected end')) {
    type = 'Incomplete JSON'
  } else if (message.includes('string')) {
    type = 'String Error'
  } else if (message.includes('number')) {
    type = 'Number Format Error'
  }

  return {
    type,
    message: message.replace(/^JSON.parse: /, '').replace(/^Unexpected /, 'Unexpected '),
    line,
    column
  }
}

function getJsonStats(obj) {
  let keys = 0
  let maxDepth = 0

  function traverse(item, depth = 0) {
    maxDepth = Math.max(maxDepth, depth)
    
    if (Array.isArray(item)) {
      item.forEach(element => traverse(element, depth + 1))
    } else if (typeof item === 'object' && item !== null) {
      keys += Object.keys(item).length
      Object.values(item).forEach(value => traverse(value, depth + 1))
    }
  }

  traverse(obj)
  return { keys, depth: maxDepth }
}

// UID/UUID utility functions
export function generateUuid(version = 4) {
  if (version === 4) {
    return generateUuidV4()
  } else if (version === 1) {
    return generateUuidV1()
  } else {
    throw new Error('Unsupported UUID version. Only v1 and v4 are supported.')
  }
}

function generateUuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function generateUuidV1() {
  const timestamp = Date.now()
  const randomBytes = new Array(16).fill(0).map(() => Math.floor(Math.random() * 256))
  
  // Time-based UUID v1 (simplified implementation)
  const timeHigh = (timestamp & 0xffffffff).toString(16).padStart(8, '0')
  const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, '0')
  const timeHiAndVersion = (((timestamp >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0')
  const clockSeqHiAndReserved = (randomBytes[8] & 0x3f | 0x80).toString(16).padStart(2, '0')
  const clockSeqLow = randomBytes[9].toString(16).padStart(2, '0')
  const node = randomBytes.slice(10, 16).map(b => b.toString(16).padStart(2, '0')).join('')
  
  return `${timeHigh}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved}${clockSeqLow}-${node}`
}

export function validateUuid(uuidString) {
  if (!uuidString || typeof uuidString !== 'string') {
    return {
      valid: false,
      error: 'UUID must be a non-empty string',
      version: null,
      type: null
    }
  }

  const trimmed = uuidString.trim()
  
  // UUID v4 pattern
  const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  // UUID v1 pattern
  const uuidV1Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  // General UUID pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  
  if (uuidV4Pattern.test(trimmed)) {
    return {
      valid: true,
      error: null,
      version: 4,
      type: 'Random UUID',
      message: 'Valid UUID v4 (Random) ✅'
    }
  } else if (uuidV1Pattern.test(trimmed)) {
    return {
      valid: true,
      error: null,
      version: 1,
      type: 'Time-based UUID',
      message: 'Valid UUID v1 (Time-based) ✅'
    }
  } else if (uuidPattern.test(trimmed)) {
    const version = parseInt(trimmed.charAt(14), 16)
    return {
      valid: true,
      error: null,
      version: version,
      type: `UUID v${version}`,
      message: `Valid UUID v${version} ✅`
    }
  } else {
    const errors = []
    
    if (trimmed.length !== 36) {
      errors.push(`Length should be 36 characters, got ${trimmed.length}`)
    }
    
    if (!trimmed.includes('-')) {
      errors.push('Missing hyphens (should be in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)')
    } else {
      const parts = trimmed.split('-')
      if (parts.length !== 5) {
        errors.push(`Should have 5 parts separated by hyphens, got ${parts.length}`)
      } else {
        const expectedLengths = [8, 4, 4, 4, 12]
        parts.forEach((part, index) => {
          if (part.length !== expectedLengths[index]) {
            errors.push(`Part ${index + 1} should be ${expectedLengths[index]} characters, got ${part.length}`)
          }
        })
      }
    }
    
    if (!/^[0-9a-f-]+$/i.test(trimmed)) {
      errors.push('Contains invalid characters (should only contain 0-9, a-f, and hyphens)')
    }
    
    return {
      valid: false,
      error: errors.join('; '),
      version: null,
      type: null
    }
  }
}

export function formatUuid(uuidString, format = 'standard') {
  if (!uuidString || typeof uuidString !== 'string') {
    throw new Error('Please enter a UUID to format.')
  }

  const cleaned = uuidString.replace(/[^0-9a-f]/gi, '')
  
  if (cleaned.length !== 32) {
    throw new Error(`UUID should contain exactly 32 hex characters, got ${cleaned.length}`)
  }

  const formatted = `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20, 32)}`
  
  switch (format.toLowerCase()) {
    case 'standard':
    case 'hyphenated':
      return { formatted: formatted.toLowerCase(), success: true, error: null }
    case 'uppercase':
      return { formatted: formatted.toUpperCase(), success: true, error: null }
    case 'no-hyphens':
    case 'compact':
      return { formatted: cleaned.toLowerCase(), success: true, error: null }
    case 'braces':
      return { formatted: `{${formatted.toLowerCase()}}`, success: true, error: null }
    case 'urn':
      return { formatted: `urn:uuid:${formatted.toLowerCase()}`, success: true, error: null }
    default:
      return { formatted: formatted.toLowerCase(), success: true, error: null }
  }
}

export function generateShortId(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  return result
}

export function generateNanoid(length = 21) {
  const alphabet = '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let id = ''
  
  for (let i = 0; i < length; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  
  return id
}

// String utility functions
export function getStringLength(text) {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string.')
  }

  const charCount = text.length
  const byteCount = new TextEncoder().encode(text).length
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const lineCount = text === '' ? 0 : text.split(/\r\n|\r|\n/).length
  const withoutSpaces = text.replace(/\s/g, '').length
  const withoutWhitespace = text.replace(/\s/g, '').length

  return {
    success: true,
    result: {
      characters: charCount,
      charactersNoSpaces: withoutSpaces,
      words: wordCount,
      lines: lineCount,
      bytes: byteCount,
      paragraphs: text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
    },
    message: `📊 String analyzed: ${charCount} chars, ${wordCount} words, ${lineCount} lines`
  }
}

export function cleanupString(text, options = {}) {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string.')
  }

  const {
    removeExtraSpaces = true,
    removeLeadingTrailing = true,
    removeLineBreaks = false,
    removeSpecialChars = false,
    removeNumbers = false,
    toLowerCase = false,
    toUpperCase = false
  } = options

  let cleaned = text

  // Remove leading/trailing whitespace
  if (removeLeadingTrailing) {
    cleaned = cleaned.trim()
  }

  // Remove extra spaces (multiple spaces become single space)
  if (removeExtraSpaces) {
    cleaned = cleaned.replace(/\s+/g, ' ')
  }

  // Remove line breaks
  if (removeLineBreaks) {
    cleaned = cleaned.replace(/\r\n|\r|\n/g, ' ')
  }

  // Remove special characters (keep only letters, numbers, and spaces)
  if (removeSpecialChars) {
    cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, '')
  }

  // Remove numbers
  if (removeNumbers) {
    cleaned = cleaned.replace(/[0-9]/g, '')
  }

  // Convert case
  if (toLowerCase) {
    cleaned = cleaned.toLowerCase()
  } else if (toUpperCase) {
    cleaned = cleaned.toUpperCase()
  }

  return {
    success: true,
    result: cleaned,
    message: `🧹 String cleaned: ${text.length} → ${cleaned.length} characters`
  }
}

export function escapeString(text, escapeType = 'html') {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string.')
  }

  let escaped = text

  switch (escapeType.toLowerCase()) {
    case 'html':
      escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      break

    case 'javascript':
    case 'js':
      escaped = text
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
      break

    case 'url':
      escaped = encodeURIComponent(text)
      break

    case 'css':
      escaped = text
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\A ')
        .replace(/\r/g, '\\D ')
      break

    case 'regex':
      escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      break

    default:
      throw new Error(`Unsupported escape type: ${escapeType}. Use: html, javascript, url, css, or regex`)
  }

  return {
    success: true,
    result: escaped,
    escapeType: escapeType,
    message: `🔒 String escaped for ${escapeType.toUpperCase()}`
  }
}

export function slugifyString(text, options = {}) {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string.')
  }

  const {
    separator = '-',
    lowercase = true,
    removeSpecialChars = true,
    maxLength = null,
    strict = false
  } = options

  let slug = text

  // Convert to lowercase
  if (lowercase) {
    slug = slug.toLowerCase()
  }

  // Replace accented characters
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Remove special characters or replace with separator
  if (removeSpecialChars) {
    if (strict) {
      // Strict mode: only allow alphanumeric and separator
      slug = slug.replace(/[^a-zA-Z0-9\s-_]/g, '')
    } else {
      // Replace common special characters
      slug = slug.replace(/[^\w\s-_]/g, '')
    }
  }

  // Replace spaces and underscores with separator
  slug = slug.replace(/[\s_]+/g, separator)

  // Remove duplicate separators
  const separatorRegex = new RegExp(`\\${separator}+`, 'g')
  slug = slug.replace(separatorRegex, separator)

  // Remove separator from start and end
  const trimRegex = new RegExp(`^\\${separator}+|\\${separator}+$`, 'g')
  slug = slug.replace(trimRegex, '')

  // Limit length if specified
  if (maxLength && slug.length > maxLength) {
    slug = slug.substring(0, maxLength)
    // Remove trailing separator if cut off mid-word
    slug = slug.replace(new RegExp(`\\${separator}+$`), '')
  }

  return {
    success: true,
    result: slug,
    options: options,
    message: `🔗 String slugified: "${text}" → "${slug}"`
  }
}

// YAML formatting functions
export function formatYaml(yamlString) {
  if (!yamlString.trim()) {
    throw new Error('Please enter some YAML to format.')
  }

  try {
    // Parse YAML by simulating basic YAML structure
    const formatted = formatYamlStructure(yamlString)
    return { 
      formatted, 
      success: true, 
      error: null,
      message: '📝 YAML formatted successfully! ✨'
    }
  } catch (error) {
    return {
      formatted: yamlString,
      success: false,
      error: `YAML Error: ${error.message}`
    }
  }
}

export function validateYaml(yamlString) {
  if (!yamlString.trim()) {
    throw new Error('Please enter some YAML to validate.')
  }

  try {
    // First do structural validation
    const lines = yamlString.split('\n')
    let errors = []
    let brackets = []
    let lastIndent = -1
    let indentStack = []
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      const lineNum = index + 1
      
      // Skip empty lines and comments
      if (trimmed === '' || trimmed.startsWith('#')) return
      
      const indent = line.search(/\S/)
      
      // Check for tabs
      if (line.includes('\t')) {
        errors.push(`Line ${lineNum}: Tabs not allowed in YAML, use spaces`)
      }
      
      // Check indentation consistency
      if (indent > lastIndent) {
        indentStack.push(lastIndent)
      } else if (indent < lastIndent) {
        // Pop stack until we find matching indent
        let found = false
        while (indentStack.length > 0) {
          const prevIndent = indentStack.pop()
          if (indent === prevIndent || indent > prevIndent) {
            if (indent > prevIndent) {
              indentStack.push(prevIndent)
            }
            found = true
            break
          }
        }
        if (!found && indent !== 0) {
          errors.push(`Line ${lineNum}: Invalid indentation level`)
        }
      }
      lastIndent = indent
      
      // Check list item syntax
      if (trimmed.startsWith('- ')) {
        const itemContent = trimmed.substring(2)
        if (itemContent.includes(':') && !itemContent.match(/^[^:]+:\s*.*$/)) {
          errors.push(`Line ${lineNum}: Invalid list item with key-value syntax`)
        }
      }
      
      // Check key-value syntax
      else if (trimmed.includes(':')) {
        if (!trimmed.match(/^[^:]+:\s*.*$/)) {
          errors.push(`Line ${lineNum}: Invalid key-value syntax`)
        }
        
        // Check for invalid characters in keys
        const colonIndex = trimmed.indexOf(':')
        const key = trimmed.substring(0, colonIndex).trim()
        if (key.match(/[[\]{}]/)) {
          errors.push(`Line ${lineNum}: Invalid characters in key "${key}"`)
        }
      }
      
      // Check for unmatched brackets
      for (let char of trimmed) {
        if (char === '[' || char === '{') {
          brackets.push({ char, line: lineNum })
        } else if (char === ']') {
          if (brackets.length === 0 || brackets[brackets.length - 1].char !== '[') {
            errors.push(`Line ${lineNum}: Unmatched closing bracket ']'`)
          } else {
            brackets.pop()
          }
        } else if (char === '}') {
          if (brackets.length === 0 || brackets[brackets.length - 1].char !== '{') {
            errors.push(`Line ${lineNum}: Unmatched closing brace '}'`)
          } else {
            brackets.pop()
          }
        }
      }
    })
    
    // Check for unmatched opening brackets
    brackets.forEach(bracket => {
      errors.push(`Line ${bracket.line}: Unmatched opening ${bracket.char === '[' ? 'bracket' : 'brace'} '${bracket.char}'`)
    })
    
    if (errors.length > 0) {
      return {
        valid: false,
        error: errors.slice(0, 3).join('; ') + (errors.length > 3 ? `... (${errors.length - 3} more errors)` : ''),
        message: null
      }
    }
    
    // Try to parse the YAML to check if it's actually valid
    try {
      const parsed = parseSimpleYaml(yamlString)
      const stats = getYamlStats(parsed, yamlString)
      
      return {
        valid: true,
        error: null,
        message: `Valid YAML! ✅ (${stats.keys} keys, ${stats.lines} lines, ${stats.arrays} arrays)`
      }
    } catch (parseError) {
      return {
        valid: false,
        error: `YAML parsing error: ${parseError.message}`,
        message: null
      }
    }
    
  } catch (error) {
    return {
      valid: false,
      error: `YAML validation error: ${error.message}`,
      message: null
    }
  }
}

function getYamlStats(parsed, originalYaml) {
  const lines = originalYaml.split('\n').filter(line => line.trim() && !line.trim().startsWith('#')).length
  
  function countStats(obj) {
    let keys = 0
    let arrays = 0
    
    if (Array.isArray(obj)) {
      arrays += 1
      obj.forEach(item => {
        const subStats = countStats(item)
        keys += subStats.keys
        arrays += subStats.arrays
      })
    } else if (typeof obj === 'object' && obj !== null) {
      const objKeys = Object.keys(obj)
      keys += objKeys.length
      
      objKeys.forEach(key => {
        const subStats = countStats(obj[key])
        keys += subStats.keys
        arrays += subStats.arrays
      })
    }
    
    return { keys, arrays }
  }
  
  const stats = countStats(parsed)
  return {
    keys: stats.keys,
    arrays: stats.arrays,
    lines: lines
  }
}

function formatYamlStructure(yamlString) {
  const lines = yamlString.split('\n')
  const formatted = []
  let currentIndent = 0

  lines.forEach(line => {
    const trimmed = line.trim()
    
    if (trimmed === '' || trimmed.startsWith('#')) {
      formatted.push(line)
      return
    }

    // Determine indent level based on content
    let indent = 0
    if (trimmed.startsWith('- ')) {
      // List item
      indent = currentIndent
    } else if (trimmed.includes(':')) {
      // Key-value pair
      if (trimmed.endsWith(':') || trimmed.match(/:\s*$/)) {
        // Object key
        currentIndent = Math.floor(line.search(/\S/) / 2) * 2
        indent = currentIndent
      } else {
        // Key with value
        indent = Math.floor(line.search(/\S/) / 2) * 2
      }
    }

    formatted.push(' '.repeat(indent) + trimmed)
  })

  return formatted.join('\n')
}

// SQL formatting functions
export function formatSql(sqlString) {
  if (!sqlString.trim()) {
    throw new Error('Please enter some SQL to format.')
  }

  try {
    const formatted = formatSqlStructure(sqlString)
    return { 
      formatted, 
      success: true, 
      error: null,
      message: '📝 SQL formatted successfully! ✨'
    }
  } catch (error) {
    return {
      formatted: sqlString,
      success: false,
      error: `SQL Error: ${error.message}`
    }
  }
}

export function validateSql(sqlString) {
  if (!sqlString.trim()) {
    throw new Error('Please enter some SQL to validate.')
  }

  try {
    // Basic SQL validation
    const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP']
    const upperSql = sqlString.toUpperCase()
    
    const hasKeyword = keywords.some(keyword => upperSql.includes(keyword))
    
    if (!hasKeyword) {
      return {
        valid: false,
        error: 'No recognized SQL keywords found',
        message: null
      }
    }

    // Check for basic syntax issues
    const parenBalance = (sqlString.match(/\(/g) || []).length - (sqlString.match(/\)/g) || []).length
    if (parenBalance !== 0) {
      return {
        valid: false,
        error: 'Unmatched parentheses',
        message: null
      }
    }

    const lines = sqlString.split('\n').filter(line => line.trim())
    return {
      valid: true,
      error: null,
      message: `Valid SQL! ✅ (${lines.length} lines, contains ${keywords.filter(k => upperSql.includes(k)).length} SQL keywords)`
    }
  } catch (error) {
    return {
      valid: false,
      error: `SQL validation error: ${error.message}`,
      message: null
    }
  }
}

function formatSqlStructure(sqlString) {
  // Basic SQL formatting
  let formatted = sqlString
    // Add line breaks after major keywords
    .replace(/\b(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|INSERT INTO|UPDATE|SET|DELETE FROM|CREATE|ALTER|DROP)\b/gi, '\n$1')
    // Add line breaks after commas in SELECT statements
    .replace(/,\s*(?=\w)/g, ',\n  ')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .replace(/\n\s+\n/g, '\n')
    .trim()

  // Split into lines and indent properly
  const lines = formatted.split('\n')
  const result = []
  let indentLevel = 0

  lines.forEach(line => {
    const trimmed = line.trim()
    if (!trimmed) return

    // Keywords that should not be indented
    const majorKeywords = /^(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|INSERT INTO|UPDATE|DELETE FROM|CREATE|ALTER|DROP)/i
    
    if (majorKeywords.test(trimmed)) {
      indentLevel = 0
      result.push(trimmed.toUpperCase())
    } else if (trimmed.startsWith(',')) {
      result.push('  ' + trimmed)
    } else {
      result.push('  ' + trimmed)
    }
  })

  return result.join('\n')
}

// Data conversion functions
export function yamlToJson(yamlString) {
  if (!yamlString.trim()) {
    throw new Error('Please enter some YAML to convert.')
  }

  try {
    const jsonObject = parseSimpleYaml(yamlString)
    const jsonString = JSON.stringify(jsonObject, null, 2)
    
    return {
      success: true,
      result: jsonString,
      message: '🔄 YAML converted to JSON successfully! ✨'
    }
  } catch (error) {
    throw new Error(`YAML to JSON conversion failed: ${error.message}`)
  }
}

export function xmlToJson(xmlString) {
  if (!xmlString.trim()) {
    throw new Error('Please enter some XML to convert.')
  }

  try {
    const jsonObject = parseSimpleXml(xmlString)
    const jsonString = JSON.stringify(jsonObject, null, 2)
    
    return {
      success: true,
      result: jsonString,
      message: '🔄 XML converted to JSON successfully! ✨'
    }
  } catch (error) {
    throw new Error(`XML to JSON conversion failed: ${error.message}`)
  }
}

export function csvToJson(csvString, options = {}) {
  if (!csvString.trim()) {
    throw new Error('Please enter some CSV to convert.')
  }

  try {
    const { delimiter = ',', hasHeaders = true } = options
    const lines = csvString.trim().split('\n')
    
    if (lines.length === 0) {
      throw new Error('Empty CSV data')
    }

    const headers = hasHeaders ? parseCsvLine(lines[0], delimiter) : 
                     Array.from({ length: parseCsvLine(lines[0], delimiter).length }, (_, i) => `column_${i + 1}`)
    
    const dataLines = hasHeaders ? lines.slice(1) : lines
    const jsonArray = []

    dataLines.forEach((line, index) => {
      if (!line.trim()) return
      
      const values = parseCsvLine(line, delimiter)
      const row = {}
      
      headers.forEach((header, i) => {
        row[header] = values[i] || ''
      })
      
      jsonArray.push(row)
    })

    const jsonString = JSON.stringify(jsonArray, null, 2)
    
    return {
      success: true,
      result: jsonString,
      message: `🔄 CSV converted to JSON successfully! (${jsonArray.length} rows) ✨`
    }
  } catch (error) {
    throw new Error(`CSV to JSON conversion failed: ${error.message}`)
  }
}

// Helper functions for parsing
function parseSimpleYaml(yamlString) {
  const lines = yamlString.split('\n')
  const result = {}
  const stack = [{ obj: result, indent: -1, type: 'object' }]
  
  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    const indent = line.search(/\S/)
    
    // Pop stack until we find the right parent level
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }
    
    const currentContext = stack[stack.length - 1]
    const currentObject = currentContext.obj
    
    if (trimmed.startsWith('- ')) {
      // List item
      const itemValue = trimmed.substring(2).trim()
      
      // Ensure we're working with an array
      if (!Array.isArray(currentObject)) {
        throw new Error(`Expected array context for list item at line ${lineIndex + 1}`)
      }
      
      // Parse the list item value
      if (itemValue.includes(':')) {
        // Object in array
        const colonIndex = itemValue.indexOf(':')
        const key = itemValue.substring(0, colonIndex).trim()
        const value = itemValue.substring(colonIndex + 1).trim()
        
        const itemObj = {}
        if (value) {
          itemObj[key] = parseYamlValue(value)
          currentObject.push(itemObj)
        } else {
          // This will be a nested object
          itemObj[key] = {}
          currentObject.push(itemObj)
          stack.push({ obj: itemObj[key], indent: indent + 2, type: 'object' })
        }
      } else if (itemValue === '') {
        // Complex list item, next lines will define the object
        const itemObj = {}
        currentObject.push(itemObj)
        stack.push({ obj: itemObj, indent: indent + 2, type: 'object' })
      } else {
        // Simple value in array
        currentObject.push(parseYamlValue(itemValue))
      }
    } else if (trimmed.includes(':')) {
      // Key-value pair
      const colonIndex = trimmed.indexOf(':')
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()
      
      if (!value || value === '') {
        // This is a parent key for nested content
        // Look ahead to determine if it should be an array or object
        let nextLineIndex = lineIndex + 1
        while (nextLineIndex < lines.length && !lines[nextLineIndex].trim()) {
          nextLineIndex++
        }
        
        if (nextLineIndex < lines.length) {
          const nextLine = lines[nextLineIndex]
          const nextTrimmed = nextLine.trim()
          const nextIndent = nextLine.search(/\S/)
          
          if (nextTrimmed.startsWith('- ') && nextIndent > indent) {
            // Next line is a list item with greater indentation
            currentObject[key] = []
            stack.push({ obj: currentObject[key], indent: indent, type: 'array' })
          } else if (nextIndent > indent) {
            // Next content will be nested object
            currentObject[key] = {}
            stack.push({ obj: currentObject[key], indent: indent, type: 'object' })
          } else {
            // Same or lesser indentation, treat as null value
            currentObject[key] = null
          }
        } else {
          // No more lines, treat as null
          currentObject[key] = null
        }
      } else {
        // This is a key with a direct value
        if (Array.isArray(currentObject)) {
          // We're in an array context, this should be part of an object
          const itemObj = {}
          itemObj[key] = parseYamlValue(value)
          currentObject.push(itemObj)
        } else {
          // Regular object property
          currentObject[key] = parseYamlValue(value)
        }
      }
    }
  })

  return result
}

function parseYamlValue(value) {
  // Remove quotes if present
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  
  // Parse booleans
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null' || value === '~') return null
  
  // Parse numbers
  if (/^-?\d+$/.test(value)) {
    return parseInt(value, 10)
  }
  if (/^-?\d*\.\d+$/.test(value)) {
    return parseFloat(value)
  }
  
  // Return as string
  return value
}

function parseSimpleXml(xmlString) {
  // Simple XML parser - handles basic XML structures
  const result = {}
  
  // Remove XML declaration and whitespace
  const cleanXml = xmlString.replace(/<\?xml[^>]*\?>/, '').trim()
  
  // Extract root element
  const rootMatch = cleanXml.match(/<(\w+)[^>]*>([\s\S]*)<\/\1>/)
  if (!rootMatch) {
    throw new Error('Invalid XML structure')
  }
  
  const rootName = rootMatch[1]
  const content = rootMatch[2]
  
  result[rootName] = parseXmlContent(content)
  return result
}

function parseXmlContent(content) {
  const result = {}
  const elements = content.match(/<(\w+)[^>]*>([\s\S]*?)<\/\1>/g) || []
  
  elements.forEach(element => {
    const match = element.match(/<(\w+)[^>]*>([\s\S]*?)<\/\1>/)
    if (match) {
      const tagName = match[1]
      const tagContent = match[2].trim()
      
      // Check if content contains more XML elements
      if (tagContent.includes('<')) {
        result[tagName] = parseXmlContent(tagContent)
      } else {
        result[tagName] = tagContent
      }
    }
  })
  
  return result
}

function parseCsvLine(line, delimiter = ',') {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++ // Skip next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}