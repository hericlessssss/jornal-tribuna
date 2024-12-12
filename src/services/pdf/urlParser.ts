import { PDFUrlInfo } from './types';
import { validatePDFUrl, validateFileId } from './validation';
import { getThumbnailFromCache, saveThumbnailToCache } from './thumbnailCache';

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

export const generateUrls = (fileId: string) => ({
  preview: `https://drive.google.com/file/d/${fileId}/preview`,
  download: `https://drive.google.com/uc?export=download&id=${fileId}`,
  thumbnail: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
});

export const parsePDFUrl = (url: string): PDFUrlInfo => {
  try {
    // Check cache first
    const cached = getThumbnailFromCache(url);
    if (cached) return cached;

    if (!validatePDFUrl(url)) {
      return { 
        isValid: false, 
        error: 'URL inválida. Use apenas links do Google Drive' 
      };
    }

    const fileId = extractFileId(url);
    if (!validateFileId(fileId)) {
      return { 
        isValid: false, 
        error: 'ID do arquivo inválido ou não encontrado' 
      };
    }

    const urls = generateUrls(fileId);
    const result = {
      isValid: true,
      ...urls
    };

    // Save to cache
    saveThumbnailToCache(url, result);

    return result;
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Erro ao processar URL' 
    };
  }
};