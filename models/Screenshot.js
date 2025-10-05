import mongoose from 'mongoose';

const screenshotSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image is required']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: ''
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
screenshotSchema.index({ userId: 1 });
screenshotSchema.index({ createdAt: -1 });

export default mongoose.model('Screenshot', screenshotSchema);