import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Free online image resizer tool. Resize images to multiple dimensions and export in WebP and AVIF formats. Fast, secure, and easy to use." />
        <meta name="keywords" content="image resizer, webp converter, avif converter, image optimization, online image tool" />
        <meta name="author" content="hoichoi-opensource" />
        <meta property="og:title" content="Image Resizer - Free Online Image Resizing Tool" />
        <meta property="og:description" content="Resize images to multiple dimensions and export in WebP and AVIF formats." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://imageresizer.vercel.app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}