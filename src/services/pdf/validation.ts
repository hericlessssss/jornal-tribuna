import { PDFUrlInfo } from './types';

const ALLOWED_DOMAINS = ['drive.google.com', 'docs.google.com'];

export const validatePDFUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ALLOWED_DOMAINS.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
};

export const validateFileId = (fileId: string | null): boolean => {
  return Boolean(fileId && fileId.length > 10);
};

export const validatePDFAccess = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};