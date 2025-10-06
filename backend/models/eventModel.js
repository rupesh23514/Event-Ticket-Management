import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    posterImage: {
      url: {
        type: String,
        required: [true, 'Poster image is required'],
      },
      publicId: String, // For Cloudinary
    },
    location: {
      address: {
        type: String,
        required: [true, 'Event address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    eventDate: {
      startDate: {
        type: Date,
        required: [true, 'Start date is required'],
      },
      endDate: {
        type: Date,
        required: [true, 'End date is required'],
      },
      doorsOpen: {
        type: Date,
        required: [true, 'Doors open time is required'],
      },
    },
    venueType: {
      type: String,
      enum: ['stadium', 'cinema', 'hall', 'theater', 'conference', 'outdoor', 'other'],
      required: [true, 'Venue type is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'pending_approval', 'published', 'sold_out', 'cancelled', 'archived'],
      default: 'draft',
    },
    category: {
      type: String,
      enum: ['concert', 'sports', 'theater', 'conference', 'exhibition', 'workshop', 'festival', 'other'],
      required: [true, 'Event category is required'],
    },
    seatingLayout: {
      type: {
        type: String,
        enum: ['seated', 'general_admission', 'mixed'],
        required: true,
      },
      rowsCount: {
        type: Number,
        required: function () {
          return this.seatingLayout.type === 'seated' || this.seatingLayout.type === 'mixed';
        },
      },
      columnsCount: {
        type: Number,
        required: function () {
          return this.seatingLayout.type === 'seated' || this.seatingLayout.type === 'mixed';
        },
      },
      unavailableSeats: [
        {
          row: Number,
          column: Number,
          reason: {
            type: String,
            enum: ['structural', 'technical', 'visibility', 'other'],
            default: 'other',
          },
        },
      ],
      zones: [
        {
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          color: {
            type: String,
            default: '#4299e1', // Default color
          },
          seats: [
            {
              row: Number,
              column: Number,
            },
          ],
          capacity: {
            // For general admission zones
            type: Number,
            default: 0,
          },
        },
      ],
      // For custom seating arrangements (e.g., circular)
      customLayout: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
    ticketTiers: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        description: String,
        quantity: {
          type: Number,
          required: true,
        },
        quantitySold: {
          type: Number,
          default: 0,
        },
        zoneId: String, // Reference to zone in seatingLayout
      },
    ],
    blockedSeats: [
      {
        seat: {
          row: Number,
          column: Number,
          zoneId: String,
        },
        blockedUntil: Date,
        blockedBy: mongoose.Schema.Types.ObjectId,
      },
    ],
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalTicketsSold: {
      type: Number,
      default: 0,
    },
    refundPolicy: {
      type: String,
      enum: ['no_refund', 'partial_refund', 'full_refund_until_event'],
      default: 'no_refund',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalDate: Date,
    tags: [String],
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for getting available seats
eventSchema.virtual('availableSeats').get(function () {
  let totalSeats = 0;
  let availableSeats = 0;

  if (this.seatingLayout.type === 'seated' || this.seatingLayout.type === 'mixed') {
    // Calculate for seated sections
    this.seatingLayout.zones.forEach((zone) => {
      totalSeats += zone.seats.length;
    });

    // Subtract unavailable seats
    totalSeats -= this.seatingLayout.unavailableSeats.length;
  }

  if (this.seatingLayout.type === 'general_admission' || this.seatingLayout.type === 'mixed') {
    // Add general admission capacity
    this.seatingLayout.zones.forEach((zone) => {
      if (zone.capacity) {
        totalSeats += zone.capacity;
      }
    });
  }

  // Subtract sold tickets
  availableSeats = totalSeats - this.totalTicketsSold;

  return {
    total: totalSeats,
    available: availableSeats,
    sold: this.totalTicketsSold,
  };
});

// Index for searches
eventSchema.index({ title: 'text', description: 'text', 'location.city': 'text', 'location.country': 'text' });

// Index for date queries
eventSchema.index({ 'eventDate.startDate': 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;