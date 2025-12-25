import { useEffect, useState } from 'react'
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

  // Preload all images
  useEffect(() => {
    photosData.forEach((photo) => {
      const img = new Image()
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, photo.id]))
      }
      img.onerror = () => {
        setImageErrors((prev) => new Set([...prev, photo.id]))
        // Still mark as loaded to prevent indefinite waiting
        setLoadedImages((prev) => new Set([...prev, photo.id]))
      }
      img.src = photo.src
    })
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
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Photos
