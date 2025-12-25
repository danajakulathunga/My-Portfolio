import { useNavigate, useLocation } from 'react-router-dom'
import { useMemo, useState, useEffect, useRef } from 'react'
import { photosData } from '../data/photosData'
import '../styles/project-screenshots.css'

function PhotoViewer() {
  const navigate = useNavigate()
  const location = useLocation()
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Allow starting index via query: ?start=10 (optional)
  const startParam = new URLSearchParams(location.search).get('start')
  const startIndex = Math.max(0, Math.min(photosData.length - 1, Number(startParam) || 0))

  const images = useMemo(() => photosData.map(p => p.src), [])
  const [index, setIndex] = useState(startIndex)

  // Lock body scroll when viewer opens, restore on close
  useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  // Keyboard navigation: Left/Right arrows and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, images.length])

  // Touch/swipe gesture support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
  }

  const next = () => setIndex(i => (i + 1) % images.length)
  const prev = () => setIndex(i => (i - 1 + images.length) % images.length)

  const handleClose = () => {
    navigate('/', { state: { scrollTo: 'photography' } })
  }

  return (
    <div className="viewer-backdrop" role="dialog" aria-label="Photography viewer">
      <div className="viewer-box">
        <div className="viewer-header">
          <h2 className="viewer-title">My Photographs</h2>
          <button className="viewer-close" onClick={handleClose} aria-label="Close viewer">✕</button>
        </div>

        <div
          className="viewer-content"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button className="nav-btn nav-prev" onClick={prev} aria-label="Previous image">‹</button>
          <div className="image-frame">
            <img src={images[index]} alt={`Photography ${index + 1}`} />
          </div>
          <button className="nav-btn nav-next" onClick={next} aria-label="Next image">›</button>
        </div>

        {images.length > 1 && (
          <div className="viewer-footer">
            <div className="viewer-info">
              <span>{index + 1} / {images.length}</span>
            </div>
            <div className="thumbnail-strip">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`thumbnail ${i === index ? 'active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to photo ${i + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoViewer
