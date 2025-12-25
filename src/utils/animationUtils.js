export function triggerSectionAnimation(sectionId) {
  const el = document.getElementById(sectionId)
  if (!el) return

  // Only re-trigger if this section uses the animate-section pattern
  if (!el.classList.contains('animate-section')) return

  el.classList.remove('in-view')
  // Force reflow so the animation can restart
  // eslint-disable-next-line no-unused-expressions
  el.offsetWidth
  requestAnimationFrame(() => {
    el.classList.add('in-view')
  })
}
