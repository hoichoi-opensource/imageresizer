const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Dimensions to resize to
const dimensions = [
    { width: 100, height: 100 },
    { width: 200, height: 200 },
    { width: 300, height: 300 },
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('image'), async (req, res) => {
    const originalImage = req.file.buffer;
    const resizedImages = [];

    for (const dimension of dimensions) {
        const resizedBuffer = await sharp(originalImage)
            .resize(dimension.width, dimension.height)
            .toBuffer();

        const size = (resizedBuffer.length / 1024).toFixed(2); // size in KB
        resizedImages.push({ buffer: resizedBuffer, size, dimension });
    }

    res.send(`
        <h2>Resized Images:</h2>
        ${resizedImages.map(img => `
            <div>
                <h3>${img.dimension.width}x${img.dimension.height} - ${img.size} KB</h3>
                <img src="data:image/png;base64,${img.buffer.toString('base64')}" alt="Resized Image">
            </div>
        `).join('')}
    `);
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
