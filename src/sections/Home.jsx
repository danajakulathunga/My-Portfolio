import ProfilePicture from '../components/ProfilePicture'
import { useSectionAnimation } from '../hooks/useSectionAnimation'
import { useTypewriter } from '../hooks/useTypewriter'

function Home() {
  const { ref: sectionRef, animateClass } = useSectionAnimation({ threshold: 0.2 })
  const subtitles = ['Full-Stack Developer', 'UI / UX Engineer', 'Photographer']
  const animatedSubtitle = useTypewriter(subtitles, 100, 50, 2000)

  return (
    <section id="home" ref={sectionRef} className={`section home-section ${animateClass}`}>
      <div className="container home-container">
        <div className="home-content">
          <p className="home-eyebrow">Hi, I&apos;m</p>
          <h1 className="home-title">Dhanaja V. Kulathunga</h1>
          <h3 className="home-subtitle">
            <span className="typewriter-text">{animatedSubtitle}</span>
            <span className="typewriter-cursor" aria-hidden="true"></span>
          </h3>
          <p className="home-description">
            I build modern, responsive web/Mobile applicationsand capture meaningful moments through photography. 
I’m a passionate IT undergraduate with hands-on experience in React, MERN stack development, 
and creative visual storytelling. This portfolio showcases my projects, skills, and photography work.

          </p>
          <div className="home-actions">
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn btn-outline">
              Let's Connect
            </a>
          </div>
        </div>

        <div className="home-image-wrapper">
          <ProfilePicture />
        </div>
      </div>
    </section>
  )
}

export default Home


