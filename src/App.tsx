import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import News from "./pages/News";
import Contact from "./pages/Contact";
import PDFEditions from "./pages/PDFEditions";
import Admin from "./pages/Admin";
import NewsDetail from "./pages/NewsDetail";
import RadioPlayer from "./components/RadioPlayer";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/noticias" element={<News />} />
            <Route path="/noticias/:id" element={<NewsDetail />} />
            <Route path="/edicoes" element={<PDFEditions />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <RadioPlayer />
      </div>
    </Router>
  );
}

export default App;
