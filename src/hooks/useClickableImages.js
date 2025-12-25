import { useImageViewer } from '../context/ImageViewerContext'

export function useClickableImages() {
  const { openImage } = useImageViewer()

  const makeImageClickable = (e) => {
    if (e.target.tagName === 'IMG' && !e.target.classList.contains('no-fullpage')) {
      openImage(e.target.src, e.target.alt)
    }
  }

  return { makeImageClickable, openImage }
}
