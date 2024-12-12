import { supabase } from '../lib/supabase';
import { PDFEdition } from '../types/editions';
import { ValidationError } from '../utils/errors';

const formatGoogleDriveUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('drive.google.com')) {
      throw new ValidationError('Use apenas links do Google Drive');
    }

    // Extract file ID from various Google Drive URL formats
    let fileId = '';
    
    // Format: /file/d/[fileId]/view
    const fileMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    }
    
    // Format: /open?id=[fileId]
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    }

    if (!fileId) {
      throw new ValidationError('Link do Google Drive inválido');
    }

    // Return the preview URL format
    return `https://drive.google.com/file/d/${fileId}/preview`;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new ValidationError('URL inválida');
  }
};

export const uploadPDFEdition = async (metadata: {
  title: string;
  description?: string;
  external_url: string;
}): Promise<PDFEdition> => {
  try {
    if (!metadata.title?.trim()) {
      throw new ValidationError('O título é obrigatório');
    }

    if (!metadata.external_url?.trim()) {
      throw new ValidationError('O link do PDF é obrigatório');
    }

    const pdfUrl = formatGoogleDriveUrl(metadata.external_url);

    const { data: edition, error } = await supabase
      .from('pdf_editions')
      .insert([{
        title: metadata.title.trim(),
        description: metadata.description?.trim() || '',
        pdf_url: pdfUrl,
        is_external: true,
        status: 'active',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw new ValidationError('Erro ao salvar edição no banco de dados');
    }

    return edition;
  } catch (error) {
    console.error('Error uploading PDF edition:', error);
    throw error;
  }
};

export const deleteEdition = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('pdf_editions')
      .delete()
      .eq('id', id);

    if (error) throw new ValidationError('Erro ao excluir edição');
  } catch (error) {
    console.error('Error deleting edition:', error);
    throw error;
  }
};

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

    if (error) throw new ValidationError('Erro ao atualizar edição');
    return data;
  } catch (error) {
    console.error('Error updating edition:', error);
    throw error;
  }
};

export const fetchEditions = async (): Promise<PDFEdition[]> => {
  try {
    const { data, error } = await supabase
      .from('pdf_editions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw new ValidationError('Erro ao buscar edições');
    return data || [];
  } catch (error) {
    console.error('Error fetching editions:', error);
    throw error;
  }
};