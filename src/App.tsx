import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import ScrollToTop from "./components/ScrollToTop";
import WeatherWidget from "./components/WeatherWidget";
import { useVisitorStore } from "./store/visitors";

function App() {
  const { fetchCount, increment } = useVisitorStore();

  useEffect(() => {
    const initVisitorCounter = async () => {
      await fetchCount();
      const lastVisit = localStorage.getItem('lastVisit');
      const now = new Date().toISOString();
      
      // Increment counter if last visit was more than 24 hours ago or never visited
      if (!lastVisit || new Date(lastVisit).getTime() + 24 * 60 * 60 * 1000 < Date.now()) {
        await increment();
        localStorage.setItem('lastVisit', now);
      }
    };

    initVisitorCounter();
  }, [fetchCount, increment]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 5000,
              style: {
                background: '#22c55e',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
              },
            },
          }}
        />

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