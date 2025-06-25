import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Footer from './components/layout/Footer';
import AboutModal from './components/modals/AboutModal';
import TermsModal from './components/modals/TermsModal';
import SupportModal from './components/modals/SupportModal';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

function App() {
  const { initialize, loading, user } = useAuthStore();
  const { theme } = useThemeStore();
  
  // Modal states
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  useEffect(() => {
    // Apply theme to document element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    );
  }
  
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col relative">
          {/* Fixed theme-dependent circular image */}
          <img 
            src={theme === 'dark' ? "/white_circle_360x360.png" : "/black_circle_360x360.png"}
            alt="Bolt.new"
            className="fixed top-2 right-1 w-14 h-14 md:w-20 md:h-20 lg:w-22 lg:h-22 rounded-full object-contain z-[60]"
          />
          
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          
          {/* Footer */}
          <Footer
            onAboutClick={() => setIsAboutModalOpen(true)}
            onTermsClick={() => setIsTermsModalOpen(true)}
            onSupportClick={() => setIsSupportModalOpen(true)}
          />
        </div>
      </BrowserRouter>
      
      {/* Modals */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
      
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
      
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#374151' : '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;