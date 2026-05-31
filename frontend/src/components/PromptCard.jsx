// frontend/src/components/PromptCard.jsx
import React from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function PromptCard({ prompt, onLikeToggle, onOpenLikesModal, onDeletePrompt }) {
  const { _id, title, instruction, aiModel, tags, creator, createdAt, likes = [] } = prompt;
  const { user } = useAuth();

  // 1. Authorization Match: Is the logged-in user the owner of this specific post?
  const isOwner = user && creator && user._id === creator._id;

  const likedIds = likes.map(l => typeof l === 'object' ? l._id : l);
  const isLiked = user ? likedIds.includes(user._id) : false;

  const handleCopy = () => {
    navigator.clipboard.writeText(instruction);
    toast.success('Prompt copied to clipboard! 📋');
  };

  const handleDeleteClick = () => {
    console.log("onDeletePrompt =", onDeletePrompt);
    console.log("_id =", _id);
    if (window.confirm('Are you absolutely sure you want to delete this prompt card?')) {
      onDeletePrompt(_id);
    }
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={authorAreaStyle}>
          <img src={creator?.avatar} alt="Avatar" style={avatarStyle} />
          <div>
            <div style={usernameStyle}>
              {creator?.username || 'Anonymous'} {isOwner && <span style={ownerTagStyle}>(You)</span>}
            </div>
            <div style={dateStyle}>{new Date(createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={getBadgeStyle(aiModel)}>{aiModel}</span>
          {/* 2. Conditional Render: Trash button ONLY displays if you own the post */}
          {isOwner && (
            <button onClick={handleDeleteClick} style={deleteButtonStyle} title="Delete Post">
              🗑️
            </button>
          )}
        </div>
      </div>

      <h4 style={titleStyle}>{title}</h4>
      <div style={instructionBoxStyle}>
        <p style={instructionTextStyle}>{instruction}</p>
      </div>

      <div style={footerStyle}>
        <div style={socialActionsStyle}>
          <div style={likeCapsuleStyle}>
            <button onClick={() => onLikeToggle(_id)} style={heartButtonStyle}>
              {isLiked ? '❤️' : '🤍'}
            </button>
            <span 
              onClick={() => likes.length > 0 && onOpenLikesModal(likes)} 
              style={likes.length > 0 ? interactiveCountStyle : passiveCountStyle}
            >
              {likes.length}
            </span>
          </div>

          <div style={tagContainerStyle}>
            {tags.map((tag, i) => tag && <span key={i} style={tagStyle}>#{tag}</span>)}
          </div>
        </div>
        <button onClick={handleCopy} style={copyButtonStyle}>Copy Prompt</button>
      </div>
    </div>
  );
}

const getBadgeStyle = (model) => {
  const base = { padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' };
  if (model === 'ChatGPT') return { ...base, backgroundColor: '#e6fffa', color: '#234e52' };
  if (model === 'Claude') return { ...base, backgroundColor: '#fffff0', color: '#744210' };
  if (model === 'Midjourney') return { ...base, backgroundColor: '#f3e8ff', color: '#553c9a' };
  if (model === 'Stable Diffusion') return { ...base, backgroundColor: '#ebf8ff', color: '#2b6cb0' };
  return { ...base, backgroundColor: '#edf2f7', color: '#4a5568' };
};

const cardStyle = { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const authorAreaStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
const avatarStyle = { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' };
const usernameStyle = { fontWeight: '600', fontSize: '14px', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '4px' };
const ownerTagStyle = { fontSize: '11px', color: '#718096', fontWeight: 'normal' };
const dateStyle = { fontSize: '11px', color: '#a0aec0' };
const titleStyle = { margin: '4px 0 0 0', fontSize: '17px', fontWeight: '700', color: '#1a202c' };
const instructionBoxStyle = { backgroundColor: '#f7fafc', padding: '12px', borderRadius: '8px', border: '1px solid #edf2f7', maxHeight: '120px', overflowY: 'auto' };
const instructionTextStyle = { margin: 0, fontSize: '14px', color: '#4a5568', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.5' };
const footerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', gap: '10px' };
const tagContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: '6px' };
const tagStyle = { fontSize: '12px', color: '#4a5568', fontWeight: '500' };
const copyButtonStyle = { padding: '6px 12px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
const socialActionsStyle = { display: 'flex', alignItems: 'center', gap: '15px' };
const likeCapsuleStyle = { display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: '600' };
const heartButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' };
const passiveCountStyle = { color: '#4a5568' };
const interactiveCountStyle = { color: '#2b6cb0', cursor: 'pointer', textDecoration: 'underline' };

// Clean Trashcan Delete Button Style Rules
const deleteButtonStyle = { background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer', padding: '4px', borderRadius: '4px', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default PromptCard;