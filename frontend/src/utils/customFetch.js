// frontend/src/utils/customFetch.js

const BASE_URL = 'http://127.0.0.1:5001/api';

export const customFetch = async (endpoint, options = {}) => {
  // 1. Grab the secure JWT token from localStorage
  const token = localStorage.getItem('token');

  // 2. Configure default headers for JSON transmission
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 3. Inject the Bearer token into the Authorization header if it exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  // 4. Fire the native request
  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // 5. Handle errors gracefully if the status code is bad (e.g., 401, 400, 500)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong with the request');
  }

  // 6. Return the parsed JSON response
  return response.json();
};