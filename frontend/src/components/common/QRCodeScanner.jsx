import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize scanner only once when component mounts
    const qrScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    setScanner(qrScanner);

    // Start scanner
    qrScanner.render(onScanSuccess, onScanError);

    // Clean up on unmount
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  // Handle successful QR scan
  const onScanSuccess = async (decodedText) => {
    // Stop scanning after successful scan
    if (scanner) {
      scanner.clear();
    }
    
    setScanResult(decodedText);
    
    // Verify ticket with backend
    await verifyTicket(decodedText);
  };

  // Handle scan errors
  const onScanError = (errorMessage) => {
    console.error(`QR scan error: ${errorMessage}`);
  };

  // Verify ticket with backend API
  const verifyTicket = async (ticketCode) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/bookings/verify-ticket', {
        qrCode: ticketCode
      });
      
      setVerificationStatus(response.data.valid);
      setTicketInfo(response.data.ticket);
    } catch (err) {
      console.error('Ticket verification failed', err);
      setError(err.response?.data?.message || 'Verification failed');
      setVerificationStatus(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Reset scanner to scan another QR code
  const resetScanner = () => {
    setScanResult(null);
    setVerificationStatus(null);
    setTicketInfo(null);
    setError(null);
    
    // Re-initialize scanner
    if (scanner) {
      scanner.render(onScanSuccess, onScanError);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Scan Ticket QR Code</h2>
      
      {!scanResult ? (
        <div id="qr-reader" className="w-full"></div>
      ) : (
        <div className="w-full space-y-6">
          {isVerifying ? (
            <div className="flex flex-col items-center p-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
              <p className="text-lg">Verifying ticket...</p>
            </div>
          ) : verificationStatus ? (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-700">Valid Ticket</AlertTitle>
              <AlertDescription>
                This ticket has been verified and is valid for entry.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-red-500 bg-red-50">
              <XCircle className="h-5 w-5 text-red-500" />
              <AlertTitle className="text-red-700">Invalid Ticket</AlertTitle>
              <AlertDescription>
                {error || "This ticket is invalid or has already been used."}
              </AlertDescription>
            </Alert>
          )}

          {ticketInfo && (
            <Card className="p-4 my-4">
              <h3 className="text-xl font-semibold mb-2">{ticketInfo.eventTitle}</h3>
              <p><strong>Ticket #:</strong> {ticketInfo.ticketNumber}</p>
              <p><strong>Ticket Type:</strong> {ticketInfo.ticketTier}</p>
              {ticketInfo.seat && (
                <p><strong>Seat:</strong> Row {ticketInfo.seat.row}, Column {ticketInfo.seat.column}</p>
              )}
              <p><strong>Attendee:</strong> {ticketInfo.attendeeName}</p>
              <p><strong>Status:</strong> {ticketInfo.status}</p>
            </Card>
          )}
          
          <div className="flex justify-center">
            <Button onClick={resetScanner}>
              Scan Another Ticket
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;