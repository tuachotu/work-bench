
const AVAILABLE_TOOLS = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    icon: '📝',
    description: 'Format, minify, and validate JSON',
    category: 'Formatters'
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    icon: '🎲',
    description: 'Generate and validate UUIDs',
    category: 'Generators'
  },
  {
    id: 'timezone-converter',
    name: 'Timezone Converter',
    icon: '🌍',
    description: 'Convert between timezones',
    category: 'Time'
  },
  {
    id: 'epoch-converter',
    name: 'Epoch Converter',
    icon: '⏰',
    description: 'Convert epoch timestamps',
    category: 'Time'
  },
  {
    id: 'date-converter',
    name: 'Date Tools',
    icon: '📅',
    description: 'Format dates, calculate differences, analyze dates',
    category: 'Time'
  },
  {
    id: 'list-compare',
    name: 'List Compare',
    icon: '📊',
    description: 'Compare and analyze lists',
    category: 'Lists'
  },
  {
    id: 'list-dedup',
    name: 'List Dedup',
    icon: '🔄',
    description: 'Remove duplicates from lists',
    category: 'Lists'
  },
  {
    id: 'list-sort',
    name: 'List Sort',
    icon: '🔤',
    description: 'Sort lists in various ways',
    category: 'Lists'
  },
  {
    id: 'list-unique',
    name: 'List Unique',
    icon: '✨',
    description: 'Find unique items in lists',
    category: 'Lists'
  },
  {
    id: 'string-operations',
    name: 'String Operations',
    icon: '🔤',
    description: 'String manipulation tools',
    category: 'Text'
  },
  {
    id: 'data-converter',
    name: 'Data Converter',
    icon: '🔄',
    description: 'Convert between data formats',
    category: 'Conversion'
  },
  {
    id: 'text-processing',
    name: 'Text Processing',
    icon: '📄',
    description: 'Advanced text processing',
    category: 'Text'
  },
  {
    id: 'find-pixel',
    name: 'Find Pixel',
    icon: '🎨',
    description: 'Image pixel analysis',
    category: 'Images'
  }
]


export default function ToolSelector({ onSelect, compact = false }) {
  const handleSelect = (e) => {
    const toolId = e.target.value
    if (toolId) {
      onSelect(toolId)
      e.target.value = '' // Reset dropdown
    }
  }

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem'
      }}>
        <label style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          fontWeight: 500
        }}>
          Add tool:
        </label>
        <select
          onChange={handleSelect}
          defaultValue=""
          style={{
            padding: '0.5rem',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            minWidth: '160px'
          }}
        >
          <option value="" disabled>Select tool...</option>
          {AVAILABLE_TOOLS.map(tool => (
            <option key={tool.id} value={tool.id}>
              {tool.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
      justifyContent: 'center'
    }}>
      <label style={{
        fontSize: '1.125rem',
        color: 'var(--text-primary)',
        fontWeight: 600
      }}>
        Add tool:
      </label>
      <select
        onChange={handleSelect}
        defaultValue=""
        style={{
          padding: '0.75rem',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          minWidth: '200px'
        }}
      >
        <option value="" disabled>Select tool...</option>
        {AVAILABLE_TOOLS.map(tool => (
          <option key={tool.id} value={tool.id}>
            {tool.name}
          </option>
        ))}
      </select>
    </div>
  )
}

