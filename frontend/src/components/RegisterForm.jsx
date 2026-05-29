// frontend/src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { customFetch } from '../utils/customFetch';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function RegisterForm({ toggleForm }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Creating your account...');

    try {
      // Hit our backend register endpoint from Step 11
      const data = await customFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Log the user into global context state
      login(data);
      toast.success(`Welcome, ${data.username}!`, { id: loadId });
    } catch (error) {
      toast.error(error.message || 'Registration failed', { id: loadId });
    }
  };

  return (
    <div style={formCardStyle}>
      <h2>Create Account 🪐</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (Min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>Sign Up</button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Already have an account?{' '}
        <span onClick={toggleForm} style={linkStyle}>Login here</span>
      </p>
    </div>
  );
}

// Inline styles for rapid scaffolding before CSS framework integration
const formCardStyle = {
  maxWidth: '400px',
  margin: '30px auto',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  backgroundColor: '#fff',
  fontFamily: 'sans-serif'
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' };
const buttonStyle = { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#0070f3', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' };
const linkStyle = { color: '#0070f3', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' };

export default RegisterForm;