export interface PDFEdition {
  id: number;
  title: string;
  description: string;
  pdf_url: string;
  cover_image_url?: string;
  is_external: boolean;
  source_type?: string;
  original_filename?: string;
  file_size?: number;
  status: 'active' | 'archived' | 'deleted';
  created_at?: string;
}

export interface EditionMetadata {
  title: string;
  description: string;
  external_url?: string;
}