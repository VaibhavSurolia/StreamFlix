import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import './ProfileSelection.css';

const ProfileSelection = ({ user, onSelectProfile }) => {
  const [profiles, setProfiles] = useState(user?.profiles || []);
  const navigate = useNavigate();

  const handleSelectProfile = (profileId) => {
    const updatedUser = {
      ...user,
      currentProfile: profileId,
    };
    authService.updateUser(updatedUser);
    onSelectProfile(updatedUser);
    navigate('/');
  };

  const handleAddProfile = () => {
    const newProfile = {
      id: Date.now().toString(),
      name: `Profile ${profiles.length + 1}`,
      avatar: '👤',
      isKids: false,
    };
    const updatedProfiles = [...profiles, newProfile];
    const updatedUser = {
      ...user,
      profiles: updatedProfiles,
    };
    authService.updateUser(updatedUser);
    setProfiles(updatedProfiles);
  };

  return (
    <div className="profile-selection-page">
      <div className="profile-selection-container">
        <h1>Who's watching?</h1>
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              className="profile-card"
              onClick={() => handleSelectProfile(profile.id)}
            >
              <div className="profile-avatar">{profile.avatar}</div>
              <h3>{profile.name}</h3>
              {profile.isKids && <span className="kids-badge">Kids</span>}
            </button>
          ))}
          {profiles.length < 5 && (
            <button className="profile-card add-profile" onClick={handleAddProfile}>
              <div className="profile-avatar">+</div>
              <h3>Add Profile</h3>
            </button>
          )}
        </div>
        <button className="manage-profiles-btn" onClick={() => navigate('/dashboard')}>
          Manage Profiles
        </button>
      </div>
    </div>
  );
};

export default ProfileSelection;

