
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

function SocialModal({ type, data, onClose, onProfileUpdate }) {

  const [username, setUsername] = useState(data?.username || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(data?.avatar || '');
  const [updating, setUpdating] = useState(false);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error('Image must be less than 2MB');
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const loadId = toast.loading('Syncing your profile updates...');

    try {

      const formData = new FormData();
      formData.append('username', username);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }


      const token = localStorage.getItem('token');
      const response = await fetch('https://prompt-pulse.onrender.com/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully! 🎉', { id: loadId });
      onProfileUpdate(result); 
      onClose();
    } catch (error) {
      toast.error(error.message || 'Update failed', { id: loadId });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Close Button */}
        <button onClick={onClose} style={closeButtonStyle}>&times;</button>

        {/* CONDITION A: RENDER EDIT PROFILE FORM */}
        {type === 'profile' && (
          <div>
            <h3 style={modalTitleStyle}>Edit Profile 👤</h3>
            <form onSubmit={handleProfileSubmit} style={formStyle}>
              
              {/* Profile Avatar Selection Block */}
              <div style={avatarUploadContainerStyle}>
                <img src={previewUrl} alt="Avatar Preview" style={previewAvatarStyle} />
                <label style={uploadLabelStyle}>
                  Change Profile Photo
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Username input field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={labelStyle}>Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  style={inputStyle}
                  required 
                />
              </div>

              <button type="submit" disabled={updating} style={saveButtonStyle}>
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* CONDITION B: RENDER INSTAGRAM-STYLE LIKES LIST */}
        {type === 'likes' && (
          <div>
            <h3 style={modalTitleStyle}>Liked By ❤️</h3>
            <div style={likesListContainerStyle}>
              {data && data.length > 0 ? (
                data.map((liker) => (
                  <div key={liker._id} style={likerRowStyle}>
                    <img src={liker.avatar} alt={liker.username} style={likerAvatarStyle} />
                    <span style={likerUsernameStyle}>{liker.username}</span>
                  </div>
                ))
              ) : (
                <p style={emptyLikesStyle}>No likes yet. Be the first! 😉</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative', textAlign: 'left' };
const closeButtonStyle = { position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#a0aec0' };
const modalTitleStyle = { margin: '0 0 20px 0', color: '#2d3748', fontSize: '20px', fontWeight: '700' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const avatarUploadContainerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' };
const previewAvatarStyle = { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' };
const uploadLabelStyle = { fontSize: '13px', color: '#3182ce', fontWeight: '600', cursor: 'pointer' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#4a5568' };
const inputStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px' };
const saveButtonStyle = { padding: '11px', borderRadius: '6px', border: 'none', backgroundColor: '#3182ce', color: '#fff', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' };


const likesListContainerStyle = { display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' };
const likerRowStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0', borderBottom: '1px solid #f7fafc' };
const likerAvatarStyle = { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' };
const likerUsernameStyle = { fontWeight: '600', fontSize: '14px', color: '#2d3748' };
const emptyLikesStyle = { color: '#718096', textAlign: 'center', margin: '20px 0' };

export default SocialModal;