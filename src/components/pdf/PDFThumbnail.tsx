import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { validateGoogleDriveUrl } from '../../services/pdf/googleDrive';

interface PDFThumbnailProps {
  url: string;
  title: string;
  className?: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ url, title, className = '' }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        const result = validateGoogleDriveUrl(url);
        if (result.isValid && result.thumbnail) {
          setImageUrl(result.thumbnail);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    };

    loadThumbnail();
  }, [url]);

  if (error || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-100 ${className}`}>
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-contain"
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
};

export default PDFThumbnail;