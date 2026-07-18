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
const possibleBuildPaths = [
  path.join(__dirname, '../frontend/build'),      // Local: backend/frontend/build
  path.join(__dirname, '../build'),               // Railway: backend/build (copied)
  path.join(__dirname, '../../frontend/build'),   // Cyclic: /frontend/build
  path.join(__dirname, '../../build'),             // Root: /build
  path.join(__dirname, '../public'),              // Fallback: /public
];

const buildPath = possibleBuildPaths.find(p => fs.existsSync(p)) || possibleBuildPaths[0];

console.log(`Checking build paths:`);
possibleBuildPaths.forEach(p => {
  console.log(`  ${p}: ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`);
});
console.log(`Using build path: ${buildPath}`);

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
  res.status(200).json({ 
    status: 'OK', 
    buildPath,
    indexExists: fs.existsSync(path.join(buildPath, 'index.html'))
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  console.log(`Serving static files from: ${buildPath}`);
  
  // Serve static files
  app.use(express.static(buildPath));
  
  // Handle React Router - return index.html for all non-API routes
  app.get('*', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    console.log(`Serving index.html from: ${indexPath}`);
    console.log(`File exists: ${fs.existsSync(indexPath)}`);
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('index.html not found. Build path: ' + buildPath);
    }
  });
} else {
  // Development: Just log
  console.log('Running in development mode. Frontend should be started separately.');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Build path: ${buildPath}`);
});
