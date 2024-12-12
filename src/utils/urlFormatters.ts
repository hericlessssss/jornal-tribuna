/**
 * Formats a Google Drive URL for embedding
 */
export const formatGoogleDriveUrl = (url: string): string => {
  // If it's already an embed/preview URL, return as is
  if (url.includes('/preview')) {
    return url;
  }

  // Extract file ID from various Google Drive URL formats
  let fileId = '';
  
  // Format: /file/d/[fileId]/view
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: /open?id=[fileId]
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch) {
    fileId = idMatch[1];
  }

  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return url;
};

/**
 * Validates and formats a Google Drive URL
 */
export const validateAndFormatGoogleDriveUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('drive.google.com')) {
      return null;
    }
    return formatGoogleDriveUrl(url);
  } catch {
    return null;
  }
};