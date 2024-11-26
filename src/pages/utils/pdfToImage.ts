import * as pdfjsLib from 'pdfjs-dist';

// Configuração do worker para o PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Gera uma miniatura de um arquivo PDF.
 * @param {string} pdfUrl - URL do arquivo PDF.
 * @returns {Promise<string>} - Retorna uma URL da miniatura em base64.
 */
export const generatePDFThumbnail = async (pdfUrl: string): Promise<string> => {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const page = await pdf.getPage(1); // Obter a primeira página do PDF
  
  const viewport = page.getViewport({ scale: 1.5 }); // Aumenta o scale para mais detalhes
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Não foi possível obter o contexto 2D do canvas');
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  // Retorna a imagem como uma URL base64
  return canvas.toDataURL('image/png');
};
