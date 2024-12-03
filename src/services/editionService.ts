import { supabase } from '../lib/supabase';
import { logError } from '../utils/errorHandler';
import { generatePDFThumbnail } from '../utils/pdfUtils';
import { sanitizeFilename, generateThumbnailFilename } from '../utils/fileUtils';

export interface PDFEdition {
  id?: string;
  title: string;
  created_at?: string;
  description: string;
  pdf_url: string;
  cover_image_url?: string;
}

export async function uploadPDFEdition(file: File, metadata: Omit<PDFEdition, 'pdf_url' | 'cover_image_url'>): Promise<PDFEdition> {
  try {
    // 1. Sanitize filename
    const pdfFileName = sanitizeFilename(file.name);
    
    // 2. Upload PDF file to storage
    const { data: pdfData, error: pdfError } = await supabase.storage
      .from('pdf-editions')
      .upload(pdfFileName, file);

    if (pdfError) throw pdfError;

    // 3. Get public URL for the PDF
    const { data: { publicUrl: pdfUrl } } = supabase.storage
      .from('pdf-editions')
      .getPublicUrl(pdfFileName);

    // 4. Generate thumbnail
    const thumbnail = await generatePDFThumbnail(URL.createObjectURL(file));
    
    // 5. Upload thumbnail with sanitized name
    const thumbnailFileName = generateThumbnailFilename(pdfFileName);
    const thumbnailBlob = await (await fetch(thumbnail)).blob();
    
    const { error: thumbError } = await supabase.storage
      .from('pdf-editions')
      .upload(thumbnailFileName, thumbnailBlob);

    if (thumbError) throw thumbError;

    // 6. Get public URL for the thumbnail
    const { data: { publicUrl: coverUrl } } = supabase.storage
      .from('pdf-editions')
      .getPublicUrl(thumbnailFileName);

    // 7. Save edition data to database
    const { data: edition, error: dbError } = await supabase
      .from('pdf_editions')
      .insert([{
        title: metadata.title,
        description: metadata.description,
        pdf_url: pdfUrl,
        cover_image_url: coverUrl,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    return edition;
  } catch (error) {
    logError('EditionService.uploadPDFEdition', error);
    throw error;
  }
}

export async function fetchEditions(): Promise<PDFEdition[]> {
  try {
    const { data, error } = await supabase
      .from('pdf_editions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logError('EditionService.fetchEditions', error);
    throw error;
  }
}

export async function deleteEdition(id: string): Promise<void> {
  try {
    // 1. Get edition data
    const { data: edition, error: fetchError } = await supabase
      .from('pdf_editions')
      .select('pdf_url, cover_image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Delete files from storage
    if (edition) {
      const pdfFileName = edition.pdf_url.split('/').pop();
      const thumbFileName = edition.cover_image_url?.split('/').pop();

      if (pdfFileName) {
        await supabase.storage
          .from('pdf-editions')
          .remove([pdfFileName]);
      }

      if (thumbFileName) {
        await supabase.storage
          .from('pdf-editions')
          .remove([thumbFileName]);
      }
    }

    // 3. Delete database record
    const { error: deleteError } = await supabase
      .from('pdf_editions')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
  } catch (error) {
    logError('EditionService.deleteEdition', error);
    throw error;
  }
}