import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useLanguage } from '../LanguageContext';

function Settings() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
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

        // If the stored avatar is an uploaded image (base64)
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
      setProfileMsg(language === 'en' ? 'Profile updated successfully!' : 'Profil mis à jour avec succès !');
    } catch (err) {
      setProfileMsg(`${err.response?.data?.error || (language === 'en' ? 'Error updating profile.' : 'Erreur lors de la mise à jour du profil.')}`);
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
      setPasswordMsg(language === 'en' ? 'Password updated successfully!' : 'Mot de passe mis à jour avec succès !');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMsg(`${err.response?.data?.error || (language === 'en' ? 'Error updating password.' : 'Erreur lors de la mise à jour du mot de passe.')}`);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const confirmMessage = language === 'en'
      ? 'Are you sure? This will permanently delete your account and all your events.'
      : 'Êtes-vous sûr ? Cela supprimera définitivement votre compte et tous vos événements.';
      
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;
    try {
      await api.post('/settings/delete-account/', { password: deletePassword });
      localStorage.removeItem('token');
      navigate('/register');
    } catch (err) {
      setDeleteMsg(`${err.response?.data?.error || (language === 'en' ? 'Error deleting account.' : 'Erreur lors de la suppression du compte.')}`);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(language === 'en' ? 'Image must be under 2MB.' : 'L\'image doit faire moins de 2 Mo.');
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

  // Helper to determine whether a message is success or error
  // Modified to detect both English and French success words
  const isSuccess = (msg) => msg.toLowerCase().includes('success') || msg.toLowerCase().includes('succès');

  if (loading) {
    return (
      <div>
        <Navbar />
        <p style={{ padding: '20px' }}>
          {language === 'en' ? 'Loading...' : 'Chargement...'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="settings-container">
        <h2 className="settings-title">
          {language === 'en' ? 'Account Settings' : 'Paramètres du compte'}
        </h2>

        {/* SECTION: Profile */}
        <div className="settings-section">
          <h3 className="settings-section-title">
            {language === 'en' ? 'Profile' : 'Profil'}
          </h3>
          
          <form onSubmit={handleProfileSave} className="settings-form">
            <div className="settings-avatar-row">
              <img
                src={avatarMode === 'upload' && imagePreview ? imagePreview : avatarUrl || previewUrl}
                alt="avatar preview"
                className="settings-avatar-img"
              />
              <div className="settings-avatar-options">
                <p className="settings-avatar-options-title">
                  {language === 'en' ? 'Choose avatar type:' : 'Choisissez le type d\'avatar :'}
                </p>
                <div className="settings-avatar-toggles">
                  <button
                    type="button"
                    onClick={() => setAvatarMode('seed')}
                    className={`settings-toggle-btn ${avatarMode === 'seed' ? 'active' : ''}`}
                  >
                    🎲 {language === 'en' ? 'Generated' : 'Généré'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarMode('upload')}
                    className={`settings-toggle-btn ${avatarMode === 'upload' ? 'active' : ''}`}
                  >
                    📷 {language === 'en' ? 'Upload photo' : 'Télécharger une photo'}
                  </button>
                </div>
              </div>
            </div>

            {avatarMode === 'seed' && (
              <div>
                <label className="settings-label">
                  {language === 'en' ? 'Avatar seed (any text)' : 'Graine d\'avatar (n\'importe quel texte)'}
                </label>
                <input
                  type="text"
                  value={avatarSeed}
                  onChange={(e) => setAvatarSeed(e.target.value)}
                  placeholder={language === 'en' ? 'Default: your username' : 'Par défaut : votre nom d\'utilisateur'}
                  className="settings-input"
                />
                <p className="settings-hint">
                  {language === 'en' ? 'Type any word to generate a unique avatar.' : 'Tapez n\'importe quel mot pour générer un avatar unique.'}
                </p>
              </div>
            )}

            {avatarMode === 'upload' && (
              <div>
                <label className="settings-label">
                  {language === 'en' ? 'Upload a photo (max 2MB)' : 'Télécharger une photo (max 2 Mo)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="settings-input"
                  style={{ padding: '6px' }}
                />
                {imagePreview && (
                  <p className="settings-hint settings-hint-success">
                    {language === 'en' ? 'Image ready — click "Save Profile" to apply.' : 'Image prête — cliquez sur "Enregistrer le profil" pour l\'appliquer.'}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="settings-label">
                {language === 'en' ? 'Username' : 'Nom d\'utilisateur'}
              </label>
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
            
            <button type="submit" className="settings-btn settings-btn-primary">
              {language === 'en' ? 'Save Profile' : 'Enregistrer le profil'}
            </button>
          </form>
        </div>

        {/* SECTION: Password */}
        <div className="settings-section">
          <h3 className="settings-section-title">
            {language === 'en' ? 'Change Password' : 'Changer de mot de passe'}
          </h3>
          <form onSubmit={handlePasswordChange} className="settings-form">
            <div>
              <label className="settings-label">
                {language === 'en' ? 'Current password' : 'Mot de passe actuel'}
              </label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
                className="settings-input" 
              />
            </div>
            <div>
              <label className="settings-label">
                {language === 'en' ? 'New password (min. 8 characters)' : 'Nouveau mot de passe (min. 8 caractères)'}
              </label>
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

            <button type="submit" className="settings-btn settings-btn-success">
              {language === 'en' ? 'Update Password' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </div>

        {/* SECTION : Delete Account */}
        <div className="settings-section settings-section-danger">
          <h3 className="settings-danger-title">
            {language === 'en' ? 'Danger Zone' : 'Zone de danger'}
          </h3>
          <p className="settings-danger-desc">
            {language === 'en' 
              ? 'Deleting your account is permanent. All your events and data will be lost.' 
              : 'La suppression de votre compte est définitive. Tous vos événements et données seront perdus.'}
          </p>
          
          <form onSubmit={handleDeleteAccount} className="settings-form">
            <div>
              <label className="settings-label">
                {language === 'en' ? 'Confirm with your password' : 'Confirmez avec votre mot de passe'}
              </label>
              <input 
                type="password" 
                value={deletePassword} 
                onChange={(e) => setDeletePassword(e.target.value)} 
                required 
                className="settings-input" 
                placeholder={language === 'en' ? 'Enter your password to confirm' : 'Entrez votre mot de passe pour confirmer'} 
              />
            </div>
            
            {deleteMsg && <p className="settings-msg settings-msg-error">{deleteMsg}</p>}
            
            <button type="submit" className="settings-btn settings-btn-danger">
              🗑️ {language === 'en' ? 'Delete My Account' : 'Supprimer mon compte'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Settings;