import { useEffect, useRef, useState } from 'react'

function ImageLightbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [src, setSrc] = useState('')
  const [alt, setAlt] = useState('')
  const closeBtnRef = useRef(null)
  const lastFocused = useRef(null)

  // Global click handler for all images
  useEffect(() => {
    const handleImageClick = (event) => {
      const target = event.target
      if (!(target instanceof HTMLImageElement)) return
      if (target.dataset?.noZoom === 'true') return
      setSrc(target.currentSrc || target.src)
      setAlt(target.alt || '')
      lastFocused.current = document.activeElement
      setIsOpen(true)
    }

    document.addEventListener('click', handleImageClick, true)
    return () => document.removeEventListener('click', handleImageClick, true)
  }, [])

  // Handle key events and focus trap
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
      }
      if (event.key === 'Tab') {
        event.preventDefault()
        // keep focus on the close button to maintain trap
        closeBtnRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // focus the close button after open
    setTimeout(() => closeBtnRef.current?.focus(), 0)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      // restore focus
      if (lastFocused.current instanceof HTMLElement) {
        lastFocused.current.focus({ preventScroll: true })
      }
    }
  }, [isOpen])

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={handleOverlayClick}>
      <button
        ref={closeBtnRef}
        type="button"
        className="lightbox-close"
        aria-label="Close image"
        onClick={() => setIsOpen(false)}
      >
        ×
      </button>
      <div className="lightbox-content">
        <img src={src} alt={alt} className="lightbox-image" />
      </div>
    </div>
  )
}

export default ImageLightbox
