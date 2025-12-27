import { useSectionAnimation } from '../hooks/useSectionAnimation'

const SkillPill = ({ children }) => (
  <span className="skill-pill">{children}</span>
)

const ProgressBar = ({ label, percent }) => (
  <div className="skill-bar">
    <div className="skill-bar-header">
      <span>{label}</span>
      <span>{percent}</span>
    </div>
    <div className="skill-bar-track" aria-hidden>
      <div className="skill-bar-fill" style={{ ['--percent']: percent }} />
    </div>
  </div>
)

function About() {
  const { ref: sectionRef, isVisible, animateClass } = useSectionAnimation({ threshold: 0.15, rootMargin: '0px' })

  const skills = [
    'HTML',
    'CSS',
    'Java',
    'python',
    'JavaScript',
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'Android Development',
    'Photography',
    'Figma'  
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`section about-section about-section--gradient ${animateClass}`}
    >
      <div className="container about-container">
        <div className="section-header about-header">
          <h2 className="section-title">About Me</h2>
        </div>

        <div className={`about-layout ${isVisible ? 'animate' : ''}`}>
          <article className="about-panel about-intro-panel">
            <p className="about-intro-text">
              I am an enthusiastic and hardworking undergraduate following a BSc (Hons) in Information Technology, specializing in IT at SLIIT University. I have a strong foundation in programming and application development, with hands-on experience in Java, Python, C++, Kotlin, and full-stack web technologies such as HTML, CSS, JavaScript, and the MERN stack.
            </p>

            <p className="about-intro-text">
              I’m also skilled in Android appdevelopment using Android SDK. Eager to gain real-world industry exposure through an internship, I am committed to applying my skills in a dynamic team environment while continuously learning and growing as a developer. Finally, I engage in photography as a hobby.
            </p>
          </article>

          <article className="about-panel about-skills-panel">
            <h3 className="about-skills-title">Core Skills</h3>

            <div className="about-skill-tags">
              {skills.map((s) => (
                <SkillPill key={s}>{s}</SkillPill>
              ))}
            </div>

            <div className="about-skill-bars">
              <ProgressBar label="Frontend" percent="90%" />
              <ProgressBar label="Backend" percent="75%" />
              <ProgressBar label="Photography" percent="90%" />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default About


