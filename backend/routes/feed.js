const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');

// Get feed (for you page)
router.get('/', feedController.getFeed);

// Get trending videos
router.get('/trending', feedController.getTrending);

// Get videos by hashtag
router.get('/hashtag/:hashtag', feedController.getByHashtag);

// Search videos
router.get('/search', feedController.search);

module.exports = router;
