import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo e Menu Toggle no Mobile */}
          <div className="flex items-center space-x-4 md:space-x-0">
            {/* Menu Mobile Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-900 hover:text-red-600 focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <Link to="/">
              <img
                src="https://i.imgur.com/3kz3bWp.png"
                alt="Logo Jornal Tribuna"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-900 hover:text-red-600 text-sm font-medium transition-colors"
            >
              Início
            </Link>
            <Link
              to="/noticias"
              className="text-gray-900 hover:text-red-600 text-sm font-medium transition-colors"
            >
              Últimas Notícias
            </Link>
            <Link
              to="/edicoes"
              className="text-gray-900 hover:text-red-600 text-sm font-medium transition-colors"
            >
              Edições PDF
            </Link>
            <Link
              to="/contato"
              className="text-gray-900 hover:text-red-600 text-sm font-medium transition-colors"
            >
              Contato
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link
              to="/"
              className="text-gray-900 hover:text-red-600 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/noticias"
              className="text-gray-900 hover:text-red-600 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Últimas Notícias
            </Link>
            <Link
              to="/edicoes"
              className="text-gray-900 hover:text-red-600 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Edições PDF
            </Link>
            <Link
              to="/contato"
              className="text-gray-900 hover:text-red-600 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
