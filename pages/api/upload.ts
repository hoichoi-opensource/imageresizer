import { T_Resize } from "@/common/types/resize";
import multer from "multer";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

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

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const uploadAndResizeFile = async (req: any, res: any) => {
  upload.single("file")(req as any, res as any, async (err) => {
    try {
      if (err) {
        throw new Error(err.message);
      }

      // Access the uploaded file from req.file
      const originalImage = req.file.buffer;

      const resizedImages = [];
      for (const dimension of dimensions) {
        let resizeOptions: T_Resize = {};

        if (dimension.aspectRatio) {
          resizeOptions.width = dimension.width;
          resizeOptions.height = Math.round(
            dimension.width / dimension.aspectRatio
          );
        } else {
          resizeOptions.width = dimension.width;
          resizeOptions.height = dimension.height;
        }

        const resizedBufferWebp = await sharp(originalImage)
          .webp()
          .resize({
            width: resizeOptions.width,
            height: resizeOptions.height,
            fit: "inside",
          })
          .toBuffer();

        const resizedBufferAvif = await sharp(originalImage)
          .avif()
          .resize({
            width: resizeOptions.width,
            height: resizeOptions.height,
            fit: "inside",
          })
          .toBuffer();

        const sizeWebP = (resizedBufferWebp.length / 1024).toFixed(2); // size in KB
        const sizeAvif = (resizedBufferAvif.length / 1024).toFixed(2); // size in KB
        resizedImages.push({
          buffer: [resizedBufferWebp, resizedBufferAvif],
          sizeWebP,
          sizeAvif,
          dimension: resizeOptions,
        });
      }
      return res.status(200).json(resizedImages);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  req.method === "POST"
    ? uploadAndResizeFile(req, res)
    : res.status(405).json({ error: "Method not allowed." });
}

export type T_Api_Res_ResizedImages = {
  buffer: Buffer[];
  sizeWebP: string;
  sizeAvif: string;
  dimension: T_Resize;
};
