import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import axios from "axios";
import { T_Api_Res_ResizedImages } from "./api/upload";
import Link from "next/link";

const Home: NextPage = () => {
  const [file, setFile] = useState<File>();
  const [resizedImages, setResizedImages] =
    useState<T_Api_Res_ResizedImages[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBack = () => {
    setResizedImages(undefined);
  };

  // TODO: Fix typing
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file as any);
    await axios
      .post(`/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setResizedImages(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setFile(undefined);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col h-screen items-center justify-between pt-16 pb-4 bg-black1" >
      {resizedImages ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          
          <p className="text-indigo-600 hover:underline" onClick={handleBack}>
            Back
          </p>
          <h1 className="text-2xl font-semibold">Resized Images</h1>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {resizedImages.map((image) =>
              image.buffer.map((buffer, idx) => (
                <div
                  className="flex flex-col items-center justify-center gap-4"
                  key={idx}
                >
                  <Image
                    src={`data:image/${
                      idx === 0 ? "webp" : "avif"
                    };base64,${Buffer.from(buffer).toString("base64")}`}
                    alt={`${image.dimension.width}x${image.dimension.height}`}
                    width={250}
                    height={250}
                  />
                  <a
                    href={`data:image/${
                      idx === 0 ? "webp" : "avif"
                    };base64,${Buffer.from(buffer).toString("base64")}`}
                    download={`Resized-${Math.round(
                      idx === 0
                        ? Number(image.sizeWebP)
                        : Number(image.sizeAvif)
                    )}-kb`}
                    className="text-blue1 hover:underline"
                  >
                    Download
                  </a>
                  <p className="text-xs text-blue1">
                    Dimensions: {image.dimension.width}x{image.dimension.height}
                  </p>
                  <p className="text-xs text-blue1">
                    Size: {idx === 0 ? image.sizeWebP : image.sizeAvif} KB
                  </p>
                  <p className="text-xs text-blue1">
                    Format: {idx === 0 ? "WebP" : "Avif"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8">
          <h1 className="text-5xl font-bold text-gold1">ImageResizer </h1>
          <h1 className="text-2xl font-semibold text-blue1">Upload an Image</h1>
          <div className="flex flex-col items-center justify-center gap-4 w-[400px]">
            <div className="col-span-full">
              <div className="w-[400px] h-[150px] mt-2 flex justify-center rounded-lg border border-dashed border-gold1 px-6 py-10">
                {!file ? (
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-blue1">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-gold1 font-semibold text-blue1 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 w-32"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-2 text-blue1 ">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-orange1">
                      PNG or JPG.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-1">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-sm"
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue1">
                        {file.name}
                      </div>
                      <div className="text-xs text-blue1">
                        {(file.size / 1e6).toFixed(2)} MB
                      </div>
                      <button
                        className="text-xs text-red-500 hover:underline"
                        onClick={() => setFile(undefined)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="rounded-md bg-gold1 px-3 py-2 text-sm font-semibold text-blue1 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-400 disabled:text-white disabled:cursor-not-allowed"
              disabled={!file || isLoading}
              onClick={handleUpload}
            >
              {isLoading ? `Uploading...` : `Upload and Resize`}
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center text-blue1">
        <p>
          Image Resizer using{" "}
          <a
            href="https://www.npmjs.com/package/sharp"
            target="_blank"
            className="text-indigo-600 hover:underline"
          >
            sharp
          </a>
        </p>
        <p>
          Image Resizer using{" "}
          <a
            href="https://github.com/hoichoi-opensource/imageresizer"
            target="_blank"
            className="text-indigo-600 hover:underline"
          >
            Github
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
