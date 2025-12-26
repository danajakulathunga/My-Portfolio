import { useImageViewer } from '../context/ImageViewerContext'
import { useRef, useEffect, useState } from 'react'
import '../styles/image-fullpage-viewer.css'

function ImageFullpageViewer() {
  const { image, closeImage, zoom, updateZoom } = useImageViewer()
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  // Handle mouse wheel zoom
  useEffect(() => {
    if (!image) return

    const handleWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      updateZoom(zoom + delta)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel)
    }
  }, [image, zoom, updateZoom])

  // Track cursor position for zoom center
  const handleMouseMove = (e) => {
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    setCursorPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeImage()
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && image) {
        closeImage()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [image, closeImage])

  if (!image) return null

  return (
    <div
      className="fullpage-viewer-backdrop"
      ref={containerRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-label="Full page image viewer"
    >
      <div className="fullpage-viewer-container" onMouseMove={handleMouseMove}>
        <img
          ref={imgRef}
          src={image.src}
          alt={image.alt}
          className="fullpage-viewer-image"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: `${cursorPos.x}% ${cursorPos.y}%`,
          }}
        />
      </div>

      <button
        className="fullpage-viewer-close"
        onClick={closeImage}
        aria-label="Close image viewer"
        title="Press Esc to close"
      >
        ✕
      </button>

      {zoom > 1 && (
        <div className="fullpage-viewer-hint">
          Scroll up/down to Zoom in/out | Move cursor point | Click to close | "Esc" to back
        </div>
      )}
    </div>
  )
}

export default ImageFullpageViewer
