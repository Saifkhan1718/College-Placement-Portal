import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Configuration & DB
import connectDB from './config/db.js';

// Middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import tpoRoutes from './routes/tpoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing/development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Save io reference to express app context to access it in controller routes
app.set('io', io);

// Security & Parsing Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Ensure local uploaded static files are readable by frontend
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API requests
app.use('/api', apiLimiter);

// Static Uploads Folder serving
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/tpo', tpoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes); // Handles jobs and applications
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Base route for connectivity check
app.get('/', (req, res) => {
  res.json({ message: 'College Placement Portal API is running successfully.' });
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log(`Socket Client Connected: ${socket.id}`);

  // Join a personal room based on user ID for targeted messages/notifications
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    }
  });

  // Handle direct messaging relay if clients prefer sending over web sockets directly
  socket.on('send_direct_message', ({ senderId, recipientId, message }) => {
    io.to(recipientId).emit('receive_direct_message', {
      senderId,
      message,
      createdAt: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket Client Disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
