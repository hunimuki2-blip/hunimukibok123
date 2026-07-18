const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video files are allowed'), false);
      }
    } else if (file.fieldname === 'thumbnail') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for thumbnail'), false);
      }
    } else {
      cb(new Error('Invalid field name'), false);
    }
  }
});

// Upload video (requires auth)
router.post('/', authMiddleware, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), videoController.uploadVideo);

// Get video by ID
router.get('/:id', videoController.getVideo);

// Like video (requires auth)
router.post('/:id/like', authMiddleware, videoController.likeVideo);

// Unlike video (requires auth)
router.post('/:id/unlike', authMiddleware, videoController.unlikeVideo);

// Add comment (requires auth)
router.post('/:id/comments', authMiddleware, videoController.addComment);

// Get user videos
router.get('/user/:userId', videoController.getUserVideos);

// Delete video (requires auth)
router.delete('/:id', authMiddleware, videoController.deleteVideo);

module.exports = router;
