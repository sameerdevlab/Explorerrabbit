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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-t-purple-600 border-r-pink-500 border-b-blue-500 border-l-green-500 dark:border-t-purple-400 dark:border-r-pink-400 dark:border-b-blue-400 dark:border-l-green-400"
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto py-8 px-5 lg:px-16 flex-grow flex flex-col">
        {!showResults && (
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 p-2 text-shadow-xl typography-enhanced"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Turn Any Text Into a Complete Learning Experience
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mt-6 text-slate-700 font-semibold dark:text-slate-200 max-w-3xl mx-auto leading-relaxed typography-enhanced"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Learn, test, and share — from any prompt or paragraph. Transform your ideas into comprehensive educational content with AI-powered insights.
            </motion.p>
          </motion.div>
        )}
        
        <ModeToggle />
        
        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
            transition={{ duration: 0.5 }}
            className="flex-grow flex flex-col"
          >
            <div className="flex flex-col md:flex-row gap-8 flex-grow">
              {/* Content Display - Left side with independent scrolling */}
              <div className="w-full md:w-1/2 flex flex-col">
                  <ContentDisplay />
              </div>
              
              {/* MCQ and Social Media Post - Right side with sticky positioning */}
              <div className="sticky top-[104px] w-full md:w-1/2 flex flex-col h-[calc(100vh-136px)] z-10">
                <div className="flex-grow overflow-y-auto space-y-8 pb-20">
                  <MCQDisplay />
                  <SocialMediaPostGenerator />
                </div>
              </div>
            </div>
            
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-6 mb-6">
                {user && (
                  <Button
                    onClick={saveContent}
                    isLoading={isSaving}
                    variant="sketchy"
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Content'}
                  </Button>
                )}
                
                <Button
                  onClick={handleNewContent}
                  variant="sketchy"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Start Over
                </Button>
              </div>
            </motion.div>
            
            {/* Minimized input at the bottom */}
            {mode === 'generate' ? (
              <PromptInput minimized />
            ) : (
              <TextInput minimized />
            )}
          </motion.div>
        )}

        <div className={`${mode === 'generate' ? "mt-24" : "mt-16"}`}>
          {/* Feature Highlights - Only show when not displaying results */}
          {!showResults && <FeatureHighlights />}
        </div>
        
      </main>
    </div>
  );
};

export default HomePage;