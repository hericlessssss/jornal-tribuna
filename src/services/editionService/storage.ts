import { supabase } from '../../lib/supabase';
import { StorageError } from '../../utils/errors';
import { validatePDFFile } from '../../utils/validators';
import { sanitizeFilename } from '../../utils/fileUtils';

export const uploadFileToStorage = async (file: File): Promise<string> => {
  try {
    validatePDFFile(file);
    const fileName = sanitizeFilename(file.name);
    
    const { error: uploadError } = await supabase.storage
      .from('pdf-editions')
      .upload(fileName, file);

    if (uploadError) {
      throw new StorageError('Erro ao fazer upload do arquivo', uploadError);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pdf-editions')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFileFromStorage = async (fileName: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('pdf-editions')
      .remove([fileName]);

    if (error) {
      throw new StorageError('Erro ao excluir arquivo', error);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};