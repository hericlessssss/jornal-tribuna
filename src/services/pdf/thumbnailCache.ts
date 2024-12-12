import { PDFUrlInfo } from './types';

const CACHE_PREFIX = 'pdf_thumbnail_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  timestamp: number;
  data: PDFUrlInfo;
}

export const getThumbnailFromCache = (url: string): PDFUrlInfo | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${url}`);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    const now = Date.now();

    if (now - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_PREFIX}${url}`);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
};

export const saveThumbnailToCache = (url: string, data: PDFUrlInfo): void => {
  try {
    const entry: CacheEntry = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(`${CACHE_PREFIX}${url}`, JSON.stringify(entry));
  } catch {
    // Ignore cache errors
  }
};

export const clearThumbnailCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore cache errors
  }
};