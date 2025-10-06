import nodemailer from 'nodemailer';

/**
 * Creates an email transporter based on environment configuration
 * @returns {object} Configured nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send booking confirmation email with ticket details
 * @param {object} booking - Booking document from database
 * @returns {Promise<object>} Email sending result
 */
export const sendBookingConfirmation = async (booking) => {
  // Only send for confirmed bookings
  if (booking.status !== 'confirmed') {
    throw new Error('Cannot send confirmation for unconfirmed booking');
  }

  try {
    const transporter = createTransporter();

    // Get event details by populating the booking
    await booking.populate('event', 'title eventDate location').execPopulate();

    // Build email content
    const emailContent = `
      <h1>Your Booking Confirmation</h1>
      <p>Dear ${booking.contactInfo.name},</p>
      <p>Thank you for your booking! Here are your ticket details:</p>
      
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <h2>${booking.event.title}</h2>
        <p><strong>Date:</strong> ${new Date(booking.event.eventDate.startDate).toLocaleString()}</p>
        <p><strong>Location:</strong> ${booking.event.location.address}, ${booking.event.location.city}</p>
        <p><strong>Booking Reference:</strong> ${booking._id}</p>
      </div>
      
      <h3>Your Tickets:</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background-color: #f3f3f3;">
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Ticket Type</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Ticket #</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Seat</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Price</th>
        </tr>
        ${booking.tickets
          .map(
            (ticket) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${ticket.ticketTier}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${ticket.ticketNumber}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              ${
                ticket.seat && ticket.seat.row
                  ? `Row ${ticket.seat.row}, Column ${ticket.seat.column}`
                  : 'General Admission'
              }
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">$${ticket.price.toFixed(2)}</td>
          </tr>
        `
          )
          .join('')}
        <tr style="background-color: #f3f3f3;">
          <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>Total:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">$${booking.totalAmount.toFixed(2)}</td>
        </tr>
      </table>
      
      <p>Each ticket has a unique QR code attached to this email. Please present it for scanning at the event entrance.</p>
      
      <p>We hope you enjoy the event!</p>
      
      <p style="margin-top: 40px; font-size: 12px; color: #777;">
        This is an automated message. Please do not reply to this email.
      </p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@eventicketing.com',
      to: booking.contactInfo.email,
      subject: `Booking Confirmation: ${booking.event.title}`,
      html: emailContent,
      // In a real app, we would attach QR codes as PDFs or images
      // attachments: booking.tickets.map((ticket) => ({
      //   filename: `ticket-${ticket.ticketNumber}.pdf`,
      //   content: generateTicketPDF(ticket, booking, booking.event),
      // })),
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} name - User name
 * @returns {Promise<object>} Email sending result
 */
export const sendPasswordResetEmail = async (to, resetToken, name) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@eventicketing.com',
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Dear ${name},</p>
        <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
        <p>Please click on the following link to reset your password:</p>
        <p><a href="${resetUrl}" style="padding: 10px 20px; background-color: #4299e1; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

/**
 * Send event reminder email
 * @param {object} booking - Booking document
 * @param {object} event - Event document
 * @returns {Promise<object>} Email sending result
 */
export const sendEventReminder = async (booking, event) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@eventicketing.com',
      to: booking.contactInfo.email,
      subject: `Reminder: ${event.title} is tomorrow!`,
      html: `
        <h1>Event Reminder</h1>
        <p>Dear ${booking.contactInfo.name},</p>
        <p>This is a friendly reminder that you have tickets for the following event tomorrow:</p>
        
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h2>${event.title}</h2>
          <p><strong>Date:</strong> ${new Date(event.eventDate.startDate).toLocaleString()}</p>
          <p><strong>Location:</strong> ${event.location.address}, ${event.location.city}</p>
          <p><strong>Doors Open:</strong> ${new Date(event.eventDate.doorsOpen).toLocaleTimeString()}</p>
        </div>
        
        <p>Don't forget to bring your tickets! You can access them in your account or in the confirmation email we sent you.</p>
        
        <p>We look forward to seeing you!</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export default {
  sendBookingConfirmation,
  sendPasswordResetEmail,
  sendEventReminder,
};