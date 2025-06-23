import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export const rateLimit = (
  windowMs: number = 60 * 1000, // 1 minute
  max: number = 10 // 10 requests per window
) => {
  return (req: NextApiRequest, res: NextApiResponse): boolean => {
    // Get client identifier (IP address or fallback)
    const forwarded = req.headers['x-forwarded-for'] as string;
    const ip = forwarded ? forwarded.split(',')[0] : req.socket?.remoteAddress || 'unknown';
    
    const now = Date.now();
    const resetTime = now + windowMs;

    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = { count: 1, resetTime };
      return true;
    }

    store[ip].count++;

    if (store[ip].count > max) {
      res.setHeader('Retry-After', Math.ceil((store[ip].resetTime - now) / 1000));
      res.status(429).json({
        error: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((store[ip].resetTime - now) / 1000)
      });
      return false;
    }

    return true;
  };
};