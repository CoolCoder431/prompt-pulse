import React, { useState } from 'react';
import { customFetch } from '../utils/customFetch';
import { toast } from 'react-hot-toast';

function CreatePrompt({ onPromptCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    instruction: '',
    aiModel: 'ChatGPT',
    tags: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Publishing your prompt card...');

    try {

      const data = await customFetch('/prompts', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      toast.success('Prompt successfully pushed to the feed! ⚡️', { id: loadId });
      

      setFormData({ title: '', instruction: '', aiModel: 'ChatGPT', tags: '' });
      

      if (onPromptCreated) {
        onPromptCreated(data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to publish prompt', { id: loadId });
    }
  };

  return (
    <div style={formCardStyle}>
      <h3 style={{ margin: '0 0 15px 0', color: '#2d3748' }}>Share an AI Prompt 🚀</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          name="title"
          placeholder="Catchy title (e.g., Ultra-Realistic Product Photo)"
          value={formData.title}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <select
          name="aiModel"
          value={formData.aiModel}
          onChange={handleChange}
          style={selectStyle}
        >
          <option value="ChatGPT">ChatGPT</option>
          <option value="Claude">Claude</option>
          <option value="Midjourney">Midjourney</option>
          <option value="Stable Diffusion">Stable Diffusion</option>
          <option value="v0">v0</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          name="instruction"
          placeholder="Paste the raw system instructions or generation prompt here..."
          value={formData.instruction}
          onChange={handleChange}
          style={textareaStyle}
          rows="4"
          required
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags separated by commas (e.g., 3d, portrait, coding)"
          value={formData.tags}
          onChange={handleChange}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Publish Prompt Card</button>
      </form>
    </div>
  );
}


const formCardStyle = {
  backgroundColor: '#ffffff',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  textAlign: 'left',
  marginBottom: '30px'
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const inputStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', width: '100%', boxSizing: 'border-box' };
const selectStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' };
const textareaStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' };
const buttonStyle = { padding: '11px', borderRadius: '6px', border: 'none', backgroundColor: '#3182ce', color: '#fff', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' };

export default CreatePrompt;