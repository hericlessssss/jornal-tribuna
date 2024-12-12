export interface PDFMetadata {
  id: number;
  title: string;
  description?: string;
  pdf_url: string;
  created_at: string;
}

export interface PDFUrlInfo {
  isValid: boolean;
  previewUrl?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export interface PDFViewerState {
  loading: boolean;
  error: string | null;
}