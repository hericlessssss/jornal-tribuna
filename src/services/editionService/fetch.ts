import { supabase } from '../../lib/supabase';
import { PDFEdition } from '../../types/editions';
import { StorageError } from '../../utils/errors';

/**
 * Fetches all active PDF editions
 */
export const fetchEditions = async (): Promise<PDFEdition[]> => {
  try {
    const { data, error } = await supabase
      .from('pdf_editions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      throw new StorageError('Erro ao buscar edições', error);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching editions:', error);
    throw error;
  }
};