const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 1337;

// Set up multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Dimensions to resize to
const dimensions = [
  { width: 2560, aspectRatio: 32 / 9 },
  { width: 1280, aspectRatio: 16 / 9 },
  { width: 1098, aspectRatio: 3 / 4 },
  { width: 600, height: 338 },
  { width: 1080, aspectRatio: 1 / 1 },
  { width: 1080, aspectRatio: 9 / 16 },
];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload", upload.single("image"), async (req, res) => {
  const originalImage = req.file.buffer;
  const resizedImages = [];

  for (const dimension of dimensions) {
    let resizeOptions = {};

    if (dimension.aspectRatio) {
      resizeOptions.width = dimension.width;
      resizeOptions.height = Math.round(
        dimension.width / dimension.aspectRatio
      );
    } else {
      resizeOptions.width = dimension.width;
      resizeOptions.height = dimension.height;
    }

    const resizedBuffer = await sharp(originalImage)
      .resize({
        width: resizeOptions.width,
        height: resizeOptions.height,
        fit: "fill",
      })
      .toBuffer();

    const size = (resizedBuffer.length / 1024).toFixed(2); // size in KB
    resizedImages.push({
      buffer: resizedBuffer,
      size,
      dimension: resizeOptions,
    });
  }

  res.send(`
        <h2>Resized Images:</h2>
        ${resizedImages
          .map(
            (img) => `
            <div>
                <h3>${img.dimension.width}x${img.dimension.height} - ${
              img.size
            } KB</h3>
                <img src="data:image/png;base64,${img.buffer.toString(
                  "base64"
                )}" alt="Resized Image">
            </div>
        `
          )
          .join("")}
    `);
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
