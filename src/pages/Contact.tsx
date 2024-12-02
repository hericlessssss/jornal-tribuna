import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
}

const REASON_OPTIONS = {
  duvidas: 'Dúvidas',
  anuncio: 'Anunciar um negócio/serviço',
  sugestao: 'Sugestão',
  edicoes_anteriores: 'Solicitar edições anteriores',
  outro: 'Outro',
};

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    reason: 'duvidas',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    emailjs.init('aZTMP8lzShFLi68n7');
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToastId = toast.loading('Enviando mensagem...');

    try {
      const templateParams = {
        to_email: 'tribunaunai@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: `[${REASON_OPTIONS[formData.reason as keyof typeof REASON_OPTIONS]}] Nova mensagem do site`,
        message: formData.message,
      };

      await emailjs.send(
        'service_j5nskn9',
        'template_0pyrpkn',
        templateParams
      );

      toast.success('Mensagem enviada com sucesso!', {
        id: loadingToastId,
        duration: 5000,
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        reason: 'duvidas',
        message: '',
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem. Por favor, tente novamente.', {
        id: loadingToastId,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = '5538999664570';
    const message = encodeURIComponent(
      'Olá! Gostaria de mais informações sobre o Jornal Tribuna.'
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Entre em Contato</h1>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Phone className="w-8 h-8 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Telefone</h3>
              <p className="text-gray-600">(38) 99966-4570</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Mail className="w-8 h-8 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">E-mail</h3>
              <p className="text-gray-600">tribunaunai@gmail.com</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <MapPin className="w-8 h-8 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Endereço</h3>
              <p className="text-gray-600">
                Rua Frei Supriano, nº 214, Bairro Canabrava, Unaí - MG
              </p>
            </div>
          </div>

          {/* WhatsApp Button */}
          <div className="text-center mb-12">
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Falar pelo WhatsApp
            </button>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie sua mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo do contato
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {Object.entries(REASON_OPTIONS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
