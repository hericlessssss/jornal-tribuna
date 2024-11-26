import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, FileText, LogOut } from "lucide-react";
import PDFManager from "../components/PDFManager";
import NewsManager from "../components/NewsManager";
import { generatePDFThumbnail } from "./utils/pdfToImage";

interface PDFEdition {
  id: number;
  title: string;
  date: string;
  description: string;
  pdfUrl: string;
  cover: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"news" | "editions">("editions");
  const [editions, setEditions] = useState<PDFEdition[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar edições mock para exibição inicial
    const loadEditions = async () => {
      const mockEditions = [
        {
          id: 1,
          title: "Edição 482",
          date: "2024-03-15",
          description: "Edição de Março 2024",
          pdfUrl: "/pdfs/EDICAO482.pdf",
          cover: "",
        },
        // Adicione mais edições mock conforme necessário
      ];

      // Gerar miniaturas para as edições
      const editionsWithCovers = await Promise.all(
        mockEditions.map(async (edition) => ({
          ...edition,
          cover: await generatePDFThumbnail(edition.pdfUrl),
        }))
      );

      setEditions(editionsWithCovers);
    };

    loadEditions();
  }, []);

  // Gerenciar upload de PDFs
  const handlePDFUpload = async (file: File, metadata: any) => {
    const fileUrl = URL.createObjectURL(file); // Simula upload com URL local
    const newEdition: PDFEdition = {
      id: Date.now(),
      title: metadata.title,
      date: metadata.date,
      description: metadata.description,
      pdfUrl: fileUrl,
      cover: await generatePDFThumbnail(fileUrl),
    };

    setEditions((prev) => [newEdition, ...prev]);
  };

  // Excluir uma edição
  const handlePDFDelete = (id: number) => {
    setEditions((prev) => prev.filter((edition) => edition.id !== id));
  };

  // Editar uma edição
  const handlePDFEdit = (id: number, data: Partial<PDFEdition>) => {
    setEditions((prev) =>
      prev.map((edition) =>
        edition.id === id ? { ...edition, ...data } : edition
      )
    );
  };

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Remove autenticação
    navigate("/login"); // Redireciona para a tela de login
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cabeçalho com tabs e botão de logout */}
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
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors px-4 py-2"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>

          {/* Conteúdo da aba ativa */}
          <div className="p-6">
            {activeTab === "editions" ? (
              <PDFManager
                editions={editions}
                onDelete={handlePDFDelete}
                onEdit={handlePDFEdit}
                onUpload={handlePDFUpload}
              />
            ) : (
              <NewsManager />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
