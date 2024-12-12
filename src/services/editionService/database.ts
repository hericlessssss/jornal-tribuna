import { supabase } from '../../lib/supabase';
import { PDFEdition } from '../../types/editions';
import { StorageError } from '../../utils/errors';

export const createEditionRecord = async (data: Partial<PDFEdition>): Promise<PDFEdition> => {
  try {
    const { data: edition, error } = await supabase
      .from('pdf_editions')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        status: 'active'
      }])
      .select()
      .single();

    if (error) {
      throw new StorageError('Erro ao salvar edição no banco de dados', error);
    }

    return edition;
  } catch (error) {
    console.error('Error creating edition record:', error);
    throw error;
  }
};

export const getEditionById = async (id: number): Promise<PDFEdition | null> => {
  try {
    const { data, error } = await supabase
      .from('pdf_editions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new StorageError('Erro ao buscar edição', error);
    }

    return data;
  } catch (error) {
    console.error('Error fetching edition:', error);
    throw error;
  }
};