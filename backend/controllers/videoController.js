const Video = require('../models/Video');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Upload a video
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, hashtags } = req.body;
    const videoFile = req.files?.video;
    const thumbnailFile = req.files?.thumbnail;
    
    if (!videoFile) {
      return res.status(400).json({ error: 'Video file is required' });
    }
    
    // Generate unique filenames
    const videoExt = path.extname(videoFile.name);
    const videoFilename = `${uuidv4()}${videoExt}`;
    const videoPath = path.join(__dirname, '../../public/uploads/videos', videoFilename);
    
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, '../../public/uploads/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Save video file
    await videoFile.mv(videoPath);
    
    let thumbnailUrl = '';
    if (thumbnailFile) {
      const thumbnailExt = path.extname(thumbnailFile.name);
      const thumbnailFilename = `${uuidv4()}${thumbnailExt}`;
      const thumbnailPath = path.join(__dirname, '../../public/uploads/thumbnails', thumbnailFilename);
      
      const thumbnailDir = path.join(__dirname, '../../public/uploads/thumbnails');
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }
      
      await thumbnailFile.mv(thumbnailPath);
      thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
    }
    
    // Get video duration (simplified - in production use ffprobe)
    const duration = 30; // Default duration
    
    // Create video record
    const video = new Video({
      title,
      description,
      videoUrl: `/uploads/videos/${videoFilename}`,
      thumbnailUrl,
      duration,
      creator: req.user.id,
      hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim().toLowerCase()) : []
    });
    
    await video.save();
    
    // Add video to user's videos
    await User.findByIdAndUpdate(req.user.id, { $push: { videos: video._id } });
    
    res.status(201).json(video);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Video upload failed' });
  }
};

// Get video by ID
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('creator', 'username profilePic bio')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profilePic' }
      });
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Increment view count
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};

// Like a video
exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Check if user already liked
    if (video.likes.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already liked' });
    }
    
    video.likes.push(req.user.id);
    await video.save();
    
    // Add to user's likes
    await User.findByIdAndUpdate(req.user.id, { $push: { likes: video._id } });
    
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to like video' });
  }
};

// Unlike a video
exports.unlikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    video.likes = video.likes.filter(id => id.toString() !== req.user.id);
    await video.save();
    
    // Remove from user's likes
    await User.findByIdAndUpdate(req.user.id, { $pull: { likes: video._id } });
    
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlike video' });
  }
};

// Add comment to video
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const comment = new Comment({
      content,
      video: video._id,
      user: req.user.id
    });
    
    await comment.save();
    
    // Add comment to video
    video.comments.push(comment._id);
    await video.save();
    
    // Populate user data
    await comment.populate('user', 'username profilePic');
    
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get videos by user
exports.getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ creator: req.params.userId })
      .populate('creator', 'username profilePic')
      .sort({ createdAt: -1 });
    
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user videos' });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Check if user is the creator
    if (video.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Delete video file
    const videoPath = path.join(__dirname, '../../public/uploads/videos', path.basename(video.videoUrl));
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
    
    // Delete thumbnail if exists
    if (video.thumbnailUrl) {
      const thumbnailPath = path.join(__dirname, '../../public/uploads/thumbnails', path.basename(video.thumbnailUrl));
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    
    // Delete video record
    await Video.findByIdAndDelete(req.params.id);
    
    // Remove from user's videos
    await User.findByIdAndUpdate(req.user.id, { $pull: { videos: req.params.id } });
    
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
};
