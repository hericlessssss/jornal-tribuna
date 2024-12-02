import React, { useEffect } from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, Users } from 'lucide-react';
import { useVisitorStore } from '../store/visitors';

const Footer = () => {
  const { count, fetchCount, increment } = useVisitorStore();

  useEffect(() => {
    // Fetch initial count
    fetchCount();

    // Increment count only once per session
    const hasIncremented = sessionStorage.getItem('visitorIncremented');
    if (!hasIncremented) {
      increment();
      sessionStorage.setItem('visitorIncremented', 'true');
    }
  }, [fetchCount, increment]);

  return (
    <footer className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Jornal Tribuna</h3>
            <p className="text-white">
              Seu jornal diário com as principais notícias de Unaí e região.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{count.toLocaleString('pt-BR')} visitantes</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>tribuna.unai@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>(38) 99966-4570</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Rua Frei Supriano, nº 214, Bairro Canabrava, Unaí - MG</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-red-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-white hover:text-red-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white text-center">
          <p className="text-white">
            © {new Date().getFullYear()} Jornal Tribuna. Todos os direitos reservados.
          </p>
          <p className="text-white mt-2">
            Desenvolvido por <strong>Labora Design</strong>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;