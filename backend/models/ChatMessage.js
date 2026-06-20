import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // If null and isAnnouncement is true, it's a broadcast/group announcement
  },
  isAnnouncement: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
