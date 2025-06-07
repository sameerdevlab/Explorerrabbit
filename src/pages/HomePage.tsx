import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import ModeToggle from '../components/layout/ModeToggle';
import PromptInput from '../components/content/PromptInput';
import TextInput from '../components/content/TextInput';
import ContentDisplay from '../components/content/ContentDisplay';
import MCQDisplay from '../components/content/MCQDisplay';
import useContentStore from '../store/contentStore';
import useAuthStore from '../store/authStore';

const HomePage: React.FC = () => {
  const { 
    mode, 
    result, 
    clearContent, 
    currentText, 
    currentImages, 
    currentMcqs,
    isGeneratingText,
    isGeneratingImages,
    isGeneratingMcqs,
    isProcessingPastedText,
    loading: contentLoading
  } = useContentStore();
  const { user, loading: authLoading } = useAuthStore();
  const [showResults, setShowResults] = useState(false);
  
  // Redirect to auth page if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }
  
  useEffect(() => {
    // Show results if we have any current content, any generation is in progress, or content is loading
    const hasContent = currentText || currentImages.length > 0 || currentMcqs.length > 0;
    const isGenerating = isGeneratingText || isGeneratingImages || isGeneratingMcqs || isProcessingPastedText;
    
    console.log('🔍 HomePage useEffect - checking conditions:');
    console.log('  - hasContent:', hasContent);
    console.log('  - isGenerating:', isGenerating);
    console.log('  - contentLoading:', contentLoading);
    console.log('  - currentText length:', currentText.length);
    console.log('  - currentImages length:', currentImages.length);
    console.log('  - currentMcqs length:', currentMcqs.length);
    console.log('  - isProcessingPastedText:', isProcessingPastedText);
    
    const shouldShowResults = hasContent || isGenerating || contentLoading;
    console.log('  - shouldShowResults:', shouldShowResults);
    
    setShowResults(shouldShowResults);
  }, [currentText, currentImages, currentMcqs, isGeneratingText, isGeneratingImages, isGeneratingMcqs, isProcessingPastedText, contentLoading]);
  
  const handleNewContent = () => {
    clearContent();
    setShowResults(false);
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600">
            AI Content Generator
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Generate beautiful content with AI or enhance your own text with images and questions.
          </p>
        </div>
        
        <ModeToggle />
        
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {mode === 'generate' ? (
                <PromptInput />
              ) : (
                <TextInput />
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-3/5">
                  <ContentDisplay />
                </div>
                <div className="w-full md:w-2/5">
                  <MCQDisplay />
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={handleNewContent}
                  className="text-purple-600 underline hover:text-purple-800 transition-colors"
                >
                  Start Over
                </button>
              </div>
              
              {/* Minimized input at the bottom */}
              {mode === 'generate' ? (
                <PromptInput minimized />
              ) : (
                <TextInput minimized />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HomePage;