import Screenshot from '../models/Screenshot.js';

// @desc    Get all screenshots
// @route   GET /api/screenshots
// @access  Public
export const getAllScreenshots = async (req, res) => {
  try {
    const screenshots = await Screenshot.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: screenshots.length,
      data: screenshots
    });
  } catch (error) {
    console.error('Get screenshots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single screenshot
// @route   GET /api/screenshots/:id
// @access  Public
export const getScreenshotById = async (req, res) => {
  try {
    const screenshot = await Screenshot.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!screenshot) {
      return res.status(404).json({
        success: false,
        message: 'Screenshot not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: screenshot
    });
  } catch (error) {
    console.error('Get screenshot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upload new screenshot
// @route   POST /api/screenshots
// @access  Private
export const uploadScreenshot = async (req, res) => {
  try {
    const { imageUrl, description } = req.body;
    
    // Validate required fields
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image'
      });
    }

    // Optional: Validate base64 image size (limit to 5MB)
    const sizeInBytes = (imageUrl.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 5) {
      return res.status(400).json({
        success: false,
        message: 'Image size should be less than 5MB'
      });
    }
    
    const screenshot = await Screenshot.create({
      imageUrl,
      description: description || '',
      userId: req.user._id
    });
    
    const populatedScreenshot = await Screenshot.findById(screenshot._id)
      .populate('userId', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Screenshot uploaded successfully',
      data: populatedScreenshot
    });
  } catch (error) {
    console.error('Upload screenshot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update screenshot
// @route   PUT /api/screenshots/:id
// @access  Private
export const updateScreenshot = async (req, res) => {
  try {
    let screenshot = await Screenshot.findById(req.params.id);
    
    if (!screenshot) {
      return res.status(404).json({
        success: false,
        message: 'Screenshot not found'
      });
    }
    
    // Check if user owns the screenshot
    if (screenshot.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this screenshot'
      });
    }
    
    const { imageUrl, description } = req.body;
    
    screenshot = await Screenshot.findByIdAndUpdate(
      req.params.id,
      { imageUrl, description },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Screenshot updated successfully',
      data: screenshot
    });
  } catch (error) {
    console.error('Update screenshot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete screenshot
// @route   DELETE /api/screenshots/:id
// @access  Private
export const deleteScreenshot = async (req, res) => {
  try {
    const screenshot = await Screenshot.findById(req.params.id);
    
    if (!screenshot) {
      return res.status(404).json({
        success: false,
        message: 'Screenshot not found'
      });
    }
    
    // Check if user owns the screenshot
    if (screenshot.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this screenshot'
      });
    }
    
    await Screenshot.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Screenshot deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete screenshot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get screenshots by user
// @route   GET /api/screenshots/user/:userId
// @access  Public
export const getScreenshotsByUser = async (req, res) => {
  try {
    const screenshots = await Screenshot.find({ userId: req.params.userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: screenshots.length,
      data: screenshots
    });
  } catch (error) {
    console.error('Get user screenshots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};