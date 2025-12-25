import { useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import '../styles/screenshots-modal.css'

function ScreenshotsModal({ project, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !project) return null

  const isCompactProject = project.id === 2 || project.id === 5

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="screenshots-modal-backdrop" onClick={handleBackdropClick}>
      <div className="screenshots-modal">
        <button className="modal-close-button" onClick={onClose} title="Close">
          <MdClose size={28} />
        </button>

        <div className="modal-content">
          <h2 className="modal-title">{project.title} - Screenshots</h2>

          <div className="screenshots-gallery">
            {project.screenshots && project.screenshots.length > 0 ? (
              project.screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className={`screenshot-item ${isCompactProject ? 'screenshot-item-compact' : ''}`}
                >
                  <img
                    src={screenshot}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className={`screenshot-image ${isCompactProject ? 'screenshot-image-compact' : ''}`}
                  />
                </div>
              ))
            ) : (
              <div className="screenshot-item">
                <img
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  className="screenshot-image"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScreenshotsModal
