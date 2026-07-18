const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const userRoutes = require('./routes/users');
const feedRoutes = require('./routes/feed');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Determine build path - check multiple locations
const buildPath = (() => {
  // Check if frontend/build exists (local development)
  const localPath = path.join(__dirname, '../frontend/build');
  if (fs.existsSync(localPath)) {
    return localPath;
  }
  // Check if build exists in root (Railway/Cyclic deployment)
  const rootPath = path.join(__dirname, '../build');
  if (fs.existsSync(rootPath)) {
    return rootPath;
  }
  // Check if frontend/build exists from root
  const frontendBuildPath = path.join(__dirname, '../../frontend/build');
  if (fs.existsSync(frontendBuildPath)) {
    return frontendBuildPath;
  }
  // Default to local path
  return path.join(__dirname, '../frontend/build');
})();

// Uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clipvibe')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feed', feedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', buildPath });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  console.log(`Serving static files from: ${buildPath}`);
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});
