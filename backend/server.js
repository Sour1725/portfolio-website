const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const contactRoutes = require('./routes/contactRoutes');

const app = express();

// --- CORS (IMPORTANT: Only ONE block & placed at top) ---
app.use(cors({
  origin: [
    process.env.CLIENT_URL,                     // your Vercel frontend
    'http://localhost:5173'                     // local dev for Vite
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---
app.use('/api/contact', contactRoutes);

// --- TEST ROUTE ---
app.get('/', (req, res) => {
  res.send('Portfolio Backend API is Running...');
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
