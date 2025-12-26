import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { photosData } from '../data/photosData'
import '../styles/photos-page.css'

function Photos() {
  const navigate = useNavigate()
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [imageErrors, setImageErrors] = useState(new Set())
  const imageRefs = useRef({})
  const preloadedImages = useRef(new Map())

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // Aggressive preloading: Start loading images immediately
  useEffect(() => {
    const preloadImage = (photo) => {
      return new Promise((resolve) => {
        const img = new Image()
        
        img.onload = () => {
          preloadedImages.current.set(photo.id, img)
          setLoadedImages((prev) => new Set([...prev, photo.id]))
          resolve({ id: photo.id, success: true })
        }
        
        img.onerror = () => {
          setImageErrors((prev) => new Set([...prev, photo.id]))
          setLoadedImages((prev) => new Set([...prev, photo.id]))
          resolve({ id: photo.id, success: false })
        }
        
        // Set src to trigger loading
        img.src = photo.src
      })
    }

    // Preload images in batches to avoid overwhelming the browser
    const batchSize = 10
    let currentBatch = 0

    const loadBatch = () => {
      const start = currentBatch * batchSize
      const end = Math.min(start + batchSize, photosData.length)
      const batch = photosData.slice(start, end)

      Promise.all(batch.map(preloadImage)).then(() => {
        currentBatch++
        if (currentBatch * batchSize < photosData.length) {
          // Small delay between batches to prevent browser throttling
          setTimeout(loadBatch, 50)
        }
      })
    }

    loadBatch()
  }, [])

  const handleImageLoad = useCallback((photoId) => {
    setLoadedImages((prev) => new Set([...prev, photoId]))
  }, [])

  const handleImageError = useCallback((photoId) => {
    setImageErrors((prev) => new Set([...prev, photoId]))
    setLoadedImages((prev) => new Set([...prev, photoId]))
  }, [])

  const handleBackClick = () => {
    navigate('/', { state: { scrollTo: 'photography' } })
  }

  return (
    <section className="photos-page">
      <button
        type="button"
        className="photos-back-button"
        onClick={handleBackClick}
        aria-label="Go back to photography"
      >
        {'<'} Back
      </button>

      <div className="photos-page-header">
        <h1 className="photos-page-title">Photography Gallery</h1>
      </div>

      <div className="container">
        <div className="photos-grid">
          {photosData.map((photo) => (
            <div 
              key={photo.id} 
              className={`photo-tile ${loadedImages.has(photo.id) ? 'loaded' : 'loading'} ${imageErrors.has(photo.id) ? 'error' : ''}`}
            >
              <img 
                ref={(el) => (imageRefs.current[photo.id] = el)}
                src={photo.src} 
                alt={photo.alt} 
                className="photo-tile-image"
                loading="eager"
                decoding="async"
                onLoad={() => handleImageLoad(photo.id)}
                onError={() => handleImageError(photo.id)}
                style={{ 
                  opacity: loadedImages.has(photo.id) ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
              {!loadedImages.has(photo.id) && !imageErrors.has(photo.id) && (
                <div className="photo-tile-skeleton" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Photos
