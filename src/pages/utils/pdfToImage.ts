import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function generatePDFThumbnail(pdfUrl: string): Promise<string> {
  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1);

    // Ajuste o scale para garantir a proporção vertical
    const viewport = page.getViewport({ scale: 1.5 }); // Scale maior para detalhes mais nítidos
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    // Define o tamanho do canvas baseado na altura do viewport
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    return canvas.toDataURL();
  } catch (error) {
    console.error('Erro ao gerar miniatura:', error);
    return '';
  }
}
