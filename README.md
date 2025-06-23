
# Image Resizer

![GitHub stars](https://img.shields.io/github/stars/hoichoi-opensource/imageresizer?style=social)
![GitHub forks](https://img.shields.io/github/forks/hoichoi-opensource/imageresizer?style=social)
![GitHub issues](https://img.shields.io/github/issues/hoichoi-opensource/imageresizer)
![GitHub pull requests](https://img.shields.io/github/issues-pr/hoichoi-opensource/imageresizer)
![GitHub](https://img.shields.io/github/license/hoichoi-opensource/imageresizer)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/hoichoi-opensource/imageresizer)
![GitHub contributors](https://img.shields.io/github/contributors/hoichoi-opensource/imageresizer)
![GitHub last commit](https://img.shields.io/github/last-commit/hoichoi-opensource/imageresizer)
![GitHub top language](https://img.shields.io/github/languages/top/hoichoi-opensource/imageresizer)
![Dependencies](https://img.shields.io/librariesio/github/hoichoi-opensource/imageresizer)
![Code size](https://img.shields.io/github/languages/code-size/hoichoi-opensource/imageresizer)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)


A high-performance Next.js application to upload images, resize them to specified dimensions or aspect ratios, and export them in both `webp` and `avif` formats. Built with TypeScript, React, and Sharp for optimal performance and type safety.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhoichoi-opensource%2Fimageresizer)

## Features

- 🚀 **Fast & Efficient**: Parallel image processing with Sharp
- 🎨 **Multiple Formats**: Export in WebP and AVIF formats
- 📐 **Preset Dimensions**: 6 predefined sizes (Ultra-wide, Wide, Portrait, Fixed, Square, Vertical)
- 🎯 **Customizable**: Select specific dimensions and adjust quality
- 🔒 **Secure**: Input validation, rate limiting, and security headers
- 📱 **Responsive**: Works on all devices
- 🎭 **Preview**: See your image before uploading
- 📊 **Progress Tracking**: Real-time upload progress
- ⚡ **Type Safe**: Built with TypeScript for reliability

## What's New

### Production-Ready Improvements
- ✅ **TypeScript**: Fully typed with no `any` types
- ✅ **Security**: Rate limiting, CORS, input validation
- ✅ **Performance**: Parallel processing, optimized builds
- ✅ **UX**: Progress indicators, error messages, image preview
- ✅ **Features**: Quality control, dimension selection
- ✅ **SEO**: Meta tags and robots.txt

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

## Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/hoichoi-opensource/imageresizer.git
cd imageresizer
```

2. Install the required packages:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` in your browser to access the application.

For production build:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Usage

1. **Select an image**: Click the upload area or drag & drop an image
2. **Configure settings** (optional):
   - Adjust quality (1-100%)
   - Select specific dimensions
3. **Upload**: Click "Upload and Resize"
4. **Download**: Click download buttons for each resized image

### Supported Formats
- Input: JPEG, PNG, WebP, AVIF, TIFF, BMP, SVG
- Output: WebP and AVIF
- Max file size: 50MB

### Available Dimensions
- **Ultra Wide** (2560px @ 32:9)
- **Wide** (1280px @ 16:9)
- **Portrait** (1098px @ 3:4)
- **Fixed** (600×338px)
- **Square** (1080px @ 1:1)
- **Vertical** (1080px @ 9:16)


## Contributing to the Project

We welcome contributions from everyone who is interested in helping to improve this project! Whether it's fixing bugs, adding new features, improving documentation, or spreading the word, your help is appreciated.

Here are some ways you can contribute:

- **Reporting bugs**: If you find a bug, please report it by opening a new issue on GitHub.
- **Suggesting enhancements**: Have an idea to make this project better? Share it with us by opening a new issue for discussion.
- **Submitting changes**: Want to submit a fix or a feature? Great! Fork the repository, make your changes, and submit a pull request.

### Getting Started

1. **Fork the repository**: Click the 'Fork' button at the top right of this page to create your copy of the repository.
2. **Clone your fork**: 
3. **Create your feature branch**: 
4. **Make your changes**: Implement the changes or improvements you propose.
5. **Commit your changes**: 
6. **Push to the branch**: 
7. **Submit a pull request**: Go to your fork on GitHub and click the 'Pull Request' button to send your changes  review.

Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

Checkout the current [issues](https://github.com/hoichoi-opensource/imageresizer/issues) as well to start .

