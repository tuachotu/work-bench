import { useState, lazy, Suspense } from 'react'

// Lazy load all tools for better performance
const JsonFormatter = lazy(() => import('../JsonFormatter/JsonFormatter'))
const UidGenerator = lazy(() => import('../UidGenerator/UidGenerator'))
const TimezoneConverter = lazy(() => import('../TimezoneConverter/TimezoneConverter'))
const EpochConverter = lazy(() => import('../EpochConverter/EpochConverter'))
const DateConverter = lazy(() => import('../DateConverter/DateConverter'))
const ListCompare = lazy(() => import('../ListCompare/ListCompare'))
const ListDedup = lazy(() => import('../ListDedup/ListDedup'))
const ListSort = lazy(() => import('../ListSort/ListSort'))
const ListUnique = lazy(() => import('../ListUnique/ListUnique'))
const StringOperations = lazy(() => import('../StringOperations/StringOperations'))
const DataConverter = lazy(() => import('../DataConverter/DataConverter'))
const TextProcessing = lazy(() => import('../TextProcessing/TextProcessing'))
const FindPixel = lazy(() => import('../FindPixel/FindPixel'))

const TOOL_COMPONENTS = {
  'json-formatter': JsonFormatter,
  'uuid-generator': UidGenerator,
  'timezone-converter': TimezoneConverter,
  'epoch-converter': EpochConverter,
  'date-converter': DateConverter,
  'list-compare': ListCompare,
  'list-dedup': ListDedup,
  'list-sort': ListSort,
  'list-unique': ListUnique,
  'string-operations': StringOperations,
  'data-converter': DataConverter,
  'text-processing': TextProcessing,
  'find-pixel': FindPixel,
}

const TOOL_NAMES = {
  'json-formatter': 'JSON Formatter',
  'uuid-generator': 'UUID Generator',
  'timezone-converter': 'Timezone Converter',
  'epoch-converter': 'Epoch Converter',
  'date-converter': 'Date Tools',
  'list-compare': 'List Compare',
  'list-dedup': 'List Dedup',
  'list-sort': 'List Sort',
  'list-unique': 'List Unique',
  'string-operations': 'String Operations',
  'data-converter': 'Data Converter',
  'text-processing': 'Text Processing',
  'find-pixel': 'Find Pixel',
}

const TOOL_ICONS = {
  'json-formatter': '📝',
  'uuid-generator': '🎲',
  'timezone-converter': '🌍',
  'epoch-converter': '⏰',
  'date-converter': '📅',
  'list-compare': '📊',
  'list-dedup': '🔄',
  'list-sort': '🔤',
  'list-unique': '✨',
  'string-operations': '🔤',
  'data-converter': '🔄',
  'text-processing': '📄',
  'find-pixel': '🎨',
}

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        animation: 'spin 1s linear infinite',
        fontSize: '2rem'
      }}>
        ⚙️
      </div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function ToolCell({ 
  cellId, 
  toolType, 
  customName,
  position, 
  onRemove, 
  onDuplicate, 
  onUpdateName,
  onMoveUp, 
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  isDragOver
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(customName || '')

  const ToolComponent = TOOL_COMPONENTS[toolType]
  const toolName = TOOL_NAMES[toolType] || 'Unknown Tool'
  const toolIcon = TOOL_ICONS[toolType] || '🛠️'
  const displayName = customName || toolName

  const handleSaveName = () => {
    onUpdateName(cellId, editName)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(customName || '')
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  if (!ToolComponent) {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1rem',
        color: 'var(--text-secondary)'
      }}>
        Tool "{toolType}" not found
      </div>
    )
  }

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, cellId)}
      onDragOver={(e) => onDragOver && onDragOver(e)}
      onDrop={(e) => onDrop && onDrop(e, position)}
      style={{
        background: 'var(--bg-secondary)',
        border: `2px solid ${isDragOver ? 'var(--accent-color, #0066cc)' : 'var(--border-color)'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        cursor: 'grab'
      }}
      onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
      onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
    >
      {/* Cell Header */}
      <div style={{
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        position: 'relative'
      }}>
        {/* Drag Handle */}
        <div style={{
          cursor: 'grab',
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          ⋮⋮
        </div>

        {/* Cell Number */}
        <div style={{
          background: 'var(--accent-color, #0066cc)',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {position + 1}
        </div>

        {/* Tool Info */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>{toolIcon}</span>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveName}
                placeholder={toolName}
                autoFocus
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--accent-color, #0066cc)',
                  borderRadius: '4px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  flex: 1,
                  minWidth: '120px'
                }}
              />
              <button
                onClick={handleSaveName}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                ✓
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <span style={{
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}>
                {displayName}
              </span>
              {customName && (
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic'
                }}>
                  ({toolName})
                </span>
              )}
              <button
                onClick={() => {
                  setEditName(customName || '')
                  setIsEditing(true)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: '0.25rem',
                  opacity: 0.7,
                  transition: 'opacity 0.2s'
                }}
                title="Edit name"
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0.7}
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        {/* Cell Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {/* Collapse/Expand */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '📂' : '📁'}
          </button>

          {/* Menu Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}
              title="Cell Actions"
            >
              ⋯
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10
                  }}
                  onClick={() => setShowMenu(false)}
                />
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 20,
                  minWidth: '160px'
                }}>
                  {onMoveUp && (
                    <button
                      onClick={() => {
                        onMoveUp()
                        setShowMenu(false)
                      }}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem'
                      }}
                    >
                      ⬆️ Move Up
                    </button>
                  )}
                  {onMoveDown && (
                    <button
                      onClick={() => {
                        onMoveDown()
                        setShowMenu(false)
                      }}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem'
                      }}
                    >
                      ⬇️ Move Down
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onDuplicate(cellId)
                      setShowMenu(false)
                    }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}
                  >
                    📋 Duplicate
                  </button>
                  <button
                    onClick={() => {
                      setEditName(customName || '')
                      setIsEditing(true)
                      setShowMenu(false)
                    }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}
                  >
                    ✏️ Rename
                  </button>
                  <hr style={{
                    margin: 0,
                    border: 'none',
                    borderTop: '1px solid var(--border-color)'
                  }} />
                  <button
                    onClick={() => {
                      onRemove(cellId)
                      setShowMenu(false)
                    }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'var(--error-color, #dc3545)',
                      fontSize: '0.875rem'
                    }}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tool Content */}
      {!isCollapsed && (
        <div style={{
          background: 'var(--bg-primary)',
          minHeight: '400px'
        }}>
          <Suspense fallback={<LoadingSpinner />}>
            <ToolComponent />
          </Suspense>
        </div>
      )}
    </div>
  )
}