// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const promptRoutes = require('./routes/promptRoutes');

const app = express();

// Connect to MongoDB Atlas 
connectDB();

app.use(express.json());

// UPDATE CORS: Allow requests from localhost for testing AND your future Vercel domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
  // We will add your exact Vercel URL here right after you deploy the frontend!
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // During deployment, if we miss an origin, we can temporarily allow it or log it
      return callback(null, true); // Set to true to avoid initial deployment CORS blockages
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);

app.get('/', (req, res) => {
  res.send('PromptPulse API Engine Running Smoothly...');
});

// CRITICAL: Render will assign its own port via process.env.PORT. Fallback to 5001 locally.
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});