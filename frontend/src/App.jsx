import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { customFetch } from './utils/customFetch';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import CreatePrompt from './components/CreatePrompt';
import PromptCard from './components/PromptCard';
import SocialModal from './components/SocialModal'; 

function App() {
  const { user, loading, logout, login } = useAuth(); 
  const [showLogin, setShowLogin] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [fetchingFeed, setFetchingFeed] = useState(false);


  const [isCreating, setIsCreating] = useState(false);


  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });

  useEffect(() => {
    if (user) {
      fetchFeed();
    }
  }, [user]);

  const fetchFeed = async () => {
    setFetchingFeed(true);
    try {
      const data = await customFetch('/prompts', { method: 'GET' });
      setPrompts(data);
    } catch (error) {
      toast.error('Failed to load community stream');
    } finally {
      setFetchingFeed(false);
    }
  };

  const handlePromptCreated = (newPrompt) => {
    setPrompts((prevPrompts) => [newPrompt, ...prevPrompts]);
    setIsCreating(false); 
  };

  const handleLikeToggle = async (promptId) => {
    try {

      const updatedPrompt = await customFetch(`/prompts/${promptId}/like`, {
        method: 'PUT',
      });


      setPrompts((prevPrompts) =>
        prevPrompts.map((p) => 
          p._id.toString() === promptId.toString() ? updatedPrompt : p
        )
      );
      

      if (modalConfig.isOpen && modalConfig.type === 'likes' && modalConfig.data) {
         setModalConfig(prev => ({ ...prev, data: updatedPrompt.likes }));
      }
    } catch (error) {
      toast.error('Could not log interaction');
    }
  };

  const handleDeletePrompt = async (promptId) => {
    const loadId = toast.loading('Deleting prompt card...');
    try {

      await customFetch(`/prompts/${promptId}`, {
        method: 'DELETE',
      });

      toast.success('Prompt removed successfully!', { id: loadId });
      

      setPrompts((prevPrompts) => prevPrompts.filter((p) => p._id !== promptId));
    } catch (error) {
      toast.error(error.message || 'Failed to delete prompt card', { id: loadId });
    }
  };

  const handleProfileUpdateSuccess = (updatedUserData) => {
    login(updatedUserData);
    setPrompts(prev => prev.map(p => p.creator._id === updatedUserData._id ? { ...p, creator: updatedUserData } : p));
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        {/* Global Keyframe CSS Injection */}
        <style>{spinAnimationKeyframes}</style>
        <div style={spinnerStyle}></div>
        <h3 style={{ marginTop: '15px', color: '#4a5568' }}>Securing Session...</h3>
      </div>
    );
  }

  return (
    <div style={appContainerStyle}>
      <Toaster position="top-center" reverseOrder={false} />
      <style>{spinAnimationKeyframes}</style>

      {modalConfig.isOpen && (
        <SocialModal 
          type={modalConfig.type}
          data={modalConfig.data}
          onClose={() => setModalConfig({ isOpen: false, type: '', data: null })}
          onProfileUpdate={handleProfileUpdateSuccess}
        />
      )}

      {/* Conditional Modal Container for CreatePrompt Component */}
      {isCreating && (
        <div style={formOverlayStyle}>
          <div style={formModalContentStyle}>
            <div style={formHeaderStyle}>
              <h3 style={{ margin: 0, color: '#2d3748', fontSize: '18px', fontWeight: '700' }}>Craft New Prompt Card ⚡️</h3>
              <button onClick={() => setIsCreating(false)} style={closeFormButtonStyle}>✕</button>
            </div>
            <CreatePrompt onPromptCreated={handlePromptCreated} />
          </div>
        </div>
      )}

      {user ? (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          {/* Top Navbar */}
          <nav style={navbarStyle}>
            <div style={navBrandStyle}>
              <span style={logoIconStyle}>⚡️</span>
              <h1 style={logoTextStyle}>PromptPulse</h1>
            </div>
            
            <div style={navUserAreaStyle}>
              <div 
                onClick={() => setModalConfig({ isOpen: true, type: 'profile', data: user })} 
                style={userInfoStyle}
              >
                <img src={user.avatar} alt="Avatar" style={avatarStyle} />
                <span style={usernameStyle}>{user.username} ⚙️</span>
              </div>
              <button onClick={logout} style={logoutButtonStyle}>Sign Out</button>
            </div>
          </nav>

          {/* Main Feed Content Container */}
          <main style={workspaceStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
              <h3 style={{ margin: 0, textAlign: 'left', color: '#2d3748' }}>Community Stream 🔥</h3>
              
              {fetchingFeed ? (
                <p style={{ color: '#718096' }}>Sifting database entries...</p>
              ) : prompts.length === 0 ? (
                <div style={emptyStateStyle}>
                  <p style={{ margin: 0, color: '#718096' }}>No prompt cards published yet. Be the first to share! 🚀</p>
                </div>
              ) : (
                prompts.map((prompt) => (
                  <PromptCard 
                    key={prompt._id} 
                    prompt={prompt} 
                    onLikeToggle={handleLikeToggle}
                    onOpenLikesModal={(likersData) => setModalConfig({ isOpen: true, type: 'likes', data: likersData })}
                    onDeletePrompt={handleDeletePrompt} 
                  />
                ))
              )}
            </div>
          </main>

          {/* Fixed Floating Action Button (FAB) */}
          <button
            onClick={() => setIsCreating(!isCreating)}
            style={{
              ...fabButtonStyle,
              transform: isCreating ? 'rotate(135deg)' : 'none', 
              backgroundColor: isCreating ? '#e53e3e' : '#3182ce' 
            }}
            aria-label="Toggle creation interface"
          >
            +
          </button>
        </div>
      ) : (
        <div style={authPageStyle}>
          <div style={authHeaderAreaStyle}>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a202c', margin: '0 0 10px 0' }}>PromptPulse Engine</h1>
            <p style={{ color: '#718096', margin: 0 }}>The central engineering workspace to share, copy, and optimize AI generation prompts.</p>
          </div>
          {showLogin ? <LoginForm toggleForm={() => setShowLogin(false)} /> : <RegisterForm toggleForm={() => setShowLogin(true)} />}
        </div>
      )}
    </div>
  );
}


const spinAnimationKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;


const appContainerStyle = { backgroundColor: '#f7fafc', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' };
const loadingContainerStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7fafc' };
const spinnerStyle = { width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #3182ce', borderRadius: '50%', animation: 'spin 1s linear infinite' };
const navbarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' };
const navBrandStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
const logoIconStyle = { fontSize: '24px', backgroundColor: '#ebf8ff', padding: '6px', borderRadius: '8px' };
const logoTextStyle = { fontSize: '20px', fontWeight: 'bold', color: '#2d3748', margin: 0 };
const navUserAreaStyle = { display: 'flex', alignItems: 'center', gap: '20px' };
const userInfoStyle = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', transition: 'background 0.2s' };
const avatarStyle = { width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #e2e8f0', objectFit: 'cover' };
const usernameStyle = { fontWeight: '600', color: '#4a5568', fontSize: '15px' };
const logoutButtonStyle = { padding: '8px 14px', borderRadius: '6px', border: '1px solid #e53e3e', backgroundColor: 'transparent', color: '#e53e3e', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const workspaceStyle = { flex: 1, padding: '40px 20px', maxWidth: '700px', margin: '0 auto', width: '100%', boxSizing: 'border-box' };
const emptyStateStyle = { padding: '40px', backgroundColor: '#fff', border: '1px dashed #cbd5e0', borderRadius: '12px', textAlign: 'center' };
const authPageStyle = { padding: '80px 20px 40px 20px', textAlign: 'center' };
const authHeaderAreaStyle = { maxWidth: '500px', margin: '0 auto 20px auto' };

const formOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(26, 32, 44, 0.6)', 
  backdropFilter: 'blur(4px)', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000, 
  padding: '20px'
};

const formModalContentStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  width: '100%',
  maxWidth: '600px', 
  padding: '30px',
  boxSizing: 'border-box'
};

const formHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  borderBottom: '1px solid #edf2f7',
  paddingBottom: '12px'
};

const closeFormButtonStyle = {
  border: 'none',
  background: 'transparent',
  fontSize: '18px',
  color: '#a0aec0',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '4px',
  transition: 'color 0.2s'
};

const fabButtonStyle = {
  position: 'fixed',
  bottom: '30px',
  right: '40px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '300',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 10px 15px -3px rgba(49, 130, 206, 0.3), 0 4px 6px -2px rgba(49, 130, 206, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2100, 
  transition: 'all 0.2s ease-in-out',
  lineHeight: '0'
};

export default App;