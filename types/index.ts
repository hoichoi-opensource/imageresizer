export interface Dimension {
  name: string;
  pixels?: number;
  ratio?: string;
  width?: number;
  height?: number;
}

export interface ResizedImage {
  name: string;
  pixels?: number;
  ratio?: string;
  width?: number;
  height?: number;
  buffer: Buffer;
  format: 'webp' | 'avif';
  size: string;
}

export interface UploadResponse {
  original: {
    name: string;
    size: string;
  };
  resized: ResizedImage[];
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export class ImageProcessingError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'ImageProcessingError';
  }
}

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/tiff',
  'image/bmp',
  'image/svg+xml'
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const DEFAULT_QUALITY = 80;