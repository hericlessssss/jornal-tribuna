/**
 * Sanitizes a filename by removing special characters and spaces
 * @param filename Original filename
 * @returns Sanitized filename
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove special characters and replace spaces with hyphens
  const sanitized = filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9.-]/g, '-') // Replace special chars with hyphen
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .toLowerCase();

  // Get file extension
  const ext = sanitized.split('.').pop();
  
  // Generate timestamp
  const timestamp = Date.now();
  
  // Create new filename with timestamp
  return `${timestamp}-${sanitized}`;
};

/**
 * Generates a thumbnail filename from a PDF filename
 * @param pdfFilename Original PDF filename
 * @returns Thumbnail filename
 */
export const generateThumbnailFilename = (pdfFilename: string): string => {
  return pdfFilename.replace('.pdf', '-thumb.png');
};