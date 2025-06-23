import sharp from 'sharp';
import { Dimension, ResizedImage, DEFAULT_QUALITY } from '../types';

export const dimensions: Dimension[] = [
  { name: "Ultra Wide", pixels: 2560, ratio: "32:9" },
  { name: "Wide", pixels: 1280, ratio: "16:9" },
  { name: "Portrait", pixels: 1098, ratio: "3:4" },
  { name: "Fixed", width: 600, height: 338 },
  { name: "Square", pixels: 1080, ratio: "1:1" },
  { name: "Vertical", pixels: 1080, ratio: "9:16" },
];

const getRatioDimensions = (pixels: number, ratio: string): { width: number; height: number } => {
  const [widthRatio, heightRatio] = ratio.split(':').map(Number);
  const aspectRatio = widthRatio / heightRatio;
  
  if (aspectRatio >= 1) {
    return {
      width: pixels,
      height: Math.round(pixels / aspectRatio)
    };
  } else {
    return {
      width: Math.round(pixels * aspectRatio),
      height: pixels
    };
  }
};

export const processImage = async (
  buffer: Buffer,
  dimension: Dimension,
  format: 'webp' | 'avif',
  quality: number = DEFAULT_QUALITY
): Promise<ResizedImage> => {
  let width: number;
  let height: number;

  if (dimension.width && dimension.height) {
    width = dimension.width;
    height = dimension.height;
  } else if (dimension.pixels && dimension.ratio) {
    const dims = getRatioDimensions(dimension.pixels, dimension.ratio);
    width = dims.width;
    height = dims.height;
  } else {
    throw new Error('Invalid dimension configuration');
  }

  const processor = sharp(buffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
      withoutEnlargement: true
    });

  let processedBuffer: Buffer;
  
  if (format === 'webp') {
    processedBuffer = await processor
      .webp({ quality, effort: 4 })
      .toBuffer();
  } else {
    processedBuffer = await processor
      .avif({ quality, effort: 4 })
      .toBuffer();
  }

  const size = (processedBuffer.length / 1024).toFixed(2);

  return {
    ...dimension,
    buffer: processedBuffer,
    format,
    size: size === '0.00' ? '0.01' : size,
    width,
    height
  };
};

export const processAllImages = async (
  buffer: Buffer,
  selectedDimensions?: string[],
  quality: number = DEFAULT_QUALITY
): Promise<ResizedImage[]> => {
  const dimensionsToProcess = selectedDimensions 
    ? dimensions.filter(d => selectedDimensions.includes(d.name))
    : dimensions;

  const processingPromises = dimensionsToProcess.flatMap(dimension => [
    processImage(buffer, dimension, 'webp', quality),
    processImage(buffer, dimension, 'avif', quality)
  ]);

  return Promise.all(processingPromises);
};