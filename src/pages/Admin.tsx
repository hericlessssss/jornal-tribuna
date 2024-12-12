import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, FileText, LogOut, Image, Users } from "lucide-react";
import PDFManager from "../components/PDFManager";
import NewsManager from "../components/NewsManager";
import AdsManager from "../components/AdsManager";
import UserManager from "../components/UserManager";
import { useEditionsStore } from "../store/editions";

const Admin = () => {
  const { editions, fetchEditions, addEdition, updateEdition, deleteEdition } = useEditionsStore();
  const [activeTab, setActiveTab] = useState<"news" | "editions" | "ads" | "users">("editions");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEditions();
  }, [fetchEditions]);

  const handlePDFUpload = async (metadata: any) => {
    try {
      await addEdition(metadata);
    } catch (error) {
      console.error("Erro ao fazer upload do PDF:", error);
    }
  };

  const handlePDFDelete = async (id: number) => {
    try {
      await deleteEdition(id);
    } catch (error) {
      console.error("Erro ao deletar a edição:", error);
    }
  };

  const handlePDFEdit = async (id: number, data: Partial<PDFEdition>) => {
    try {
      await updateEdition(id, data);
    } catch (error) {
      console.error("Erro ao editar a edição:", error);
    }
  };

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
              <button
                onClick={() => setActiveTab("users")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "users"
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Users className="w-5 h-5 inline-block mr-2" />
                Gerenciar Usuários
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
            ) : activeTab === "ads" ? (
              <AdsManager />
            ) : (
              <UserManager />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;