/**
 * Google Drive API utilities for PDF handling
 */

const GOOGLE_DRIVE_DOMAINS = ['drive.google.com', 'docs.google.com'];

export const extractFileId = (url: string): string | null => {
  try {
    // Format: /file/d/[fileId]/view
    const fileMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileMatch) return fileMatch[1];
    
    // Format: /open?id=[fileId]
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch) return idMatch[1];
    
    return null;
  } catch {
    return null;
  }
};

export const generateGoogleDriveUrls = (fileId: string) => ({
  preview: `https://drive.google.com/file/d/${fileId}/preview`,
  download: `https://drive.google.com/uc?export=download&id=${fileId}`,
  // Use higher quality thumbnail
  thumbnail: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
});

export const isGoogleDriveUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return GOOGLE_DRIVE_DOMAINS.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
};

export const validateGoogleDriveUrl = (url: string) => {
  if (!isGoogleDriveUrl(url)) {
    return {
      isValid: false,
      error: 'URL inválida. Use apenas links do Google Drive'
    };
  }

  const fileId = extractFileId(url);
  if (!fileId) {
    return {
      isValid: false,
      error: 'Não foi possível extrair o ID do arquivo'
    };
  }

  const urls = generateGoogleDriveUrls(fileId);
  return {
    isValid: true,
    ...urls
  };
};