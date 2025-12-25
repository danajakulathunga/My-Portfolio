import './index.css'
import './styles/global.css'
import './styles/navbar.css'
import './styles/home.css'
import './styles/about.css'
import './styles/achievements.css'
import './styles/projects.css'
import './styles/photography.css'
import './styles/contact.css'
import './styles/photos-page.css'
import './styles/lightbox.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ImageViewerProvider } from './context/ImageViewerContext'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ImageLightbox from './components/ImageLightbox.jsx'
import FlowBackground from './components/FlowBackground.jsx'
import './styles/flow-background.css'
import ImageFullpageViewer from './components/ImageFullpageViewer.jsx'

import Home from './sections/Home.jsx'
import About from './sections/About.jsx'
import Projects from './sections/Projects.jsx'
import Achievements from './sections/Achievements.jsx'
import Photography from './sections/Photography.jsx'
import Photos from './sections/Photos'
import Contact from './sections/Contact.jsx'
import ProjectScreenshots from './pages/ProjectScreenshots.jsx'

import { useClickableImages } from './hooks/useClickableImages'

function AppContent() {
  const { makeImageClickable } = useClickableImages()

  const mainSections = (
    <>
      <Home />
      <About />
      <Projects />
      <Achievements />
      <Photography />
      <Contact />
    </>
  )

  return (
    <Router>
      <div className="app" onClick={makeImageClickable}>
        <FlowBackground />
        <Navbar />
        <main>
          <Routes>
            <Route path="/photos" element={<Photos />} />
            <Route path="/screenshots/:id" element={<ProjectScreenshots />} />
            <Route path="/" element={mainSections} />
            <Route path="/home" element={mainSections} />
            <Route path="/about" element={mainSections} />
            <Route path="/projects" element={mainSections} />
            <Route path="/achievements" element={mainSections} />
            <Route path="/photography" element={mainSections} />
            <Route path="/contact" element={mainSections} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
        <ImageLightbox />
        <ImageFullpageViewer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ImageViewerProvider>
        <AppContent />
      </ImageViewerProvider>
    </ThemeProvider>
  )
}

export default App
