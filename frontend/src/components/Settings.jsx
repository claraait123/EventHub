import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [avatarMode, setAvatarMode] = useState('seed');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings/');
        setUsername(res.data.username);
        setAvatarSeed(res.data.avatar_seed);
        setAvatarUrl(res.data.avatar_url);

        // Si l'avatar stocké est une image uploadée (base64)
        if (res.data.avatar_url && res.data.avatar_url.startsWith('data:image/')) {
          setAvatarMode('upload');
          setImagePreview(res.data.avatar_url);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const previewUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${avatarSeed || username}`;

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      const payload = { username };
      if (avatarMode === 'upload' && imagePreview) {
        payload.avatar_image = imagePreview;
      } else {
        payload.avatar_seed = avatarSeed;
      }
      const res = await api.patch('/settings/', payload);
      setAvatarUrl(res.data.avatar_url);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg(`${err.response?.data?.error || 'Error updating profile.'}`);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    try {
      const res = await api.post('/settings/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      localStorage.setItem('token', res.data.token);
      setPasswordMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMsg(`${err.response?.data?.error || 'Error updating password.'}`);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure? This will permanently delete your account and all your events.');
    if (!confirmed) return;
    try {
      await api.post('/settings/delete-account/', { password: deletePassword });
      localStorage.removeItem('token');
      navigate('/register');
    } catch (err) {
      setDeleteMsg(`${err.response?.data?.error || 'Error deleting account.'}`);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 200;
        const ratio = Math.min(MAX / img.width, MAX / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        setImagePreview(compressed);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Helper pour savoir si un message est un succès ou une erreur
  const isSuccess = (msg) => msg.toLowerCase().includes('success');

  if (loading) return <div><Navbar /><p style={{ padding: '20px' }}>Loading...</p></div>;

  return (
    <div>
      <Navbar />
      <div className="settings-container">
        <h2 className="settings-title">Account Settings</h2>

        {/* SECTION : Profil */}
        <div className="settings-section">
          <h3 className="settings-section-title">Profile</h3>
          
          <form onSubmit={handleProfileSave} className="settings-form">
            <div className="settings-avatar-row">
              <img
                src={avatarMode === 'upload' && imagePreview ? imagePreview : avatarUrl || previewUrl}
                alt="avatar preview"
                className="settings-avatar-img"
              />
              <div className="settings-avatar-options">
                <p className="settings-avatar-options-title">Choose avatar type:</p>
                <div className="settings-avatar-toggles">
                  <button
                    type="button"
                    onClick={() => setAvatarMode('seed')}
                    className={`settings-toggle-btn ${avatarMode === 'seed' ? 'active' : ''}`}
                  >
                    🎲 Generated
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarMode('upload')}
                    className={`settings-toggle-btn ${avatarMode === 'upload' ? 'active' : ''}`}
                  >
                    📷 Upload photo
                  </button>
                </div>
              </div>
            </div>

            {avatarMode === 'seed' && (
              <div>
                <label className="settings-label">Avatar seed (any text)</label>
                <input
                  type="text"
                  value={avatarSeed}
                  onChange={(e) => setAvatarSeed(e.target.value)}
                  placeholder="Default: your username"
                  className="settings-input"
                />
                <p className="settings-hint">Type any word to generate a unique avatar.</p>
              </div>
            )}

            {avatarMode === 'upload' && (
              <div>
                <label className="settings-label">Upload a photo (max 2MB)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="settings-input"
                  style={{ padding: '6px' }}
                />
                {imagePreview && (
                  <p className="settings-hint settings-hint-success">
                    Image ready — click "Save Profile" to apply.
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="settings-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="settings-input"
              />
            </div>

            {profileMsg && (
              <p className={`settings-msg ${isSuccess(profileMsg) ? 'settings-msg-success' : 'settings-msg-error'}`}>
                {profileMsg}
              </p>
            )}
            
            <button type="submit" className="settings-btn settings-btn-primary">Save Profile</button>
          </form>
        </div>

        {/* SECTION : Mot de passe */}
        <div className="settings-section">
          <h3 className="settings-section-title">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="settings-form">
            <div>
              <label className="settings-label">Current password</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
                className="settings-input" 
              />
            </div>
            <div>
              <label className="settings-label">New password (min. 8 characters)</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className="settings-input" 
              />
            </div>
            
            {passwordMsg && (
              <p className={`settings-msg ${isSuccess(passwordMsg) ? 'settings-msg-success' : 'settings-msg-error'}`}>
                {passwordMsg}
              </p>
            )}

            <button type="submit" className="settings-btn settings-btn-success">Update Password</button>
          </form>
        </div>

        {/* SECTION : Supprimer le compte */}
        <div className="settings-section settings-section-danger">
          <h3 className="settings-danger-title">Danger Zone</h3>
          <p className="settings-danger-desc">
            Deleting your account is permanent. All your events and data will be lost.
          </p>
          
          <form onSubmit={handleDeleteAccount} className="settings-form">
            <div>
              <label className="settings-label">Confirm with your password</label>
              <input 
                type="password" 
                value={deletePassword} 
                onChange={(e) => setDeletePassword(e.target.value)} 
                required 
                className="settings-input" 
                placeholder="Enter your password to confirm" 
              />
            </div>
            
            {deleteMsg && <p className="settings-msg settings-msg-error">{deleteMsg}</p>}
            
            <button type="submit" className="settings-btn settings-btn-danger">🗑️ Delete My Account</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Settings;