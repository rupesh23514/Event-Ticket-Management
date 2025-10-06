/**
 * Socket.io server setup for real-time event updates
 * Handles:
 * - Seat availability updates
 * - Booking confirmations
 * - Ticket scanning status
 */
export const initSocketServer = (io) => {
  // Middleware for authentication if needed
  io.use((socket, next) => {
    // In a real app, authenticate socket connections here
    next();
  });

  // Socket connection handler
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle client joining a specific event room
    socket.on('join_event', (eventId) => {
      socket.join(`event:${eventId}`);
      console.log(`Socket ${socket.id} joined event room ${eventId}`);
    });

    // Handle seat selection
    socket.on('select_seat', (data) => {
      const { eventId, seat, action } = data;

      if (action === 'select') {
        // Broadcast to all other users in the event room that this seat is being selected
        socket.to(`event:${eventId}`).emit('seat_status_change', {
          seat,
          status: 'selected',
          temporary: true,
        });
      } else if (action === 'deselect') {
        // Broadcast that this seat is being deselected
        socket.to(`event:${eventId}`).emit('seat_status_change', {
          seat,
          status: 'available',
        });
      }
    });

    // Handle booking confirmation
    socket.on('booking_confirmed', (data) => {
      const { eventId, seats } = data;

      // Broadcast to all users in the event room that these seats are now booked
      io.to(`event:${eventId}`).emit('seats_booked', {
        seats,
        status: 'booked',
      });
    });

    // Handle ticket scanning for organizers
    socket.on('ticket_scanned', (data) => {
      const { eventId, ticketNumber } = data;

      // Broadcast to relevant admin/organizer interfaces
      io.to(`event:${eventId}:admin`).emit('ticket_scan_update', {
        ticketNumber,
        scannedAt: new Date(),
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Emit a seat block event to all clients viewing an event
 * @param {object} io - Socket.io server instance
 * @param {string} eventId - ID of the event
 * @param {array} seats - Array of seat objects that are being blocked
 */
export const emitSeatBlock = (io, eventId, seats) => {
  io.to(`event:${eventId}`).emit('seats_blocked', {
    seats,
    status: 'blocked',
  });
};

/**
 * Emit an event status change to all clients
 * @param {object} io - Socket.io server instance
 * @param {string} eventId - ID of the event
 * @param {string} newStatus - New status of the event
 */
export const emitEventStatusChange = (io, eventId, newStatus) => {
  io.to(`event:${eventId}`).emit('event_status_change', {
    status: newStatus,
  });
};