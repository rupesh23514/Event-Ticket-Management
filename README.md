# Event Ticketing System

A professional-level event ticketing platform with interactive seat booking, real-time updates, and comprehensive management features.

## Features

### Authentication & Security
- **Supabase Auth** with email verification, password reset, and social logins
- Role-based access control (User, Organizer, Admin)

### Event Management
- Create and manage events with detailed information
- Custom venue and seating layouts
- Multiple ticket tiers with dynamic pricing
- Event lifecycle management

### Booking Experience
- Interactive seat selection with real-time availability
- WebSocket-powered live updates
- Seamless checkout process

### Payments & Orders
- Stripe payment integration
- Digital tickets with QR codes
- Comprehensive order management

### Dashboards & Analytics
- User booking history and upcoming events
- Organizer event performance metrics
- Admin platform overview with insights

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS with shadcn/ui components
- Framer Motion for animations
- Supabase Auth for authentication
- Socket.io client for real-time updates

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- Socket.io for WebSockets
- JWT for API security
- Stripe for payment processing

## Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Supabase account
- Stripe account (for payments)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd event-ticketing-system
   ```

2. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp .env.example .env
   ```
   Fill in your actual credentials in the .env file

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the development servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Backend
1. Deploy to Railway/Render/Heroku
2. Set up environment variables
3. Configure MongoDB Atlas for production

### Frontend
1. Build the frontend: `npm run build`
2. Deploy to Vercel/Netlify
3. Configure environment variables

## Project Structure

```
event-ticketing-system/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    ├── .env
    ├── package.json
    └── server.js
```

## License
MIT

## Contributors
Your Name