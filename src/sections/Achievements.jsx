import { achievementsData } from '../data/achievementsData'
import { useSectionAnimation } from '../hooks/useSectionAnimation'

function Achievements() {
  const { ref: sectionRef, animateClass } = useSectionAnimation({ threshold: 0.15, rootMargin: '0px' })

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className={`section achievements-section ${animateClass}`}
    >
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Achievements</h2>
        </div>

        <div className="achievement-grid">
          {achievementsData.map((achievement) => (
            <article key={achievement.id} className="achievement-card">
              <img
                src={new URL(`../assets/images/Achievements/${achievement.image}`, import.meta.url).href}
                alt={achievement.title}
                className="achievement-image"
              />
              <div className="achievement-body">
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-tagline">
                  {achievement.description}
                </p>
                <p className="achievement-copy">
                  {achievement.year}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Achievements


