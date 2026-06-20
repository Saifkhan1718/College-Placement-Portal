import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';

// Get messages between logged in user and another user
export const getMessages = async (req, res) => {
  const { recipientId } = req.params;
  const senderId = req.user._id;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message (HTTP fallback or recording)
export const sendMessage = async (req, res) => {
  const { recipientId, message } = req.body;
  const senderId = req.user._id;

  try {
    const chatMsg = await ChatMessage.create({
      sender: senderId,
      recipient: recipientId,
      message,
    });

    // Send real-time event if Socket.io is active
    const io = req.app.get('io');
    if (io) {
      io.to(recipientId).emit('receive_message', chatMsg);
    }

    res.status(201).json(chatMsg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get TPO announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await ChatMessage.find({ isAnnouncement: true })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Post TPO announcement
export const postAnnouncement = async (req, res) => {
  const { message } = req.body;

  try {
    const announcement = await ChatMessage.create({
      sender: req.user._id,
      isAnnouncement: true,
      message,
    });

    const populated = await ChatMessage.findById(announcement._id).populate('sender', 'name role');

    // Broadcast to all active sockets
    const io = req.app.get('io');
    if (io) {
      io.emit('new_announcement', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
