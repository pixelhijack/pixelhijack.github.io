// upload_photos.js
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

if(!process.env.CLOUDINARY_API_KEY){
    console.log("Cloudinary API Key is not set");
    return;
}

// The local path to your photos folder
const photoFolderPath = './img';

// Function to upload a single image
async function uploadImage(imagePath) {
    const filename = path.basename(imagePath).split('.')[0]; // Get filename without extension
    const extension = path.extname(imagePath).substring(1); // Get file extension

    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            // Set the public_id to be the filename
            public_id: filename,
            // Optionally, add a folder to keep things organized
            //folder: 'portfolio',
            // Optional: Automatically convert to best format and quality
            quality: 'auto',
            fetch_format: 'auto'
        });

        console.log(`Successfully uploaded: ${result.public_id}.${extension}`);
        console.log(`Access at URL: ${result.secure_url}`);
    } catch (error) {
        console.error(`Failed to upload ${imagePath}:`, error.message);
    }
}

// Function to iterate through all images in the folder and upload them
async function bulkUpload() {
    try {
        const files = fs.readdirSync(photoFolderPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });

        if (imageFiles.length === 0) {
            console.log('No image files found in the specified folder.');
            return;
        }

        console.log(`Found ${imageFiles.length} images to upload...`);

        for (const file of imageFiles) {
            const imagePath = path.join(photoFolderPath, file);
            await uploadImage(imagePath);
        }

        console.log('Bulk upload complete!');

    } catch (error) {
        console.error('Error reading the photo folder:', error.message);
    }
}

bulkUpload();