import ProfilePicture from "../components/ProfilePicture";
import { useSectionAnimation } from "../hooks/useSectionAnimation";
import { useTypewriter } from "../hooks/useTypewriter";
import { triggerSectionAnimation } from "../utils/animationUtils";

function Home() {
  const { ref: sectionRef, animateClass } = useSectionAnimation({
    threshold: 0.15,
    rootMargin: "0px",
  });
  const subtitles = [
    "Full-Stack Developer",
    "UI / UX Engineer",
    "Photographer",
  ];
  const animatedSubtitle = useTypewriter(subtitles, 100, 50, 2000);

  const scrollToProjects = (event) => {
    event.preventDefault();
    const target = document.getElementById("projects");
    if (!target) return;

    // Trigger animation before scrolling
    triggerSectionAnimation("projects");

    const navbar = document.querySelector(".navbar");
    const navHeight = navbar?.offsetHeight || 0;
    const extra = window.matchMedia("(max-width: 768px)").matches ? 18 : 10;
    const offset = navHeight + extra;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className={`section home-section ${animateClass}`}
    >
      <div className="container home-container">
        <div className="home-content">
          <p className="home-eyebrow">Hi, I&apos;m</p>
          <h1 className="home-title">Dhanaja V. Kulathunga</h1>
          <h3 className="home-subtitle">
            <span className="typewriter-text">{animatedSubtitle}</span>
            <span className="typewriter-cursor" aria-hidden="true"></span>
          </h3>
          <p className="home-description">
            I build modern, responsive web/Mobile applicationsand capture
            meaningful moments through photography. I’m a passionate IT
            undergraduate with hands-on experience in React, MERN stack
            development, and creative visual storytelling. This portfolio
            showcases my projects, skills, and photography work.
          </p>
          <div className="home-actions">
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={scrollToProjects}
              onTouchStart={scrollToProjects}
            >
              View Projects
            </a>
            <a href="#contact" className="btn btn-outline">
              Connect With Me
            </a>
            <a
              href="/src/assets/My CV/My CV New.pdf"
              download
              className="btn btn-cv"
              title="Download My CV"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download My CV
            </a>
          </div>
        </div>

        <div className="home-image-wrapper">
          <ProfilePicture />
        </div>
      </div>
    </section>
  );
}

export default Home;
