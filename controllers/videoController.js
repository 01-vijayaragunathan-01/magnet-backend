import Video from '../models/Video.js';

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
  try {
    const { title, description, category, duration, url, thumbnail } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !duration || !url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    const video = await Video.create({
      title,
      description,
      category,
      duration,
      url,
      thumbnail: thumbnail || '',
      userId: req.user._id
    });
    
    const populatedVideo = await Video.findById(video._id)
      .populate('userId', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: populatedVideo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res) => {
  try {
    let video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Check if user owns the video
    if (video.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this video'
      });
    }
    
    const { title, description, category, duration, url, thumbnail } = req.body;
    
    video = await Video.findByIdAndUpdate(
      req.params.id,
      { title, description, category, duration, url, thumbnail },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      data: video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Check if user owns the video
    if (video.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this video'
      });
    }
    
    await Video.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get videos by user
// @route   GET /api/videos/user/:userId
// @access  Public
export const getVideosByUser = async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.params.userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};