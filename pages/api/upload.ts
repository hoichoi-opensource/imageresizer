import type { NextApiRequest, NextApiResponse } from 'next';
import { upload, runMiddleware, MulterRequest } from '@/lib/upload';
import { processAllImages } from '@/lib/imageProcessor';
import { UploadResponse, ErrorResponse, ImageProcessingError, MAX_FILE_SIZE } from '@/types';
import { rateLimit } from '@/lib/rateLimit';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
};

const handleUpload = async (
  req: MulterRequest,
  res: NextApiResponse<UploadResponse | ErrorResponse>
) => {
  try {
    // Run multer middleware
    await runMiddleware(req, res, upload.single('file'));

    // Validate file exists
    if (!req.file) {
      throw new ImageProcessingError('No file uploaded', 400);
    }

    // Validate file size (double-check)
    if (req.file.size > MAX_FILE_SIZE) {
      throw new ImageProcessingError(
        `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        400
      );
    }

    // Get quality from query params (optional)
    const quality = req.query.quality 
      ? Math.min(100, Math.max(1, parseInt(req.query.quality as string)))
      : undefined;

    // Get selected dimensions from query params (optional)
    const selectedDimensions = req.query.dimensions
      ? (req.query.dimensions as string).split(',')
      : undefined;

    // Process images in parallel
    const resizedImages = await processAllImages(
      req.file.buffer,
      selectedDimensions,
      quality
    );

    // Calculate original file size
    const originalSize = (req.file.size / 1024).toFixed(2);

    // Prepare response
    const response: UploadResponse = {
      original: {
        name: req.file.originalname,
        size: originalSize === '0.00' ? '0.01' : originalSize,
      },
      resized: resizedImages,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Upload error:', error);

    if (error instanceof ImageProcessingError) {
      res.status(error.statusCode).json({
        error: error.message,
      });
    } else if (error instanceof Error) {
      // Handle multer errors
      if (error.message.includes('File too large')) {
        res.status(400).json({
          error: `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        });
      } else if (error.message.includes('Unexpected field')) {
        res.status(400).json({
          error: 'Invalid field name. Expected "file"',
        });
      } else {
        res.status(500).json({
          error: 'Failed to process image',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
      }
    } else {
      res.status(500).json({
        error: 'An unexpected error occurred',
      });
    }
  }
};

const rateLimiter = rateLimit(60 * 1000, 10); // 10 requests per minute

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse | ErrorResponse>
) {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  // Apply rate limiting
  if (!rateLimiter(req, res)) {
    return;
  }

  await handleUpload(req as MulterRequest, res);
}