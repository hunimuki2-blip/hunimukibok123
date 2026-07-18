const Video = require('../models/Video');
const User = require('../models/User');

// Get feed videos (for you page)
exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get videos sorted by creation date (newest first)
    const videos = await Video.find()
      .populate('creator', 'username profilePic bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Video.countDocuments();
    
    res.json({
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};

// Get trending videos
exports.getTrending = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // Get videos with most views, likes, and recent activity
    const videos = await Video.aggregate([
      {
        $addFields: {
          engagement: {
            $add: [
              { $multiply: ["$views", 0.3] },
              { $multiply: [{ $size: "$likes" }, 0.5] },
              { $multiply: [{ $size: "$comments" }, 0.2] },
              { $multiply: ["$shares", 0.4] }
            ]
          }
        }
      },
      { $sort: { engagement: -1, createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: '$creator' },
      {
        $project: {
          'creator.password': 0
        }
      }
    ]);
    
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending videos' });
  }
};

// Get videos by hashtag
exports.getByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const videos = await Video.find({ hashtags: hashtag.toLowerCase() })
      .populate('creator', 'username profilePic bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Video.countDocuments({ hashtags: hashtag.toLowerCase() });
    
    res.json({
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hashtag
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hashtag videos' });
  }
};

// Search videos
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const videos = await Video.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { hashtags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .populate('creator', 'username profilePic bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Video.countDocuments({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { hashtags: { $in: [new RegExp(q, 'i')] } }
      ]
    });
    
    res.json({
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      query: q
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to search videos' });
  }
};
