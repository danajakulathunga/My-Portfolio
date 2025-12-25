import { useEffect, useRef, useState } from 'react'

export function useSectionAnimation(options = {}) {
  const { threshold = 0.25, rootMargin = '0px 0px -10% 0px' } = options
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold, rootMargin }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const animateClass = `animate-section${isVisible ? ' in-view' : ''}`

  return { ref, isVisible, animateClass }
}
