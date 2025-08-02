import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FindPixel() {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [clickPosition, setClickPosition] = useState(null)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const imageRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setClickPosition(null)
    }
  }

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current
      setImageDimensions({ width: naturalWidth, height: naturalHeight })
    }
  }

  const getCoordinatesFromEvent = (event) => {
    if (!imageRef.current || imageDimensions.width === 0 || imageDimensions.height === 0) return null

    const rect = imageRef.current.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top
    
    // Check if click is within the image bounds
    if (clickX < 0 || clickY < 0 || clickX > rect.width || clickY > rect.height) {
      return null
    }
    
    // Since image now displays at natural aspect ratio (maxWidth: 100%, height: auto),
    // the displayed image fills the entire img element bounds
    const scaleX = imageDimensions.width / rect.width
    const scaleY = imageDimensions.height / rect.height
    
    // Calculate actual pixel coordinates
    const actualX = Math.round(clickX * scaleX)
    const actualY = Math.round(clickY * scaleY)
    
    return { x: actualX, y: actualY, displayX: clickX, displayY: clickY }
  }

  const handleMouseDown = (event) => {
    event.preventDefault()
    const coords = getCoordinatesFromEvent(event)
    if (coords) {
      setClickPosition(coords)
      setIsDragging(true)
    }
  }

  const handleMouseMove = (event) => {
    if (!isDragging) return
    event.preventDefault()
    
    const coords = getCoordinatesFromEvent(event)
    if (coords) {
      setClickPosition(coords)
    }
  }

  const handleMouseUp = (event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleMouseLeave = (event) => {
    setIsDragging(false)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleClearImage = () => {
    setSelectedImage(null)
    setImageUrl('')
    setClickPosition(null)
    setImageDimensions({ width: 0, height: 0 })
    setIsDragging(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
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
            Find Pixel Tool
          </h1>
        </div>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '1rem',
          fontFamily: 'var(--font-mono)' 
        }}>
          Upload an image and click or drag anywhere to get pixel coordinates
        </p>
      </div>

      {/* Image Display Section - Top */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        {imageUrl ? (
          <div style={{
            position: 'relative',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            overflow: 'auto',
            cursor: isDragging ? 'grabbing' : 'crosshair',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Uploaded for pixel detection"
              onLoad={handleImageLoad}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
                userSelect: 'none'
              }}
            />
            
            {/* Crosshair */}
            {clickPosition && (
              <>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute',
                  left: `${clickPosition.displayX - 1}px`,
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'var(--accent-color)',
                  pointerEvents: 'none',
                  zIndex: 2
                }} />
                {/* Horizontal line */}
                <div style={{
                  position: 'absolute',
                  top: `${clickPosition.displayY - 1}px`,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--accent-color)',
                  pointerEvents: 'none',
                  zIndex: 2
                }} />
                {/* Center dot */}
                <div style={{
                  position: 'absolute',
                  left: `${clickPosition.displayX - 4}px`,
                  top: `${clickPosition.displayY - 4}px`,
                  width: '8px',
                  height: '8px',
                  border: '2px solid var(--accent-color)',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  pointerEvents: 'none',
                  zIndex: 3
                }} />
              </>
            )}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '1rem',
            fontFamily: 'var(--font-mono)',
            textAlign: 'center',
            border: '2px dashed var(--border-color)',
            borderRadius: '8px',
            padding: '3rem',
            minHeight: '400px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
            <div style={{ marginBottom: '0.5rem' }}>No image selected</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Click "Upload Image" to get started
            </div>
          </div>
        )}
      </div>

      {/* Controls and Info Section - Bottom, Horizontal Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {/* Upload Controls */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Controls
          </h3>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handleUploadClick}
              className="btn"
            >
              📁 Upload Image
            </button>
            {selectedImage && (
              <button 
                onClick={handleClearImage}
                className="btn btn-secondary"
              >
                🗑️ Clear Image
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* File Info */}
        {selectedImage && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--accent-color)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)'
            }}>
              File Info
            </h3>
            
            <div style={{
              fontSize: '0.875rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              <div><strong>File:</strong> {selectedImage.name}</div>
              <div><strong>Size:</strong> {(selectedImage.size / 1024).toFixed(1)} KB</div>
              {imageDimensions.width > 0 && (
                <div><strong>Dimensions:</strong> {imageDimensions.width} × {imageDimensions.height} px</div>
              )}
            </div>
          </div>
        )}

        {/* Coordinates Display */}
        {clickPosition && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--accent-color)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--accent-color)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)'
            }}>
              Pixel Coordinates
            </h3>
            
            <div style={{
              fontSize: '1.25rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-color)',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              ({clickPosition.x}, {clickPosition.y})
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              X: {clickPosition.x} • Y: {clickPosition.y}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}