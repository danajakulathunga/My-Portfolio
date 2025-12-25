import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useState, useEffect, useRef } from 'react'
import { projectsData } from '../data/projectsData'
import '../styles/project-screenshots.css'

function ProjectScreenshots() {
  const { id } = useParams()
  const navigate = useNavigate()
  const projectId = Number(id)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const project = useMemo(() => projectsData.find(p => p.id === projectId), [projectId])
  const images = project?.screenshots?.length ? project.screenshots : (project ? [project.image] : [])

  const [index, setIndex] = useState(0)

  // Lock body scroll when viewer opens
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, images.length])

  // Touch/swipe support
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
    navigate('/', { state: { scrollTo: 'projects' } })
  }

  if (!project) {
    return (
      <div className="viewer-backdrop">
        <div className="viewer-box">
          <div className="viewer-header">
            <h2 className="viewer-title">Project not found</h2>
            <button className="viewer-close" onClick={() => navigate('/')}>Close</button>
          </div>
          <p className="viewer-message">We couldn't locate that project. Return to projects.</p>
          <div className="viewer-actions">
            <button className="viewer-primary" onClick={() => navigate('/#projects')}>Go to Projects</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="viewer-backdrop" role="dialog" aria-label={`${project.title} screenshots`}>
      <div className="viewer-box">
        <div className="viewer-header">
          <h2 className="viewer-title">{project.title} — Screenshots</h2>
          <button className="viewer-close" onClick={handleClose} aria-label="Close viewer">✕</button>
        </div>

        <div
          className="viewer-content"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.length > 1 && (
            <button className="nav-btn nav-prev" onClick={prev} aria-label="Previous image">‹</button>
          )}
          <div className="image-frame">
            <img src={images[index]} alt={`${project.title} screenshot ${index + 1}`} />
          </div>
          {images.length > 1 && (
            <button className="nav-btn nav-next" onClick={next} aria-label="Next image">›</button>
          )}
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
                  aria-label={`Go to image ${i + 1}`}
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

export default ProjectScreenshots
