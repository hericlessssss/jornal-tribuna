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
      news: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string;
          category: string;
          cover_image_url: string;
          highlighted: boolean;
          homepage_highlight: boolean;
          author: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          excerpt: string;
          category: string;
          cover_image_url: string;
          highlighted?: boolean;
          homepage_highlight?: boolean;
          author: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          excerpt?: string;
          category?: string;
          cover_image_url?: string;
          highlighted?: boolean;
          homepage_highlight?: boolean;
          author?: string;
          created_at?: string;
        };
      };
      news_images: {
        Row: {
          id: string;
          news_id: string;
          image_url: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          news_id: string;
          image_url: string;
          order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          news_id?: string;
          image_url?: string;
          order?: number;
          created_at?: string;
        };
      };
      // ... rest of your tables
    };
  };
}