import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [editingProfile, setEditingProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updatedUser = authService.getCurrentUser();
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
  }, []);

  const handleDeleteProfile = (profileId) => {
    if (currentUser.profiles.length <= 1) {
      alert('You must have at least one profile');
      return;
    }

    const updatedProfiles = currentUser.profiles.filter(p => p.id !== profileId);
    const updatedUser = {
      ...currentUser,
      profiles: updatedProfiles,
      currentProfile: updatedProfiles[0].id,
    };
    authService.updateUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  const handleSaveProfile = (profileId, name, avatar, isKids) => {
    const updatedProfiles = currentUser.profiles.map(p =>
      p.id === profileId
        ? { ...p, name, avatar, isKids }
        : p
    );
    const updatedUser = {
      ...currentUser,
      profiles: updatedProfiles,
    };
    authService.updateUser(updatedUser);
    setCurrentUser(updatedUser);
    setEditingProfile(null);
  };

  const handleAddProfile = () => {
    const newProfile = {
      id: Date.now().toString(),
      name: `Profile ${currentUser.profiles.length + 1}`,
      avatar: '👤',
      isKids: false,
    };
    const updatedUser = {
      ...currentUser,
      profiles: [...currentUser.profiles, newProfile],
    };
    authService.updateUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  const avatars = ['👤', '👨', '👩', '🧑', '👦', '👧', '🧒', '👴', '👵'];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Account Settings</h1>

        <div className="dashboard-section">
          <h2>Profiles</h2>
          <div className="profiles-list">
            {currentUser.profiles.map((profile) => (
              <div key={profile.id} className="profile-item">
                {editingProfile === profile.id ? (
                  <ProfileEditor
                    profile={profile}
                    avatars={avatars}
                    onSave={handleSaveProfile}
                    onCancel={() => setEditingProfile(null)}
                  />
                ) : (
                  <>
                    <div className="profile-display">
                      <div className="profile-avatar-large">{profile.avatar}</div>
                      <div>
                        <h3>{profile.name}</h3>
                        {profile.isKids && <span className="kids-badge">Kids Profile</span>}
                      </div>
                    </div>
                    <div className="profile-actions">
                      <button onClick={() => setEditingProfile(profile.id)}>Edit</button>
                      {currentUser.profiles.length > 1 && (
                        <button onClick={() => handleDeleteProfile(profile.id)} className="delete-btn">
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
            {currentUser.profiles.length < 5 && (
              <button className="add-profile-btn" onClick={handleAddProfile}>
                + Add Profile
              </button>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Preferences</h2>
          <div className="preferences">
            <label className="preference-item">
              <span>Autoplay next episode</span>
              <input
                type="checkbox"
                checked={currentUser.preferences?.autoplay || false}
                onChange={(e) => {
                  const updatedUser = {
                    ...currentUser,
                    preferences: {
                      ...currentUser.preferences,
                      autoplay: e.target.checked,
                    },
                  };
                  authService.updateUser(updatedUser);
                  setCurrentUser(updatedUser);
                }}
              />
            </label>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>My Activity</h2>
          <div className="activity-stats">
            <div className="stat-item">
              <h3>{currentUser.watchlist?.length || 0}</h3>
              <p>In Watchlist</p>
            </div>
            <div className="stat-item">
              <h3>{currentUser.continueWatching?.length || 0}</h3>
              <p>Continue Watching</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/watchlist" className="dashboard-btn">View Watchlist</Link>
          <button
            className="dashboard-btn secondary"
            onClick={() => {
              authService.signOut();
              navigate('/');
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileEditor = ({ profile, avatars, onSave, onCancel }) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [isKids, setIsKids] = useState(profile.isKids || false);

  return (
    <div className="profile-editor">
      <div className="editor-field">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Profile name"
        />
      </div>
      <div className="editor-field">
        <label>Avatar</label>
        <div className="avatar-selector">
          {avatars.map((av) => (
            <button
              key={av}
              className={`avatar-option ${avatar === av ? 'selected' : ''}`}
              onClick={() => setAvatar(av)}
            >
              {av}
            </button>
          ))}
        </div>
      </div>
      <div className="editor-field">
        <label>
          <input
            type="checkbox"
            checked={isKids}
            onChange={(e) => setIsKids(e.target.checked)}
          />
          Kids Profile
        </label>
      </div>
      <div className="editor-actions">
        <button onClick={() => onSave(profile.id, name, avatar, isKids)} className="save-btn">
          Save
        </button>
        <button onClick={onCancel} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default Dashboard;

