import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { triggerSectionAnimation } from '../utils/animationUtils'

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'photography', label: 'Photography' },
  { id: 'contact', label: 'Contact' },
]

function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState('home')
  const [animatingId, setAnimatingId] = useState(null)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId)
    if (!el) return
    const yOffset = -80
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset
    window.scrollTo({ top: y, behavior: 'instant' })
  }

  const handleScroll = (id) => {
    // Trigger animation for the target section
    triggerSectionAnimation(id)

    // Always navigate to main page first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } })
    } else {
      // Already on main page, just scroll
      scrollToSection(id)
    }

    setIsOpen(false)
    setActiveId(id)
    setAnimatingId(id)
    setTimeout(() => setAnimatingId(null), 700)
  }

  useEffect(() => {
    // Use scroll event to reliably track which section is in view
    const updateActiveSection = () => {
      let closestId = 'home'
      let closestDistance = Infinity

      NAV_LINKS.forEach((link) => {
        const el = document.getElementById(link.id)
        if (!el) return

        const rect = el.getBoundingClientRect()
        const distance = Math.abs(rect.top - window.innerHeight * 0.25)

        // Find the section closest to the top 25% of viewport
        if (distance < closestDistance) {
          closestDistance = distance
          closestId = link.id
        }
      })

      setActiveId(closestId)
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true })
    updateActiveSection() // Call once on mount

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
    }
  }, [])

  // Handle scroll state from navigation
  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          const yOffset = -80
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset
          window.scrollTo({ top: y, behavior: 'instant' })
        }
      }, 50)
    }
  }, [location])

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <nav className="navbar-inner">
        <div className="navbar-logo-section">
          <div
            className="navbar-logo"
            onClick={() => handleScroll('home')}
            aria-hidden="true"
          >
            <span className="logo-text">Welcome to My Portfolio</span>
          </div>
        </div>

        <button
          className={`navbar-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar-links ${isOpen ? 'navbar-links-open' : ''}`}>
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id
            const isAnimating = animatingId === link.id
            return (
              <li key={link.id}>
                <button
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  className={`navbar-link ${isActive ? 'active' : ''} ${isAnimating ? 'pulse' : ''}`}
                  onClick={() => handleScroll(link.id)}
                >
                  {link.label}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="navbar-actions-section">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <svg className="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg className="theme-toggle-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar


