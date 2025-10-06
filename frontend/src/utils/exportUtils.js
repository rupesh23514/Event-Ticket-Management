/**
 * Converts data to CSV format and triggers download
 * @param {Array} data - Array of objects to convert to CSV
 * @param {Array} headers - Array of header objects with key and display properties
 * @param {String} filename - Name of the file to download
 */
export const exportToCsv = (data, headers, filename) => {
  // Create CSV header row
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add headers
  csvContent += headers.map(header => header.display).join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      // Get the value and handle potential nested properties
      let value = header.key.split('.').reduce((obj, key) => obj && obj[key], item);
      
      // Handle empty values
      if (value === null || value === undefined) {
        value = '';
      }
      
      // Format date if needed
      if (header.type === 'date' && value) {
        value = new Date(value).toLocaleDateString();
      }
      
      // Format currency if needed
      if (header.type === 'currency' && value) {
        value = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
        }).format(value);
      }
      
      // Escape commas and quotes
      if (typeof value === 'string') {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
    
    csvContent += row + '\n';
  });
  
  // Add timestamp to filename
  const timestamp = new Date().toISOString().slice(0, 10);
  const filenameWithTimestamp = `${filename}-${timestamp}.csv`;
  
  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filenameWithTimestamp);
  document.body.appendChild(link);
  
  // Trigger download and remove link
  link.click();
  document.body.removeChild(link);
};

/**
 * Prepares user data for CSV export
 * @param {Array} users - Array of user objects
 */
export const exportUserData = (users) => {
  const headers = [
    { key: 'id', display: 'ID' },
    { key: 'fullName', display: 'Name' },
    { key: 'email', display: 'Email' },
    { key: 'role', display: 'Role' },
    { key: 'createdAt', display: 'Created At', type: 'date' },
    { key: 'lastLogin', display: 'Last Login', type: 'date' }
  ];
  
  exportToCsv(users, headers, 'user-data');
};

/**
 * Prepares event data for CSV export
 * @param {Array} events - Array of event objects
 */
export const exportEventData = (events) => {
  const headers = [
    { key: 'id', display: 'ID' },
    { key: 'title', display: 'Title' },
    { key: 'category', display: 'Category' },
    { key: 'date', display: 'Date', type: 'date' },
    { key: 'location', display: 'Location' },
    { key: 'organizer', display: 'Organizer' },
    { key: 'status', display: 'Status' },
    { key: 'ticketsSold', display: 'Tickets Sold' }
  ];
  
  exportToCsv(events, headers, 'event-data');
};

/**
 * Prepares payment data for CSV export
 * @param {Array} payments - Array of payment objects
 */
export const exportPaymentData = (payments) => {
  const headers = [
    { key: 'transactionId', display: 'Transaction ID' },
    { key: 'userName', display: 'User' },
    { key: 'eventName', display: 'Event' },
    { key: 'amount', display: 'Amount', type: 'currency' },
    { key: 'paymentMethod', display: 'Payment Method' },
    { key: 'status', display: 'Status' },
    { key: 'date', display: 'Date', type: 'date' }
  ];
  
  exportToCsv(payments, headers, 'payment-data');
};