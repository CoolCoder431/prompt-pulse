const BASE_URL = 'https://prompt-pulse.onrender.com/api';

export const customFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  // Check if we are passing a file (FormData)
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...options.headers,
  };

  // Only force JSON headers if we are NOT sending a profile picture file
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong with the request');
  }

  return response.json();
};