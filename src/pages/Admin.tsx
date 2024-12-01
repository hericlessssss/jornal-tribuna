import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, FileText, LogOut, Image } from "lucide-react";
import PDFManager from "../components/PDFManager";
import NewsManager from "../components/NewsManager";
import AdsManager from "../components/AdsManager";
import { useEditionsStore } from "../store/editions";

const Admin = () => {
  const { editions, fetchEditions, addEdition, updateEdition, deleteEdition } = useEditionsStore();
  const [activeTab, setActiveTab] = useState<"news" | "editions" | "ads">("editions");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEditions(); // Carregar edições do Supabase ao montar o componente
  }, [fetchEditions]);

  // Gerenciar upload de PDFs
  const handlePDFUpload = async (file: File, metadata: any) => {
    try {
      const newEdition = {
        title: metadata.title,
        date: metadata.date,
        description: metadata.description,
      };

      await addEdition(newEdition, file); // Adicionar nova edição ao Supabase
    } catch (error) {
      console.error("Erro ao fazer upload do PDF:", error);
    }
  };

  // Excluir uma edição
  const handlePDFDelete = async (id: number) => {
    try {
      await deleteEdition(id); // Deletar edição do banco de dados e storage
    } catch (error) {
      console.error("Erro ao deletar a edição:", error);
    }
  };

  // Editar uma edição
  const handlePDFEdit = async (id: number, data: Partial<PDFEdition>) => {
    try {
      await updateEdition(id, data); // Atualizar dados da edição no Supabase
    } catch (error) {
      console.error("Erro ao editar a edição:", error);
    }
  };

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 flex justify-between items-center">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("editions")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "editions"
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5 inline-block mr-2" />
                Gerenciar Edições
              </button>
              <button
                onClick={() => setActiveTab("news")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "news"
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Newspaper className="w-5 h-5 inline-block mr-2" />
                Gerenciar Notícias
              </button>
              <button
                onClick={() => setActiveTab("ads")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "ads"
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Image className="w-5 h-5 inline-block mr-2" />
                Gerenciar Anúncios
              </button>
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors px-4 py-2"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>

          <div className="p-6">
            {activeTab === "editions" ? (
              <PDFManager
                editions={editions}
                onDelete={handlePDFDelete}
                onEdit={handlePDFEdit}
                onUpload={handlePDFUpload}
              />
            ) : activeTab === "news" ? (
              <NewsManager />
            ) : (
              <AdsManager />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
