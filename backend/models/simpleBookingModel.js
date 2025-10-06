import mongoose from 'mongoose';

const simpleBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      // This will store the Supabase UID
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    qrDataUrl: {
      type: String, // Store the QR code as a data URL
    },
    qrCode: {
      type: String, // Optional: Store a URL to the QR code (e.g., Cloudinary)
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
simpleBookingSchema.index({ userId: 1 });
simpleBookingSchema.index({ eventId: 1 });

const SimpleBooking = mongoose.model('SimpleBooking', simpleBookingSchema);

export default SimpleBooking;