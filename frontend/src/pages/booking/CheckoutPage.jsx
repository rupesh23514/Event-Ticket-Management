import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

// Assuming you have your Stripe public key in an environment variable
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe('pk_test_YOUR_KEY_HERE'); // Replace with your actual key

function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [billingDetails, setBillingDetails] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  });

  useEffect(() => {
    // Redirect if no booking details in state
    if (!state || (!state.eventId && !state.bookingId)) {
      toast.error('No booking information found');
      navigate('/events');
      return;
    }

    // Set order details from state
    if (state.eventId) {
      setOrderDetails({
        eventId: state.eventId,
        eventName: state.eventName,
        ticketPrice: state.ticketPrice,
        selectedSeats: state.selectedSeats || [],
        quantity: state.quantity || state.selectedSeats?.length || 0,
        totalAmount: state.totalAmount || 0,
      });
    } else if (state.bookingId) {
      // Fetch booking details using the bookingId
      const fetchBookingDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/bookings/${state.bookingId}`);
          setOrderDetails({
            bookingId: state.bookingId,
            eventName: response.data.eventName,
            ticketPrice: response.data.ticketPrice,
            selectedSeats: response.data.seats || [],
            quantity: response.data.quantity,
            totalAmount: response.data.totalAmount,
          });
          setLoading(false);
        } catch (err) {
          console.error('Error fetching booking details:', err);
          setError('Could not load booking details. Please try again.');
          setLoading(false);
        }
      };

      fetchBookingDetails();
    }
  }, [state, navigate]);

  const handleBillingDetailsChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBillingDetails({
        ...billingDetails,
        [parent]: {
          ...billingDetails[parent],
          [child]: value,
        },
      });
    } else {
      setBillingDetails({
        ...billingDetails,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to complete your purchase');
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // For card payments, create a payment intent and redirect to Stripe
      if (paymentMethod === 'card') {
        const bookingData = {
          eventId: orderDetails.eventId,
          seats: orderDetails.selectedSeats,
          quantity: orderDetails.quantity,
          totalAmount: orderDetails.totalAmount,
          userId: user.id,
          paymentMethod: 'stripe',
          billingDetails: billingDetails,
        };
        
        // Create a booking and get session URL
        const response = await axios.post('/api/payments/create-checkout-session', bookingData);
        
        // Redirect to Stripe Checkout
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
        
        if (error) {
          setError(error.message);
          setLoading(false);
        }
      } 
      // For PayPal, you would implement similar logic with PayPal SDK
      else if (paymentMethod === 'paypal') {
        // PayPal payment logic would go here
        toast.error('PayPal payments are not implemented in this demo');
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading && !orderDetails) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!orderDetails) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-card p-6 rounded-lg border shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{orderDetails.eventName}</h3>
                <p className="text-sm text-muted-foreground">
                  {orderDetails.quantity} {orderDetails.quantity === 1 ? 'Ticket' : 'Tickets'}
                </p>
                {orderDetails.selectedSeats && orderDetails.selectedSeats.length > 0 && (
                  <div className="mt-1 text-sm">
                    <span className="text-muted-foreground">Seats: </span>
                    <span>{orderDetails.selectedSeats.join(', ')}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Ticket Price</span>
                  <span>${orderDetails.ticketPrice.toFixed(2)} x {orderDetails.quantity}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>${(orderDetails.totalAmount * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(orderDetails.totalAmount * 1.05).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}
          
          <div className="bg-card p-6 rounded-lg border shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border rounded-md flex items-center justify-center gap-3 transition-colors ${
                  paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    d="M22 10H2"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Credit/Debit Card
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 border rounded-md flex items-center justify-center gap-3 transition-colors ${
                  paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path
                    d="M18.3 5.71c-1.07-.22-2.23-.42-3.07-.42-4.51 0-7.23 2.23-7.23 5.94 0 3.46 2.69 5.71 6.95 5.71.91 0 2.23-.2 3.07-.42.84-.22 1.47-.62 1.47-1.43v-7.95c0-.81-.63-1.21-1.19-1.43zM6.95 5.71c-1.07-.22-2.23-.42-3.07-.42C-.63 5.29-3.35 7.52-3.35 11.23c0 3.46 2.69 5.71 6.95 5.71.91 0 2.23-.2 3.07-.42.84-.22 1.47-.62 1.47-1.43v-7.95c0-.81-.63-1.21-1.19-1.43z"
                    fill="#003087"
                  />
                  <path
                    d="M18.3 5.71c-1.07-.22-2.23-.42-3.07-.42-4.51 0-7.23 2.23-7.23 5.94 0 3.46 2.69 5.71 6.95 5.71.91 0 2.23-.2 3.07-.42.84-.22 1.47-.62 1.47-1.43v-7.95c0-.81-.63-1.21-1.19-1.43z"
                    fill="#0070E0"
                  />
                </svg>
                PayPal
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="bg-card p-6 rounded-lg border shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={billingDetails.name}
                    onChange={handleBillingDetailsChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={billingDetails.email}
                    onChange={handleBillingDetailsChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={billingDetails.phone}
                    onChange={handleBillingDetailsChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address.line1" className="block text-sm font-medium mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="address.line1"
                    name="address.line1"
                    value={billingDetails.address.line1}
                    onChange={handleBillingDetailsChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address.line2" className="block text-sm font-medium mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    id="address.line2"
                    name="address.line2"
                    value={billingDetails.address.line2}
                    onChange={handleBillingDetailsChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={billingDetails.address.city}
                    onChange={handleBillingDetailsChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={billingDetails.address.state}
                    onChange={handleBillingDetailsChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address.postal_code" className="block text-sm font-medium mb-1">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="address.postal_code"
                    name="address.postal_code"
                    value={billingDetails.address.postal_code}
                    onChange={handleBillingDetailsChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address.country" className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <select
                    id="address.country"
                    name="address.country"
                    value={billingDetails.address.country}
                    onChange={handleBillingDetailsChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm mb-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                  I agree to the Terms of Service, Privacy Policy, and Refund Policy
                </label>
              </div>
              
              {/* For Stripe, this is a button that will redirect to Stripe checkout */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ${(orderDetails.totalAmount * 1.05).toFixed(2)} USD`}
              </button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Your payment will be processed securely through {paymentMethod === 'card' ? 'Stripe' : 'PayPal'}.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;