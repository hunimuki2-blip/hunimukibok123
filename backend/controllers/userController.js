const User = require('../models/User');
const Video = require('../models/Video');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('videos');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get video count and total likes
    const videoCount = user.videos ? user.videos.length : 0;
    const totalLikes = await Video.aggregate([
      { $match: { creator: user._id } },
      { $group: { _id: null, total: { $sum: { $size: '$likes' } } } }
    ]);
    
    const profileData = {
      ...user._doc,
      videoCount,
      totalLikes: totalLikes[0]?.total || 0,
      isFollowing: req.user && user.followers.includes(req.user.id)
    };
    
    res.json(profileData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Follow user
exports.follow = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    
    if (!userToFollow || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ error: 'Already following' });
    }
    
    // Add to following and followers
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);
    
    await currentUser.save();
    await userToFollow.save();
    
    res.json({ message: 'Following successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

// Unfollow user
exports.unfollow = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    
    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove from following and followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );
    
    await currentUser.save();
    await userToUnfollow.save();
    
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

// Get user followers
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'username profilePic bio');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
};

// Get user following
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'username profilePic bio');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch following' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, profilePic } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if username is taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      user.username = username;
    }
    
    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic;
    
    await user.save();
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get suggested users
exports.getSuggested = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Get users that current user is not following
    const suggestedUsers = await User.aggregate([
      { $match: { _id: { $ne: currentUser._id, $nin: currentUser.following } } },
      { $sample: { size: 10 } },
      { $project: { password: 0 } }
    ]);
    
    res.json(suggestedUsers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suggested users' });
  }
};
