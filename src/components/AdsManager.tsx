import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash2, Edit, ExternalLink } from 'lucide-react';
import { useAdsStore } from '../store/ads';
import toast from 'react-hot-toast';

interface AdFormData {
  title: string;
  image: File | null;
  redirect_url: string;
}

const AdsManager = () => {
  const { ads, loading, fetchAds, addAd, deleteAd, updateAd } = useAdsStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    image: null,
    redirect_url: '',
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData((prev) => ({ ...prev, image: acceptedFiles[0] }));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    try {
      // Upload da imagem para o Supabase Storage
      const fileExt = formData.image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('ads')
        .upload(fileName, formData.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ads')
        .getPublicUrl(fileName);

      // Criar o anúncio no banco
      await addAd({
        title: formData.title,
        image_url: publicUrl,
        redirect_url: formData.redirect_url,
      });

      toast.success('Anúncio adicionado com sucesso!');
      setIsAdding(false);
      setFormData({ title: '', image: null, redirect_url: '' });
    } catch (error) {
      console.error('Erro ao adicionar anúncio:', error);
      toast.error('Erro ao adicionar anúncio');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este anúncio?')) {
      try {
        await deleteAd(id);
        toast.success('Anúncio excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir anúncio:', error);
        toast.error('Erro ao excluir anúncio');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Anúncios</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Anúncio
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título do Anúncio
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imagem do Anúncio
              </label>
              <div
                {...getRootProps()}
                className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-red-500"
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  {formData.image ? (
                    <p className="text-sm text-gray-600">{formData.image.name}</p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Arraste uma imagem ou clique para selecionar
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL de Redirecionamento
              </label>
              <input
                type="url"
                value={formData.redirect_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, redirect_url: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{ad.title}</h3>
              <a
                href={ad.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Ver destino
              </a>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsManager;
