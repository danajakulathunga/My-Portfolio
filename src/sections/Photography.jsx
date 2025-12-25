import { useNavigate } from 'react-router-dom'
import { useSectionAnimation } from '../hooks/useSectionAnimation'
import { photosData } from '../data/photosData'
import { useState, useEffect } from 'react'

function Photography() {
  const navigate = useNavigate()
  const { ref: sectionRef, animateClass } = useSectionAnimation({ threshold: 0.2 })
  const [loadedImages, setLoadedImages] = useState(new Set())

  // Select specific photos by their file names: 1(70), 1(61), 1(34)
  // These correspond to indices 63, 54, 27 in the photosData array
  const previewPhotos = [photosData[63], photosData[54], photosData[27]].filter(Boolean)

  // Preload images when component mounts
  useEffect(() => {
    previewPhotos.forEach((photo) => {
      const img = new Image()
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, photo.id]))
      }
      img.onerror = () => {
        // Still mark as loaded to prevent indefinite waiting
        setLoadedImages((prev) => new Set([...prev, photo.id]))
      }
      img.src = photo.src
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="photography"
      className={`section photography-section ${animateClass}`}
    >
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Photography</h2>
          <p className="section-subtitle">
            I am currently a mobile photographer. I capture creative, high-quality moments using my mobile phone, turning everyday scenes into compelling visuals. Here are some of my favorite shots.
          </p>
        </div>

        <div className="photography-grid">
          {previewPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className={`photo-card ${loadedImages.has(photo.id) ? 'loaded' : 'loading'}`}
            >
              <img 
                src={photo.src} 
                alt={photo.alt} 
                className="photo-image"
                loading="eager"
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div className="photography-view-more">
          <button
            className="view-more-btn"
            onClick={() => navigate('/photos')}
          >
            <span>View More</span>
            <span aria-hidden>{'>'}</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Photography


