import QRCode from 'qrcode';

/**
 * Generates a QR code as a data URL
 * @param {string} data - Data to encode in the QR code
 * @param {object} options - QR code generation options
 * @returns {Promise<string>} QR code as data URL
 */
export const generateQRCode = async (data, options = {}) => {
  const defaultOptions = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 1,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, mergedOptions);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Validates a QR code by checking if it matches the expected format
 * @param {string} qrData - Data from scanned QR code
 * @returns {boolean} Whether the QR code is valid
 */
export const validateQRCode = (qrData) => {
  // Example validation - in a real app, this would be more sophisticated
  const parts = qrData.split('-');
  
  // Check if the QR code has the expected format (eventId-userId-timestamp-random)
  if (parts.length !== 4) {
    return false;
  }

  // Check if eventId and userId are valid ObjectIds
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(parts[0]) || !objectIdRegex.test(parts[1])) {
    return false;
  }

  // Check if timestamp is a valid number
  if (isNaN(parseInt(parts[2]))) {
    return false;
  }

  return true;
};

export default {
  generateQRCode,
  validateQRCode,
};