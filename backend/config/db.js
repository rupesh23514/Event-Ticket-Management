import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with an explicit path
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Note: This loads from the root project .env file

/**
 * Connects to MongoDB Atlas using the connection string from environment variables
 * Implements connection pooling and proper error handling
 */
export const connectDB = async () => {
  try {
    // Log the MongoDB URI (without password) for debugging
    const uriForLogging = process.env.MONGO_URI 
      ? process.env.MONGO_URI.replace(/\/\/([^:]+):[^@]+@/, '//\$1:***@')
      : 'undefined';
    console.log(`Attempting to connect to MongoDB with URI: ${uriForLogging}`);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is undefined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options ensure proper handling of connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected!');
    });
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};