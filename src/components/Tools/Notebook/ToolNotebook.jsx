import { useState, useCallback } from 'react'
import ToolCell from './ToolCell'
import ToolSelector from './ToolSelector'

export default function ToolNotebook() {
  const [cells, setCells] = useState([])
  const [nextId, setNextId] = useState(1)
  const [draggedCell, setDraggedCell] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const addCell = useCallback((toolType) => {
    const newCell = {
      id: nextId,
      toolType,
      customName: '', // Always start with empty custom name
      position: cells.length
    }
    setCells(prev => [...prev, newCell])
    setNextId(prev => prev + 1)
  }, [cells.length, nextId])

  const removeCell = useCallback((cellId) => {
    setCells(prev => prev.filter(cell => cell.id !== cellId))
  }, [])

  const updateCellName = useCallback((cellId, customName) => {
    setCells(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, customName } : cell
    ))
  }, [])

  const moveCell = useCallback((fromIndex, toIndex) => {
    setCells(prev => {
      const newCells = [...prev]
      const [movedCell] = newCells.splice(fromIndex, 1)
      newCells.splice(toIndex, 0, movedCell)
      
      return newCells.map((cell, index) => ({
        ...cell,
        position: index
      }))
    })
  }, [])

  const duplicateCell = useCallback((cellId) => {
    const cellToClone = cells.find(cell => cell.id === cellId)
    if (cellToClone) {
      const newCell = {
        ...cellToClone,
        id: nextId,
        customName: cellToClone.customName ? `${cellToClone.customName} (Copy)` : '',
        position: cellToClone.position + 1
      }
      
      setCells(prev => {
        const newCells = [...prev]
        const insertIndex = cellToClone.position + 1
        newCells.splice(insertIndex, 0, newCell)
        
        return newCells.map((cell, index) => ({
          ...cell,
          position: index
        }))
      })
      
      setNextId(prev => prev + 1)
    }
  }, [cells, nextId])

  const handleDragStart = useCallback((e, cellId) => {
    setDraggedCell(cellId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e, targetIndex) => {
    e.preventDefault()
    
    if (!draggedCell) return
    
    const draggedIndex = cells.findIndex(cell => cell.id === draggedCell)
    if (draggedIndex === -1 || draggedIndex === targetIndex) return
    
    moveCell(draggedIndex, targetIndex)
    setDraggedCell(null)
    setDragOverIndex(null)
  }, [draggedCell, cells, moveCell])

  const handleDragEnd = useCallback(() => {
    setDraggedCell(null)
    setDragOverIndex(null)
  }, [])

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem',
        textAlign: 'center',
        flexShrink: 0
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          fontFamily: 'var(--font-mono)'
        }}>
          📓 Tool Notebook
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          margin: '0.5rem 0 0 0',
          fontFamily: 'var(--font-mono)'
        }}>
          Combine multiple tools in a notebook-style workflow
        </p>
      </div>

      {/* Notebook Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Initial Add Tool Button */}
        {cells.length === 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4rem 0'
          }}>
            <ToolSelector onSelect={addCell} />
          </div>
        )}

        {/* Render Cells */}
        {cells.map((cell, index) => (
          <div 
            key={cell.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <ToolCell
              cellId={cell.id}
              toolType={cell.toolType}
              customName={cell.customName}
              position={cell.position}
              onRemove={removeCell}
              onDuplicate={duplicateCell}
              onUpdateName={updateCellName}
              onMoveUp={index > 0 ? () => moveCell(index, index - 1) : null}
              onMoveDown={index < cells.length - 1 ? () => moveCell(index, index + 1) : null}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggedCell === cell.id}
              isDragOver={dragOverIndex === index}
            />
            
            {/* Add Tool Button Between Cells */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '1rem 0'
            }}>
              <ToolSelector 
                onSelect={(toolType) => {
                  const newCell = {
                    id: nextId,
                    toolType,
                    customName: '', // Always start with empty custom name
                    position: index + 1
                  }
                  
                  setCells(prev => {
                    const newCells = [...prev]
                    newCells.splice(index + 1, 0, newCell)
                    
                    return newCells.map((cell, idx) => ({
                      ...cell,
                      position: idx
                    }))
                  })
                  
                  setNextId(prev => prev + 1)
                }}
                compact={true}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      {cells.length > 0 && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          flexShrink: 0
        }}>
          <div>
            {cells.length} tool{cells.length !== 1 ? 's' : ''} in notebook
          </div>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Tool Notebook - work-bench.dev',
                  text: 'Check out this Jupyter-style tool collection',
                  url: window.location.href
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                  .then(() => alert('Link copied to clipboard!'))
                  .catch(() => alert('Could not copy link'))
              }
            }}
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--bg-primary)'
              e.target.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none'
              e.target.style.color = 'var(--text-secondary)'
            }}
          >
            🔗 Share
          </button>
        </div>
      )}
    </div>
  )
}