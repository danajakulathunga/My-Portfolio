import profileImg from '../assets/profile.jpg'
import '../styles/profilePicture.css'

function ProfilePicture() {
  return (
    <div className="profile-picture-wrapper">
      {/* Ripple effect layers */}
      <div className="profile-ripple profile-ripple-1" />
      <div className="profile-ripple profile-ripple-2" />
      <div className="profile-ripple profile-ripple-3" />
      <div className="profile-ripple profile-ripple-4" />
      <div className="profile-ripple profile-ripple-5" />

      {/* Circular border container */}
      <div className="profile-border">
        {/* Profile image */}
        <img src={profileImg} alt="Profile" className="profile-image" />
      </div>
    </div>
  )
}

export default ProfilePicture
