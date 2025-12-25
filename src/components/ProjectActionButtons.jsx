import { FaGithub } from 'react-icons/fa'
import { MdPhotoLibrary } from 'react-icons/md'
import '../styles/project-buttons.css'

function ProjectActionButtons({ project, onScreenshotsClick, showGithub = true }) {
  const handleGithubClick = () => {
    window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="project-actions">
      {showGithub && (
        <button
          className="action-button github-button"
          onClick={handleGithubClick}
          title="View GitHub Repository"
        >
          <FaGithub className="button-icon" />
          GitHub Repo
        </button>
      )}
      <button
        className="action-button screenshots-button"
        onClick={() => onScreenshotsClick(project)}
        title="View Project Screenshots"
      >
        <MdPhotoLibrary className="button-icon" />
        Screenshots
      </button>
    </div>
  )
}

export default ProjectActionButtons
