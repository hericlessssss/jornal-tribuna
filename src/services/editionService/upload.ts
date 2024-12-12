import { EditionMetadata, PDFEdition } from '../../types/editions';
import { ValidationError } from '../../utils/errors';
import { formatExternalUrl } from '../../utils/urlFormatters';
import { validateUploadParams } from './validation';
import { uploadFileToStorage } from './storage';
import { createEditionRecord } from './database';

export const uploadPDFEdition = async (
  file: File | null,
  metadata: EditionMetadata
): Promise<PDFEdition> => {
  try {
    // Validate all parameters first
    validateUploadParams(file, metadata);

    let pdfUrl: string;
    let isExternal = false;

    // Handle external URL
    if (metadata.external_url) {
      pdfUrl = formatExternalUrl(metadata.external_url);
      isExternal = true;
    } 
    // Handle file upload
    else if (file) {
      pdfUrl = await uploadFileToStorage(file);
    } 
    else {
      throw new ValidationError('É necessário fornecer um arquivo ou link');
    }

    // Create the edition record
    const editionData = {
      title: metadata.title.trim(),
      description: metadata.description?.trim() || '',
      pdf_url: pdfUrl,
      is_external: isExternal,
      original_filename: file?.name,
      file_size: file?.size
    };

    return await createEditionRecord(editionData);
  } catch (error) {
    console.error('Error uploading PDF edition:', error);
    throw error;
  }
};