import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import simpleBookingRoutes from './routes/simpleBookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import organizerRoutes from './routes/organizerRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { initSocketServer } from './utils/socketServer.js';
import stripeWebhookRoute from './routes/stripeWebhookRoute.js';
import sampleDataRoutes from './routes/sampleDataRoutes.js';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with an explicit path
dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log('Environment variables loaded from:', path.resolve(__dirname, '.env'));

// Make sure we're using the correct MongoDB connection
if (!process.env.MONGO_URI || !process.env.MONGO_URI.includes('eventtickets_user')) {
  console.warn('Warning: Using fallback MongoDB connection string. Check your .env file.');
}

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize socket server
initSocketServer(io);

// Middlewares
app.use(express.json());
app.use('/api/webhook/stripe', stripeWebhookRoute); // Raw body for Stripe webhooks
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Routes
app.get('/', (req, res) => res.send('Event Ticketing API running'));
app.get('/test', (req, res) => res.json({ message: 'API is working!' }));

// Direct sample event creation route
app.post('/api/create-sample', async (req, res) => {
  try {
    const sampleEvent = {
      title: "Tech Conference 2025",
      description: "Join us for a full day of tech talks, networking, and innovation showcases.",
      organizer: new mongoose.Types.ObjectId(),
      location: {
        address: "123 Tech Avenue",
        city: "San Francisco",
        state: "CA",
        country: "USA"
      },
      eventDate: new Date("2025-12-15"),
      endDate: new Date("2025-12-15"),
      category: "Technology",
      status: "published",
      isApproved: true,
      ticketTiers: [{
        name: "General Admission",
        price: 99.99,
        quantity: 100
      }]
    };
    
    // Check if event exists
    const existingEvent = await Event.findOne({ title: "Tech Conference 2025" });
    if (existingEvent) {
      return res.json({ message: "Sample event already exists", event: existingEvent });
    }
    
    // Create new event
    const newEvent = new Event(sampleEvent);
    await newEvent.save();
    
    res.json({ message: "Sample event created", event: newEvent });
  } catch (error) {
    console.error("Error creating sample event:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/simple-bookings', simpleBookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/sample', sampleDataRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`));
