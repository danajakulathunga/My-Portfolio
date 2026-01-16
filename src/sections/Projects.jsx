import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { projectsData } from "../data/projectsData";
import ProjectActionButtons from "../components/ProjectActionButtons";
import { useSectionAnimation } from "../hooks/useSectionAnimation";
import M3Video from "../assets/images/projects/M3.mp4";

// Video Preview Component for Project ID 7
const VideoPreview = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const controlsTimeoutRef = useRef(null);

  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && document.fullscreenElement) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setShowControls(true);
        // Auto-hide controls after 3 seconds in fullscreen
        resetControlsTimeout();
      } else {
        // Exited fullscreen - pause the video
        video.pause();
        setIsPlaying(false);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [resetControlsTimeout]);

  const handleVideoClick = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Request fullscreen
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        await video.webkitRequestFullscreen();
      } else if (video.mozRequestFullScreen) {
        await video.mozRequestFullScreen();
      } else if (video.msRequestFullscreen) {
        await video.msRequestFullscreen();
      }

      // Start playing only after entering fullscreen
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error entering fullscreen or playing video:", error);
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Number.parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted || volume === 0) {
      video.muted = false;
      video.volume = volume > 0 ? volume : 0.5;
      setVolume(volume > 0 ? volume : 0.5);
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const formatTime = (seconds) => {
    if (Number.isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <video
        ref={videoRef}
        src={videoSrc}
        className="project-image project-video"
        style={{ cursor: "pointer", objectFit: "contain", aspectRatio: "4/3" }}
        onClick={
          document.fullscreenElement ? togglePlayPause : handleVideoClick
        }
        onMouseMove={
          document.fullscreenElement ? resetControlsTimeout : undefined
        }
        preload="metadata"
        playsInline={false}
      >
        <track kind="captions" />
      </video>

      {/* Play button overlay (only visible when not in fullscreen) */}
      {!document.fullscreenElement && (
        <button
          type="button"
          className="video-play-overlay"
          onClick={handleVideoClick}
          aria-label="Play video in fullscreen"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.5)",
            border: "none",
            padding: "0",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            style={{ marginLeft: "3px" }}
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {/* Premium Custom Controls (only in fullscreen) */}
      {document.fullscreenElement && (
        <div
          className={`custom-video-controls ${showControls ? "show" : ""}`}
          onMouseEnter={() => setShowControls(true)}
          onMouseMove={resetControlsTimeout}
          role="toolbar"
          aria-label="Video controls"
        >
          {/* Seek Bar */}
          <button
            type="button"
            className="video-progress-container"
            onClick={handleSeek}
            aria-label="Seek video"
          >
            <div className="video-progress-bar">
              <div
                className="video-progress-filled"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </button>

          {/* Controls Bar */}
          <div className="video-controls-bar">
            {/* Play/Pause Button */}
            <button
              type="button"
              className="video-control-btn"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Time Display */}
            <span className="video-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div style={{ flex: 1 }} />

            {/* Volume Control */}
            <div className="video-volume-control">
              <button
                type="button"
                className="video-control-btn"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="video-volume-slider"
                aria-label="Volume"
              />
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              className="video-control-btn"
              onClick={exitFullscreen}
              aria-label="Exit fullscreen"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

VideoPreview.propTypes = {
  videoSrc: PropTypes.string.isRequired,
};

function Projects() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { ref: sectionRef, animateClass } = useSectionAnimation({
    threshold: 0.15,
    rootMargin: "0px",
  });

  const filterOptions = useMemo(() => {
    const counts = projectsData.reduce(
      (acc, project) => {
        acc.all += 1;
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      },
      { all: 0 }
    );

    return [
      { value: "all", label: "All Projects", count: counts.all },
      {
        value: "Full Stack Web Application",
        label: "Full Stack Web Application",
        count: counts["Full Stack Web Application"] || 0,
      },
      {
        value: "Mobile Application",
        label: "Mobile Application",
        count: counts["Mobile Application"] || 0,
      },
      {
        value: "UI Designs",
        label: "UI Designs",
        count: counts["UI Designs"] || 0,
      },
    ];
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projectsData;
    return projectsData.filter(
      (project) => project.category === selectedCategory
    );
  }, [selectedCategory]);

  const selectedOption =
    filterOptions.find((opt) => opt.value === selectedCategory) ||
    filterOptions[0];

  const handleScreenshotsClick = (project) => {
    // Navigate to dedicated screenshots viewer page
    navigate(`/screenshots/${project.id}`);
  };

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
            className={`filter-toggle ${isFilterOpen ? "open" : ""}`}
            onClick={() => setIsFilterOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isFilterOpen}
          >
            <span className="filter-value">{`${selectedOption.label} (${selectedOption.count})`}</span>
            <span className="filter-caret" aria-hidden="true">
              ▾
            </span>
          </button>

          {isFilterOpen && (
            <div className="filter-menu">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`filter-option ${
                    selectedCategory === option.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(option.value);
                    setIsFilterOpen(false);
                  }}
                  aria-pressed={selectedCategory === option.value}
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
              {project.id === 7 ? (
                <VideoPreview videoSrc={M3Video} />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                />
              )}
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
                  showGithub={project.title !== "SignIn/Signup UI Design"}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Screenshots are now handled on a dedicated route */}
    </section>
  );
}

export default Projects;
