import { ValidationError } from './errors';

/**
 * Validates a PDF file
 */
export const validatePDFFile = (file: File): void => {
  if (!file) {
    throw new ValidationError('Nenhum arquivo selecionado');
  }

  if (file.type !== 'application/pdf') {
    throw new ValidationError('O arquivo deve ser um PDF');
  }

  // 25MB in bytes
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new ValidationError('O arquivo não pode ser maior que 25MB');
  }
};

/**
 * Validates if a given URL is a valid PDF link
 */
export const validatePDFLink = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    
    // Check if URL is valid
    if (!urlObj.protocol || !urlObj.host) {
      return false;
    }

    // Check for common PDF hosting services
    const validHosts = [
      'drive.google.com',
      'docs.google.com',
      'dropbox.com',
      'www.dropbox.com',
      'onedrive.live.com',
      'storage.googleapis.com',
      's3.amazonaws.com'
    ];

    // Check if it's a direct PDF link or from a valid host
    return url.toLowerCase().endsWith('.pdf') || 
           validHosts.some(host => urlObj.hostname.includes(host));
  } catch {
    return false;
  }
};