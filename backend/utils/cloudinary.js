import cloudinary from 'cloudinary';
import fs from 'fs';
import { promisify } from 'util';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const unlinkAsync = promisify(fs.unlink);

/**
 * Uploads a file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Folder in Cloudinary to upload to
 * @returns {Promise<object>} Cloudinary upload response
 */
export const uploadToCloudinary = async (filePath, folder = '') => {
  try {
    const uploadOptions = {
      resource_type: 'auto',
      folder: folder,
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    
    // Remove temp file after upload
    await unlinkAsync(filePath);
    
    return result;
  } catch (error) {
    // Remove temp file if upload fails
    try {
      await unlinkAsync(filePath);
    } catch (err) {
      console.error('Error removing temp file:', err);
    }
    
    throw error;
  }
};

/**
 * Deletes a file from Cloudinary by public ID
 * @param {string} publicId - Public ID of the file to delete
 * @returns {Promise<object>} Cloudinary deletion response
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

export default { uploadToCloudinary, deleteFromCloudinary };