import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { photosData } from '../data/photosData'
import '../styles/photos-page.css'

function Photos() {
  const navigate = useNavigate()
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [imageErrors, setImageErrors] = useState(new Set())

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
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
                src={photo.src} 
                alt={photo.alt} 
                className="photo-tile-image"
                loading="lazy"
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 320px"
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
