import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import ModeToggle from '../components/layout/ModeToggle';
import PromptInput from '../components/content/PromptInput';
import TextInput from '../components/content/TextInput';
import ContentDisplay from '../components/content/ContentDisplay';
import MCQDisplay from '../components/content/MCQDisplay';
import SocialMediaPostGenerator from '../components/content/SocialMediaPostGenerator';
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
    const hasContent = currentText.length > 0 || currentImages.length > 0 || currentMcqs.length > 0;
    const isGenerating = isGeneratingText || isGeneratingImages || isGeneratingMcqs || isProcessingPastedText;
    
    const shouldShowResults = hasContent || isGenerating || contentLoading;
    
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4 flex-grow flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600">
            AI Content Generator
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Generate beautiful content with AI or enhance your own text with images and questions.
          </p>
        </div>
        
        <ModeToggle />
        
        {!showResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {mode === 'generate' ? (
              <PromptInput />
            ) : (
              <TextInput />
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col"
          >
            <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
              {/* Content Display - Left side with independent scrolling */}
              <div className="w-full md:w-1/2 flex flex-col">
                <div className="flex-grow overflow-y-auto">
                  <ContentDisplay />
                </div>
              </div>
              
              {/* MCQ and Social Media Post - Right side with combined scrolling */}
              <div className="w-full md:w-1/2 flex flex-col">
                <div className="flex-grow overflow-y-auto space-y-6">} */}
                  <MCQDisplay />
                  <SocialMediaPostGenerator />
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
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
      </main>
    </div>
  );
};

export default HomePage;