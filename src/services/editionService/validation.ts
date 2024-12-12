import { ValidationError } from '../../utils/errors';
import { validatePDFLink } from '../../utils/validators';
import { EditionMetadata } from '../../types/editions';

export const validateEditionMetadata = (metadata: EditionMetadata): void => {
  if (!metadata.title?.trim()) {
    throw new ValidationError('O título é obrigatório');
  }
};

export const validateExternalUrl = (url: string): void => {
  if (!url?.trim()) {
    throw new ValidationError('O link do PDF é obrigatório');
  }

  if (!validatePDFLink(url)) {
    throw new ValidationError('O link fornecido não é válido. Use um link direto do Google Drive, Dropbox ou OneDrive');
  }
};

export const validateUploadParams = (file: File | null, metadata: EditionMetadata): void => {
  validateEditionMetadata(metadata);

  // Check if either file or external URL is provided
  const hasFile = file !== null;
  const hasUrl = !!metadata.external_url?.trim();

  if (!hasFile && !hasUrl) {
    throw new ValidationError('É necessário fornecer um arquivo ou link');
  }

  if (hasFile && hasUrl) {
    throw new ValidationError('Forneça apenas um arquivo ou link, não ambos');
  }

  if (hasUrl) {
    validateExternalUrl(metadata.external_url!);
  }
};