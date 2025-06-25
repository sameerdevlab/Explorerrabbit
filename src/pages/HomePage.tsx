import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Save, RotateCcw } from 'lucide-react';
import Header from '../components/layout/Header';
import ModeToggle from '../components/layout/ModeToggle';
import FeatureHighlights from '../components/layout/FeatureHighlights';
import PromptInput from '../components/content/PromptInput';
import TextInput from '../components/content/TextInput';
import ContentDisplay from '../components/content/ContentDisplay';
import MCQDisplay from '../components/content/MCQDisplay';
import SocialMediaPostGenerator from '../components/content/SocialMediaPostGenerator';
import Button from '../components/ui/Button';
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
    loading: contentLoading,
    saveContent,
    isSaving,
    loadCurrentContentFromLocalStorage,
    clearCurrentContentFromLocalStorage
  } = useContentStore();
  const { user, loading: authLoading } = useAuthStore();
  const [showResults, setShowResults] = useState(false);
  
  // Initialize localStorage persistence on component mount
  useEffect(() => {
    // Use sessionStorage to track if this is a new browser session
    const isNewSession = !sessionStorage.getItem('session_active');
    
    if (isNewSession) {
      // New browser session - clear any old temporary content
      clearCurrentContentFromLocalStorage();
      console.log('🆕 New browser session detected - cleared old temporary content');
      
      // Mark this session as active
      sessionStorage.setItem('session_active', 'true');
    } else {
      // Existing session (refresh) - load temporary content
      loadCurrentContentFromLocalStorage();
      console.log('🔄 Page refresh detected - loading temporary content');
    }
  }, [loadCurrentContentFromLocalStorage, clearCurrentContentFromLocalStorage]);
  
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto py-8 px-5 lg:px-16 flex-grow flex flex-col">
        {!showResults && <div className="mb-6 text-center">
          <h1 className="text-6xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400">
            Turn Any Text Into a Complete Learning Experience
          </h1>
          <p className="text-lg mt-2 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Learn, test, and share — from any prompt or paragraph.
          </p>
        </div>}
        
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
            <div className="flex flex-col md:flex-row gap-6 flex-grow">
              {/* Content Display - Left side with independent scrolling */}
              <div className="w-full md:w-1/2 flex flex-col">
                  <ContentDisplay />
              </div>
              
              {/* MCQ and Social Media Post - Right side with sticky positioning */}
              <div className="sticky top-[104px] w-full md:w-1/2 flex flex-col h-[calc(100vh-136px)] z-10">
                <div className="flex-grow overflow-y-auto space-y-6 pb-20">
                  <MCQDisplay />
                  <SocialMediaPostGenerator />
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                {user && (
                  <Button
                    onClick={saveContent}
                    isLoading={isSaving}
                    variant="sketchy"
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-none shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Content'}
                  </Button>
                )}
                
                <Button
                  onClick={handleNewContent}
                  variant="sketchy"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none shadow-lg"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              </div>
            </div>
            
            {/* Minimized input at the bottom */}
            {mode === 'generate' ? (
              <PromptInput minimized />
            ) : (
              <TextInput minimized />
            )}
          </motion.div>
        )}
        

            {/* Feature Highlights - Only show when not displaying results */}
            {!showResults && <FeatureHighlights />}
      </main>
    </div>
  );
};

export default HomePage;