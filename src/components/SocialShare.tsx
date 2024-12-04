import React from 'react';
import { Share2, Facebook, Twitter, Mail, Send, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { getShareableUrl } from '../utils/urlUtils';

interface SocialShareProps {
  title: string;
  url: string;
  image?: string;
  newsId: string | number;
}

const SocialShare: React.FC<SocialShareProps> = ({ title, url, image, newsId }) => {
  const shareableUrl = getShareableUrl(url, newsId);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareableUrl);
  const encodedImage = image ? encodeURIComponent(image) : '';

  // Create meta description from title
  const description = `Confira esta notícia do Jornal Tribuna: ${title}`;
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      url: `https://www.facebook.com/sharer.php?u=${encodedUrl}&quote=${encodedDescription}`,
      color: 'bg-[#1877f2] hover:bg-[#0d65d9]'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      url: `https://twitter.com/intent/tweet?text=${encodedDescription}&url=${encodedUrl}`,
      color: 'bg-[#1da1f2] hover:bg-[#0c85d0]'
    },
    {
      name: 'WhatsApp',
      icon: <Share2 className="w-5 h-5" />,
      url: `https://wa.me/?text=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'bg-[#25d366] hover:bg-[#1da851]'
    },
    {
      name: 'Telegram',
      icon: <Send className="w-5 h-5" />,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedDescription}`,
      color: 'bg-[#0088cc] hover:bg-[#006daa]'
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}${image ? '%0A%0AImagem: ' + encodedImage : ''}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${description}\n\n${shareableUrl}`);
      toast.success('Link copiado para a área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar o link');
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Compartilhar</h3>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} text-white p-2 rounded-full transition-transform hover:scale-110`}
            title={`Compartilhar no ${link.name}`}
            onClick={(e) => {
              if (link.name === 'Email') return; // Allow default behavior for email
              e.preventDefault();
              window.open(link.url, '_blank', 'width=600,height=400');
            }}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full transition-transform hover:scale-110"
          title="Copiar link"
        >
          <Copy className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SocialShare;