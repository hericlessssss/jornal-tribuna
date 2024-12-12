/**
 * Utility functions for handling Google Drive URLs and previews
 */

/**
 * Extract file ID from Google Drive URL
 */
export const extractGoogleDriveFileId = (url: string): string | null => {
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

/**
 * Get preview URL for Google Drive file
 */
export const getGoogleDrivePreviewUrl = (fileId: string): string => {
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

/**
 * Get download URL for Google Drive file
 */
export const getGoogleDriveDownloadUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Get thumbnail URL for Google Drive file
 */
export const getGoogleDriveThumbnailUrl = (fileId: string): string => {
  // Using a larger size for better quality
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
};

/**
 * Validate and format Google Drive URL
 */
export const validateAndFormatGoogleDriveUrl = (url: string): { 
  isValid: boolean;
  previewUrl?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  error?: string;
} => {
  try {
    const urlObj = new URL(url);
    
    if (!urlObj.hostname.includes('drive.google.com')) {
      return { 
        isValid: false, 
        error: 'URL inválida. Use apenas links do Google Drive' 
      };
    }

    const fileId = extractGoogleDriveFileId(url);
    if (!fileId) {
      return { 
        isValid: false, 
        error: 'Não foi possível extrair o ID do arquivo do Google Drive' 
      };
    }

    return {
      isValid: true,
      previewUrl: getGoogleDrivePreviewUrl(fileId),
      downloadUrl: getGoogleDriveDownloadUrl(fileId),
      thumbnailUrl: getGoogleDriveThumbnailUrl(fileId)
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'URL inválida' 
    };
  }
};