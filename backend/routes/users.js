const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/:id', userController.getProfile);

// Follow user (requires auth)
router.post('/:id/follow', authMiddleware, userController.follow);

// Unfollow user (requires auth)
router.post('/:id/unfollow', authMiddleware, userController.unfollow);

// Get user followers
router.get('/:id/followers', userController.getFollowers);

// Get user following
router.get('/:id/following', userController.getFollowing);

// Update profile (requires auth)
router.put('/me', authMiddleware, userController.updateProfile);

// Get suggested users (requires auth)
router.get('/suggested', authMiddleware, userController.getSuggested);

module.exports = router;
