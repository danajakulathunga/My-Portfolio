import { createContext, useContext, useState, useCallback } from 'react'

const ImageViewerContext = createContext()

export function ImageViewerProvider({ children }) {
  const [image, setImage] = useState(null)
  const [zoom, setZoom] = useState(1)

  const openImage = useCallback((src, alt = '') => {
    setImage({ src, alt })
    setZoom(1)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeImage = useCallback(() => {
    setImage(null)
    setZoom(1)
    document.body.style.overflow = 'unset'
  }, [])

  const updateZoom = useCallback((newZoom) => {
    setZoom(Math.max(1, Math.min(newZoom, 5)))
  }, [])

  return (
    <ImageViewerContext.Provider value={{ image, openImage, closeImage, zoom, updateZoom }}>
      {children}
    </ImageViewerContext.Provider>
  )
}

export function useImageViewer() {
  const context = useContext(ImageViewerContext)
  if (!context) {
    throw new Error('useImageViewer must be used within ImageViewerProvider')
  }
  return context
}
