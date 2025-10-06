import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    tickets: [
      {
        ticketTier: {
          type: String,
          required: true,
        },
        seat: {
          row: Number,
          column: Number,
          zoneId: String,
        },
        price: {
          type: Number,
          required: true,
        },
        qrCode: String,
        ticketNumber: {
          type: String,
          required: true,
        },
        isScanned: {
          type: Boolean,
          default: false,
        },
        scannedAt: Date,
        scannedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'refunded', 'partial_refund'],
      default: 'pending',
    },
    paymentInfo: {
      paymentId: String,
      paymentMethod: {
        type: String,
        enum: ['stripe', 'razorpay', 'other'],
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      paymentDate: Date,
      receiptUrl: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    contactInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: String,
    },
    specialRequirements: String,
    cancellationReason: String,
    refundInfo: {
      refundId: String,
      refundAmount: Number,
      refundDate: Date,
      refundStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
      },
    },
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Generate ticket number
bookingSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Generate ticket numbers for each ticket
    this.tickets = this.tickets.map((ticket) => {
      const ticketPrefix = 'TIX';
      const randomPart = Math.floor(10000000 + Math.random() * 90000000);
      ticket.ticketNumber = `${ticketPrefix}-${randomPart}`;
      return ticket;
    });
  }
  next();
});

// Indexing for faster queries
bookingSchema.index({ user: 1, 'paymentInfo.paymentStatus': 1 });
bookingSchema.index({ event: 1, status: 1 });
bookingSchema.index({ 'tickets.ticketNumber': 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;