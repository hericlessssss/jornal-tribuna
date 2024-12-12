import { supabase } from '../../lib/supabase';
import { StorageError } from '../../utils/errors';

/**
 * Deletes a PDF edition and its associated file
 */
export const deleteEdition = async (id: number): Promise<void> => {
  try {
    // First, get the edition details
    const { data: edition, error: fetchError } = await supabase
      .from('pdf_editions')
      .select('pdf_url, is_external')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new StorageError('Erro ao buscar detalhes da edição', fetchError);
    }

    if (!edition) {
      throw new StorageError('Edição não encontrada');
    }

    // If it's not an external file, delete from storage
    if (!edition.is_external) {
      const fileName = edition.pdf_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('pdf-editions')
          .remove([fileName]);

        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue with deletion even if file removal fails
        }
      }
    }

    // Delete the database record
    const { error: deleteError } = await supabase
      .from('pdf_editions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new StorageError('Erro ao excluir registro da edição', deleteError);
    }
  } catch (error) {
    console.error('Error deleting edition:', error);
    throw error instanceof StorageError ? error : new StorageError('Erro ao excluir edição', error);
  }
};