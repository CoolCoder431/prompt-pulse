// frontend/src/components/LoginForm.jsx
import React, { useState } from 'react';
import { customFetch } from '../utils/customFetch';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function LoginForm({ toggleForm }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Logging you in...');

    try {
      // Hit our backend login endpoint from Step 11
      const data = await customFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Save user to context state
      login(data);
      toast.success(`Welcome back, ${data.username}!`, { id: loadId });
    } catch (error) {
      toast.error(error.message || 'Login failed', { id: loadId });
    }
  };

  return (
    <div style={formCardStyle}>
      <h2>Welcome Back 👋</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
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
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>Sign In</button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Don't have an account?{' '}
        <span onClick={toggleForm} style={linkStyle}>Register here</span>
      </p>
    </div>
  );
}

// Reuse same style parameters for visual consistency
const formCardStyle = { maxWidth: '400px', margin: '30px auto', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', backgroundColor: '#fff', fontFamily: 'sans-serif' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' };
const buttonStyle = { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#0070f3', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' };
const linkStyle = { color: '#0070f3', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' };

export default LoginForm;