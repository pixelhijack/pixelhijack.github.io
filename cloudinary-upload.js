require('dotenv').config(); // Load environment variables from .env file
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Cloudinary Configuration: Replace with your actual credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_API_KEY) {
  console.log("Cloudinary API Key is not set");
  return;
}

// The root folder for your images
const photoFolderPath = './uploadtest';
// The output JSON file for uploaded records
const uploadedFilePath = './uploaded.json';

// Load existing uploaded records if available
let uploadedRecords = {};
if (fs.existsSync(uploadedFilePath)) {
  try {
    uploadedRecords = JSON.parse(fs.readFileSync(uploadedFilePath, 'utf8'));
  } catch (error) {
    console.error("Error reading uploaded.json:", error.message);
  }
}

/**
 * Recursively process a folder.
 * @param {string} dir - Absolute path of the folder.
 * @param {string} relPath - Relative path from the root photo folder.
 */
async function processFolder(dir, relPath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const currentRelPath = relPath ? path.join(relPath, entry.name) : entry.name;
    if (entry.isDirectory()) {
      await processFolder(fullPath, relPath ? path.join(relPath, entry.name) : entry.name);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        // Determine cloudinary folder:
        // If relPath is empty, cloudinary folder is empty string, else use the relPath without the filename.
        const folderName = relPath; // This is the subfolder relative path (e.g. "analog/floral")
        // Use the file name as public_id, preserving extension.
        const fileNameWithExtension = entry.name;
        // Cloudinary automatically appends a file format extension when you upload an image. If you pass a filename that already includes an extension (like "DSC01746.jpg"), Cloudinary ends up appending the extension again (resulting in "DSC01746.jpg.jpg").
        // To fix this, remove the file extension when setting the public_id. For example, replace:
        const publicId = path.parse(entry.name).name; // This is the filename without extension (e.g. "DSC01746")
        // Skip already uploaded images (if desired)
        const recordKey = folderName ? path.join(folderName, fileNameWithExtension) : fileNameWithExtension;
        if (uploadedRecords[recordKey]) {
          console.log(`⛔ Already uploaded: ${recordKey}`);
          continue;
        }
        await uploadImage(fullPath, publicId, folderName, recordKey);
      }
    }
  }
}

/**
 * Upload a single image to Cloudinary.
 * @param {string} imagePath - The local image path.
 * @param {string} publicId - The public id to use.
 * @param {string} folder - The folder name for Cloudinary.
 * @param {string} recordKey - The key to store in uploadedRecords.
 */
async function uploadImage(imagePath, publicId, folder, recordKey) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      folder: folder
    });
    console.log(`Successfully uploaded: ${recordKey}`);
    console.log(`Access at URL: ${result.secure_url}`);
    // Record the timestamp of upload
    uploadedRecords[recordKey] = new Date().toISOString();
    // Write the updated records to uploaded.json
    fs.writeFileSync(uploadedFilePath, JSON.stringify(uploadedRecords, null, 2));
  } catch (error) {
    console.error(`Failed to upload ${imagePath}:`, error.message);
  }
}

// Start processing from the root photo folder
(async function bulkUpload() {
  try {
    await processFolder(photoFolderPath);
    console.log('Bulk upload complete!');
  } catch (error) {
    console.error('Error during bulk upload:', error.message);
  }
})();