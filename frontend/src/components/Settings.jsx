import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

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

        // Si l'avatar stocké est une image uploadée (base64), on remet le bon mode
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

  // Prévisualisation de l'avatar en temps réel
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
      // Met à jour le token car il a changé
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
        // Compression via un canvas
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

  const sectionStyle = {
    border: '1px solid #e1e4e8', borderRadius: '8px', padding: '24px',
    marginBottom: '24px', backgroundColor: '#fff'
  };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' };
  const btnStyle = (color) => ({ padding: '10px 20px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' });

  if (loading) return <div><Navbar /><p style={{ padding: '20px' }}>Loading...</p></div>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ marginBottom: '24px' }}>Account Settings</h2>

        {/* SECTION : Profil */}
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Profile</h3>
          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Aperçu de l'avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <img
                src={avatarMode === 'upload' && imagePreview ? imagePreview : avatarUrl || previewUrl}
                alt="avatar preview"
                style={{ width: '72px', height: '72px', borderRadius: '50%', border: '2px solid #e1e4e8', objectFit: 'cover' }}
            />
            <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#555' }}>Choose avatar type:</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    type="button"
                    onClick={() => setAvatarMode('seed')}
                    style={{ padding: '5px 12px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: avatarMode === 'seed' ? '#007bff' : '#fff', color: avatarMode === 'seed' ? 'white' : '#333', fontSize: '13px' }}
                >
                    🎲 Generated
                </button>
                <button
                    type="button"
                    onClick={() => setAvatarMode('upload')}
                    style={{ padding: '5px 12px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: avatarMode === 'upload' ? '#007bff' : '#fff', color: avatarMode === 'upload' ? 'white' : '#333', fontSize: '13px' }}
                >
                    📷 Upload photo
                </button>
                </div>
            </div>
            </div>

            {/* Mode : avatar généré */}
            {avatarMode === 'seed' && (
            <div>
                <label style={labelStyle}>Avatar seed (any text)</label>
                <input
                type="text"
                value={avatarSeed}
                onChange={(e) => setAvatarSeed(e.target.value)}
                placeholder="Default: your username"
                style={inputStyle}
                />
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#777' }}>
                Type any word to generate a unique avatar.
                </p>
            </div>
            )}

            {/* Mode : photo uploadée */}
            {avatarMode === 'upload' && (
            <div>
                <label style={labelStyle}>Upload a photo (max 2MB)</label>
                <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ ...inputStyle, padding: '6px' }}
                />
                {imagePreview && (
                <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: 'green' }}>
                    Image ready — click "Save Profile" to apply.
                </p>
                )}
            </div>
            )}

            <div>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {profileMsg && <p style={{ margin: 0, fontSize: '14px', color: profileMsg.startsWith('✅') ? 'green' : 'red' }}>{profileMsg}</p>}
            <button type="submit" style={btnStyle('#007bff')}>Save Profile</button>
          </form>
        </div>

        {/* SECTION : Mot de passe */}
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Change Password</h3>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Current password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>New password (min. 8 characters)</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
            </div>
            {passwordMsg && <p style={{ margin: 0, fontSize: '14px', color: passwordMsg.startsWith('✅') ? 'green' : 'red' }}>{passwordMsg}</p>}
            <button type="submit" style={btnStyle('#28a745')}>Update Password</button>
          </form>
        </div>

        {/* SECTION : Supprimer le compte */}
        <div style={{ ...sectionStyle, borderColor: '#f5c6cb', backgroundColor: '#fff8f8' }}>
          <h3 style={{ marginTop: 0, color: '#dc3545' }}>Danger Zone</h3>
          <p style={{ fontSize: '14px', color: '#555', marginTop: 0 }}>
            Deleting your account is permanent. All your events and data will be lost.
          </p>
          <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Confirm with your password</label>
              <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required style={inputStyle} placeholder="Enter your password to confirm" />
            </div>
            {deleteMsg && <p style={{ margin: 0, fontSize: '14px', color: 'red' }}>{deleteMsg}</p>}
            <button type="submit" style={btnStyle('#dc3545')}>🗑️ Delete My Account</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Settings;