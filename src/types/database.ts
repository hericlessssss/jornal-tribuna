export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          created_at?: string;
        };
      };
      pdf_editions: {
        Row: {
          id: string;
          title: string;
          date: string;
          description: string;
          pdf_url: string;
          cover_image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          description: string;
          pdf_url: string;
          cover_image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          date?: string;
          description?: string;
          pdf_url?: string;
          cover_image_url?: string;
          created_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          content: string;
          cover_image_url: string;
          highlighted: boolean;
          homepage_highlight: boolean;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          cover_image_url: string;
          highlighted?: boolean;
          homepage_highlight?: boolean;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          cover_image_url?: string;
          highlighted?: boolean;
          homepage_highlight?: boolean;
          category?: string;
          created_at?: string;
        };
      };
      news_images: {
        Row: {
          id: string;
          news_id: string;
          image_url: string;
          order: number;
        };
        Insert: {
          id?: string;
          news_id: string;
          image_url: string;
          order: number;
        };
        Update: {
          id?: string;
          news_id?: string;
          image_url?: string;
          order?: number;
        };
      };
      ads: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          redirect_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_url: string;
          redirect_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image_url?: string;
          redirect_url?: string;
          created_at?: string;
        };
      };
    };
  };
}