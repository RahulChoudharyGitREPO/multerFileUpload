// src/index.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const app = express();
const port = process.env.PORT || 3000;

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (req, file) => 'png', // supports promises as well
        public_id: (req, file) => file.originalname.split('.')[0],
    },
});

// Multer configuration
const upload = multer({ storage: storage });

// Serve the HTML form
app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/index.html');
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).json({
            message: 'File uploaded successfully',
            imageUrl: req.file.path,
        });
    } else {
        res.status(400).json({
            message: 'File upload failed',
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
