import express from 'express';
import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create sample event for testing
router.post('/create-sample-event', asyncHandler(async (req, res) => {
  try {
    // Create a dummy organizer ID without actually creating a user
    const organizerId = new mongoose.Types.ObjectId();
    
    // Skip user creation and validation - just use a dummy ID
    
    const sampleEvent = {
      title: "Tech Conference 2025",
      description: "Join us for a full day of tech talks, networking, and innovation showcases. Learn from industry experts and connect with like-minded professionals.",
      location: {
        address: "123 Tech Avenue",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        zipCode: "94105",
        coordinates: {
          lat: 37.7749,
          lng: -122.4194
        }
      },
      eventDate: new Date("2025-12-15T09:00:00.000Z"),
      endDate: new Date("2025-12-15T18:00:00.000Z"),
      category: "Technology",
      tags: ["tech", "conference", "networking"],
      venueType: "indoor",
      status: "published",
      posterImage: {
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        publicId: "sample_image"
      },
      ticketTiers: [
        {
          name: "General Admission",
          price: 99.99,
          description: "Regular entry ticket",
          quantity: 200
        },
        {
          name: "VIP",
          price: 199.99,
          description: "VIP access with special amenities",
          quantity: 50
        }
      ],
      seatingLayout: {
        rows: 10,
        columns: 15,
        reserved: []
      },
      organizer: organizerId
    };
    
    // Check if we already have the sample event
    const existingEvent = await Event.findOne({ title: "Tech Conference 2025" });
    
    let event;
    if (existingEvent) {
      // Update the existing event
      event = await Event.findByIdAndUpdate(existingEvent._id, sampleEvent, { new: true });
    } else {
      // Create a new event
      event = await Event.create(sampleEvent);
    }
    
    res.status(201).json({
      success: true,
      message: "Sample event created successfully",
      event
    });
  } catch (error) {
    console.error("Error creating sample event:", error);
    res.status(500).json({
      success: false,
      message: "Error creating sample event",
      error: error.message
    });
  }
}));

export default router;