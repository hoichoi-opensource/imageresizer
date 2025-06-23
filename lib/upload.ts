import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, ImageProcessingError } from '../types';

export interface MulterRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

const storage = multer.memoryStorage();

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ImageProcessingError(
      `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.map(t => t.split('/')[1]).join(', ')}`,
      400
    ));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  }
});

export const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};