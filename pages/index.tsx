import { NextPage } from "next";
import Image from "next/image";
import { useState, useCallback, useEffect, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import { UploadResponse, ResizedImage, ErrorResponse, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/types";
import { dimensions } from "@/lib/imageProcessor";

const Home: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Cleanup preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleBack = () => {
    setUploadResponse(null);
    setError("");
    setUploadProgress(0);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
      setError(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.map(t => t.split('/')[1]).join(', ')}`);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    setError("");
    setFile(selectedFile);
    
    // Create preview
    const preview = URL.createObjectURL(selectedFile);
    setImagePreview(preview);
  };

  const handleDimensionToggle = (dimensionName: string) => {
    setSelectedDimensions(prev => 
      prev.includes(dimensionName)
        ? prev.filter(d => d !== dimensionName)
        : [...prev, dimensionName]
    );
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const params = new URLSearchParams();
      if (quality !== 80) params.append('quality', quality.toString());
      if (selectedDimensions.length > 0) params.append('dimensions', selectedDimensions.join(','));

      const response = await axios.post<UploadResponse>(
        `/api/upload${params.toString() ? `?${params}` : ''}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        }
      );

      setUploadResponse(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Failed to upload image';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setFile(null);
      setIsLoading(false);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview("");
      }
    }
  };

  const renderResizedImage = (image: ResizedImage, index: number) => {
    const imageData = `data:image/${image.format};base64,${Buffer.from(image.buffer).toString("base64")}`;
    const fileName = `resized-${image.name?.replace(/\s+/g, '-').toLowerCase()}-${image.width}x${image.height}.${image.format}`;

    return (
      <div
        className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        key={`${image.name}-${image.format}-${index}`}
      >
        <div className="relative group">
          <Image
            src={imageData}
            alt={`${image.width}x${image.height}`}
            width={250}
            height={250}
            className="rounded-md object-cover"
            style={{ maxHeight: '250px', width: 'auto' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-md" />
        </div>
        
        <div className="text-center space-y-1">
          <p className="font-medium text-gray-700">{image.name}</p>
          <p className="text-sm text-gray-500">
            {image.width} × {image.height} px
            {image.ratio && ` (${image.ratio})`}
          </p>
          <p className="text-sm text-gray-500">
            {image.format.toUpperCase()} • {image.size} KB
          </p>
        </div>

        <a
          href={imageData}
          download={fileName}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
        >
          Download
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {uploadResponse ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
                onClick={handleBack}
              >
                ← Back to Upload
              </button>
              <div className="text-sm text-gray-600">
                Original: {uploadResponse.original.name} ({uploadResponse.original.size} KB)
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 text-center">Resized Images</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {uploadResponse.resized.map((image, idx) => renderResizedImage(image, idx))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Image Resizer</h1>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="relative">
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={ALLOWED_MIME_TYPES.join(',')}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      file ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {!file ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Supports: {ALLOWED_MIME_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Max size: {MAX_FILE_SIZE / 1024 / 1024}MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {imagePreview && (
                          <Image
                            className="h-24 w-24 rounded-md object-cover"
                            src={imagePreview}
                            alt={file.name}
                            width={96}
                            height={96}
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            className="mt-1 text-sm text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.preventDefault();
                              setFile(null);
                              setImagePreview("");
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Advanced Settings */}
              <div>
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  {showSettings ? '▼' : '▶'} Advanced Settings
                </button>
                
                {showSettings && (
                  <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                    {/* Quality Slider */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Dimension Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Dimensions (all if none selected)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {dimensions.map((dim) => (
                          <label
                            key={dim.name}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDimensions.includes(dim.name)}
                              onChange={() => handleDimensionToggle(dim.name)}
                              className="rounded text-indigo-600"
                            />
                            <span>{dim.name}</span>
                            {dim.ratio && <span className="text-gray-500">({dim.ratio})</span>}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Upload Progress */}
              {isLoading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                type="button"
                className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={!file || isLoading}
                onClick={handleUpload}
              >
                {isLoading ? 'Processing Images...' : 'Upload and Resize'}
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 space-y-1">
              <p>
                Powered by{" "}
                <a
                  href="https://www.npmjs.com/package/sharp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Sharp
                </a>
                {" • "}
                <a
                  href="https://github.com/hoichoi-opensource/imageresizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  View on GitHub
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;