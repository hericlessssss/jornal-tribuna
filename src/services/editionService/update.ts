import { supabase } from '../../lib/supabase';
import { PDFEdition } from '../../types/editions';
import { StorageError } from '../../utils/errors';

/**
 * Updates an existing PDF edition
 */
export const updateEdition = async (
  id: number, 
  updates: Partial<PDFEdition>
): Promise<PDFEdition> => {
  try {
    const { data, error } = await supabase
      .from('pdf_editions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new StorageError('Erro ao atualizar edição', error);
    }

    return data;
  } catch (error) {
    console.error('Error updating edition:', error);
    throw error;
  }
};