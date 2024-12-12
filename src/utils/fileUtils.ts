/**
 * Validates a PDF file
 */
export const validatePDFFile = (file: File): void => {
  // Check file type
  if (file.type !== 'application/pdf') {
    throw new Error('O arquivo deve ser um PDF');
  }

  // Check file size (25MB in bytes)
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('O arquivo não pode ser maior que 25MB');
  }
};

/**
 * Sanitizes a filename by removing special characters and spaces
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove special characters and replace spaces with hyphens
  const sanitized = filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9.-]/g, '-') // Replace special chars with hyphen
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .toLowerCase();

  // Generate timestamp
  const timestamp = Date.now();
  
  // Create new filename with timestamp
  return `${timestamp}-${sanitized}`;
};