import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectsData } from '../data/projectsData'
import ProjectActionButtons from '../components/ProjectActionButtons'
import ScreenshotsModal from '../components/ScreenshotsModal'
import { useSectionAnimation } from '../hooks/useSectionAnimation'

function Projects() {
  const navigate = useNavigate()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { ref: sectionRef, animateClass } = useSectionAnimation({ threshold: 0.15, rootMargin: '0px' })

  const filterOptions = useMemo(() => {
    const counts = projectsData.reduce(
      (acc, project) => {
        acc.all += 1
        acc[project.category] = (acc[project.category] || 0) + 1
        return acc
      },
      { all: 0 }
    )

    return [
      { value: 'all', label: 'All Projects', count: counts.all },
      { value: 'Full Stack Web Application', label: 'Full Stack Web Application', count: counts['Full Stack Web Application'] || 0 },
      { value: 'Mobile Application', label: 'Mobile Application', count: counts['Mobile Application'] || 0 },
      { value: 'UI Designs', label: 'UI Designs', count: counts['UI Designs'] || 0 },
    ]
  }, [])

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projectsData
    return projectsData.filter((project) => project.category === selectedCategory)
  }, [selectedCategory])

  const selectedOption = filterOptions.find((opt) => opt.value === selectedCategory) || filterOptions[0]

  const handleScreenshotsClick = (project) => {
    // Navigate to dedicated screenshots viewer page
    navigate(`/screenshots/${project.id}`)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`section projects-section ${animateClass}`}
    >
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Projects</h2>
        </div>

        <div className="projects-filter">
          <button
            type="button"
            className={`filter-toggle ${isFilterOpen ? 'open' : ''}`}
            onClick={() => setIsFilterOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isFilterOpen}
          >
            <span className="filter-value">{`${selectedOption.label} (${selectedOption.count})`}</span>
            <span className="filter-caret" aria-hidden="true">▾</span>
          </button>

          {isFilterOpen && (
            <div className="filter-menu" role="listbox">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`filter-option ${selectedCategory === option.value ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(option.value)
                    setIsFilterOpen(false)
                  }}
                  role="option"
                  aria-selected={selectedCategory === option.value}
                >
                  <span className="option-label">{option.label}</span>
                  <span className="option-count">({option.count})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article key={project.id} className="project-card">
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
              <div className="project-body">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <ul className="project-tech">
                  {project.tech.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <ProjectActionButtons
                  project={project}
                  onScreenshotsClick={handleScreenshotsClick}
                  showGithub={project.title !== 'SignIn/Signup UI Design'}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Screenshots are now handled on a dedicated route */}
    </section>
  )
}

export default Projects

