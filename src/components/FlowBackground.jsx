import { useEffect, useRef } from 'react'

function FlowBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const dpiRef = useRef(1)
  const linesRef = useRef([])
  const colorsRef = useRef({ accent: '#6366f1', muted: 'rgba(148, 163, 184, 0.3)' })
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const readThemeColors = () => {
    const styles = getComputedStyle(document.documentElement)
    const accent = styles.getPropertyValue('--accent')?.trim() || '#6366f1'
    const mut = styles.getPropertyValue('--muted')?.trim() || 'rgba(148, 163, 184, 0.6)'
    colorsRef.current = { accent, muted: mut }
  }

  const resize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpi = window.devicePixelRatio || 1
    dpiRef.current = dpi
    canvas.width = Math.floor(rect.width * dpi)
    canvas.height = Math.floor(rect.height * dpi)
  }

  const initLines = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.width
    const h = canvas.height
    const count = 6 // number of flowing lines
    linesRef.current = Array.from({ length: count }, (_, i) => {
      const amplitude = (h / 10) + Math.random() * (h / 12)
      // Slower speeds for a calmer wave motion (approx 3-4x slower)
      const speed = 0.00025 + Math.random() * 0.00035
      const phase = Math.random() * Math.PI * 2
      const thickness = 0.8 + Math.random() * 0.9
      const offsetY = (h / (count + 1)) * (i + 1)
      const direction = Math.random() < 0.5 ? -1 : 1
      return { amplitude, speed: speed * direction, phase, thickness, offsetY }
    })
  }

  const draw = (time) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const dpi = dpiRef.current

    ctx.clearRect(0, 0, w, h)

    const { accent, muted } = colorsRef.current

    linesRef.current.forEach((line, idx) => {
      const t = time * line.speed + line.phase
      const points = []
      const segments = 12 // number of control points along the width
      for (let i = 0; i <= segments; i++) {
        const x = (w / segments) * i
        const y = line.offsetY + Math.sin(t + i * 0.6) * line.amplitude
        points.push({ x, y })
      }

      // Create a smooth path using quadratic curves
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const midX = (prev.x + curr.x) / 2
        const midY = (prev.y + curr.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
      }

      // subtle gradient per line
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, `${muted}`)
      grad.addColorStop(0.5, `${accent}`)
      grad.addColorStop(1, `${muted}`)
      ctx.strokeStyle = grad
      ctx.globalAlpha = 0.12 + (idx % 3) * 0.02
      ctx.lineWidth = line.thickness * dpi
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.stroke()
    })

    animationRef.current = requestAnimationFrame(draw)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    readThemeColors()
    resize()
    initLines()

    let resizeObserver
    const handleResize = () => { resize(); initLines() }
    window.addEventListener('resize', handleResize)

    // react to theme changes (data-theme attribute)
    const mo = new MutationObserver(() => readThemeColors())
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    if (!reduceMotion) {
      animationRef.current = requestAnimationFrame(draw)
    } else {
      // draw static frame
      draw(0)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      mo.disconnect()
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="flow-background-canvas"
      aria-hidden="true"
    />
  )
}

export default FlowBackground
