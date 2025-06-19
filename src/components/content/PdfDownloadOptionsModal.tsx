import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { SavedContentItem } from '../../types';
import { generateHtmlForAllSavedContent } from '../../lib/utils';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

interface PdfDownloadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedContent: SavedContentItem[];
}

type DownloadOption = 'all' | 'top10' | 'top20' | 'custom';

const PdfDownloadOptionsModal: React.FC<PdfDownloadOptionsModalProps> = ({
  isOpen,
  onClose,
  savedContent,
}) => {
  const [selectedOption, setSelectedOption] = useState<DownloadOption>('all');
  const [customCount, setCustomCount] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const hiddenDivRef = useRef<HTMLDivElement>(null);

  const downloadOptions = [
    {
      value: 'all' as DownloadOption,
      label: 'All Content',
      description: `Download all ${savedContent.length} saved items`,
      icon: '📚',
      count: savedContent.length,
    },
    {
      value: 'top10' as DownloadOption,
      label: 'Top 10',
      description: 'Download the 10 most recent items',
      icon: '🔟',
      count: Math.min(10, savedContent.length),
      disabled: savedContent.length === 0,
    },
    {
      value: 'top20' as DownloadOption,
      label: 'Top 20',
      description: 'Download the 20 most recent items',
      icon: '📊',
      count: Math.min(20, savedContent.length),
      disabled: savedContent.length === 0,
    },
    {
      value: 'custom' as DownloadOption,
      label: 'Custom Amount',
      description: 'Specify how many items to download',
      icon: '⚙️',
      count: null,
    },
  ];

  const getFilteredContent = (): SavedContentItem[] => {
    switch (selectedOption) {
      case 'all':
        return savedContent;
      case 'top10':
        return savedContent.slice(0, 10);
      case 'top20':
        return savedContent.slice(0, 20);
      case 'custom':
        const count = parseInt(customCount);
        if (isNaN(count) || count <= 0) return [];
        return savedContent.slice(0, count);
      default:
        return savedContent;
    }
  };

  const isValidSelection = (): boolean => {
    if (savedContent.length === 0) return false;
    
    if (selectedOption === 'custom') {
      const count = parseInt(customCount);
      return !isNaN(count) && count > 0 && count <= savedContent.length;
    }
    
    return true;
  };

  // Function to wait for all images to load
  const waitForImagesToLoad = (element: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      const images = element.querySelectorAll('img');
      console.log('🖼️ Found', images.length, 'images to load');
      
      if (images.length === 0) {
        console.log('✅ No images to load, proceeding');
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const checkAllLoaded = () => {
        loadedCount++;
        console.log(`🖼️ Image ${loadedCount}/${totalImages} loaded`);
        if (loadedCount === totalImages) {
          console.log('✅ All images loaded, waiting additional 1000ms');
          // Add a longer delay after all images are loaded
          setTimeout(resolve, 1000);
        }
      };

      images.forEach((img, index) => {
        if (img.complete) {
          console.log(`🖼️ Image ${index + 1} already loaded`);
          checkAllLoaded();
        } else {
          img.onload = () => {
            console.log(`🖼️ Image ${index + 1} loaded successfully`);
            checkAllLoaded();
          };
          img.onerror = () => {
            console.log(`❌ Image ${index + 1} failed to load`);
            checkAllLoaded(); // Count failed images as "loaded" to avoid hanging
          };
        }
      });
    });
  };

  const handleDownloadPdf = async () => {
    if (!isValidSelection()) {
      toast.error('Please select a valid download option');
      return;
    }

    const filteredContent = getFilteredContent();
    if (filteredContent.length === 0) {
      toast.error('No content to download');
      return;
    }

    const element = hiddenDivRef.current;
    if (!element) {
      toast.error('PDF generation container not found');
      return;
    }

    console.log('🚀 Starting PDF generation process');
    console.log('📄 Content items to include:', filteredContent.length);

    setIsGeneratingPdf(true);
    const loadingToastId = toast.loading('Preparing your PDF...');

    try {
      // Step 1: Inject content
      console.log('📝 Step 1: Generating HTML content');
      const htmlContent = generateHtmlForAllSavedContent(filteredContent);
      element.innerHTML = htmlContent;
      console.log('✅ HTML content injected, length:', htmlContent.length);

      // Step 2: Style for visibility (with debugging option)
      console.log('👁️ Step 2: Making element visible for rendering');
      
      if (debugMode) {
        // DEBUG MODE: Make visible on screen for inspection
        Object.assign(element.style, {
          display: 'block',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          backgroundColor: '#ffffff',
          zIndex: '9999',
          opacity: '1',
          visibility: 'visible',
          overflow: 'auto', // Changed from 'visible' to 'auto' to enable scrolling
          border: '3px solid red',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          pointerEvents: 'auto', // Enable mouse events for interaction
          padding: '20px', // Add padding for better readability
        });
        
        toast.success('Debug mode: Content is now visible on screen. Check if it looks correct!', { 
          id: loadingToastId,
          duration: 5000 
        });
        
        // Wait longer in debug mode for manual inspection
        console.log('🐛 DEBUG MODE: Element is now visible on screen for 10 seconds');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
      } else {
        // NORMAL MODE: Off-screen but visible to renderer
        Object.assign(element.style, {
          display: 'block',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '800px',
          backgroundColor: '#ffffff',
          zIndex: '9999',
          opacity: '1',
          visibility: 'visible',
          pointerEvents: 'none',
          overflow: 'visible',
        });
      }

      // Step 3: Wait for DOM & Images (increased delays)
      console.log('⏳ Step 3: Waiting for DOM to settle (2000ms)');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('🖼️ Step 4: Waiting for images to load');
      await waitForImagesToLoad(element);
      
      console.log('⏳ Step 5: Final wait before PDF generation (1000ms)');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Generate PDF
      console.log('📄 Step 6: Starting PDF generation');
      toast.loading('Generating PDF...', { id: loadingToastId });
      
      await html2pdf()
        .set({
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `saved-content-${new Date().toISOString().split('T')[0]}.pdf`,
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#fff',
            logging: true, // Enable logging for debugging
            allowTaint: false,
            foreignObjectRendering: true,
          },
          jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait',
          },
          pagebreak: {
            mode: ['css', 'legacy'],
            avoid: ['.avoid-break', 'img'],
          }
        })
        .from(element)
        .save();

      console.log('✅ PDF generation completed successfully');
      toast.success('PDF downloaded successfully!', { id: loadingToastId });
      
      if (!debugMode) {
        onClose();
      }

    } catch (err) {
      console.error('❌ PDF generation error:', err);
      toast.error(`PDF generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`, { 
        id: loadingToastId 
      });
    } finally {
      // Step 5: Reset (unless in debug mode)
      if (!debugMode) {
        console.log('🧹 Step 7: Cleaning up');
        setIsGeneratingPdf(false);
        element.innerHTML = '';
        Object.assign(element.style, {
          display: 'none',
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          opacity: '0',
          zIndex: '-1',
          visibility: 'hidden',
        });
      } else {
        console.log('🐛 DEBUG MODE: Leaving element visible for inspection');
        setIsGeneratingPdf(false);
      }
    }
  };

  const handleCloseModal = () => {
    if (!isGeneratingPdf) {
      // Clean up debug mode if active
      if (debugMode && hiddenDivRef.current) {
        hiddenDivRef.current.innerHTML = '';
        Object.assign(hiddenDivRef.current.style, {
          display: 'none',
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          opacity: '0',
          zIndex: '-1',
          visibility: 'hidden',
        });
      }
      
      onClose();
      // Reset state when modal is closed
      setSelectedOption('all');
      setCustomCount('');
      setDebugMode(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]"
          >
            <Card className="bg-white dark:bg-gray-800 shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Download as PDF
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Choose how many saved content items to include
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Debug Mode Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDebugMode(!debugMode)}
                      disabled={isGeneratingPdf}
                      className={`p-2 rounded-lg transition-colors ${
                        debugMode 
                          ? 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={debugMode ? 'Disable debug mode' : 'Enable debug mode (shows content on screen)'}
                    >
                      {debugMode ? <Eye size={16} /> : <EyeOff size={16} />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseModal}
                      disabled={isGeneratingPdf}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </div>

                {/* Debug Mode Notice */}
                {debugMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <Eye className="h-5 w-5" />
                      <span className="font-semibold">Debug Mode Enabled</span>
                    </div>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                      The content will be displayed on screen for 10 seconds before PDF generation. 
                      You can scroll and inspect the content. Use this to verify everything looks correct.
                    </p>
                  </motion.div>
                )}
                
                {savedContent.length === 0 ? (
                  <motion.div 
                    className="text-center py-12 bg-gradient-to-br from-gray-100 to-red-100 dark:from-gray-900/30 dark:to-red-900/30 rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-6"
                    >
                      <div className="p-6 bg-gradient-to-br from-gray-500 to-red-500 rounded-full shadow-2xl mx-auto w-fit">
                        <AlertCircle className="h-12 w-12 text-white" />
                      </div>
                    </motion.div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      No saved content available to download. Create and save some content first!
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Download Options */}
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Select Download Option
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      
                      {downloadOptions.map((option, index) => (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <label
                            className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedOption === option.value
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md'
                                : option.disabled
                                ? 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-red-300 dark:hover:border-red-600'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-2">
                              <input
                                type="radio"
                                name="downloadOption"
                                value={option.value}
                                checked={selectedOption === option.value}
                                onChange={(e) => setSelectedOption(e.target.value as DownloadOption)}
                                disabled={option.disabled}
                                className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 focus:ring-2"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="text-2xl">{option.icon}</span>
                                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                                    {option.label}
                                  </h4>
                                  {option.count !== null && (
                                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full text-sm font-medium">
                                      {option.count} items
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-7">
                              {option.description}
                            </p>
                          </label>
                        </motion.div>
                      ))}
                    </div>

                    {/* Custom Count Input */}
                    {selectedOption === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                      >
                        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl p-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Number of items to download (max: {savedContent.length})
                          </label>
                          <Input
                            type="number"
                            min="1"
                            max={savedContent.length}
                            value={customCount}
                            onChange={(e) => setCustomCount(e.target.value)}
                            placeholder={`Enter a number between 1 and ${savedContent.length}`}
                            className="w-full"
                          />
                          {customCount && (parseInt(customCount) > savedContent.length || parseInt(customCount) <= 0) && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                              Please enter a number between 1 and {savedContent.length}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Download Button */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCloseModal}
                        variant="outline"
                        className="flex-1"
                        disabled={isGeneratingPdf}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDownloadPdf}
                        disabled={!isValidSelection() || isGeneratingPdf}
                        isLoading={isGeneratingPdf}
                        variant="sketchy"
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-none shadow-lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
                      </Button>
                    </div>

                    {/* Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FileText className="h-4 w-4" />
                        <p>
                          The PDF will include all content, images, quiz questions, and social media posts for the selected items.
                          {debugMode && ' Debug mode will show content on screen first.'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
      
      {/* Hidden div for PDF generation - Positioned off-screen but visible for rendering */}
      <div
        ref={hiddenDivRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '800px',
          backgroundColor: '#ffffff',
          opacity: '0',
          zIndex: '-1',
          pointerEvents: 'none',
          display: 'none',
          visibility: 'hidden',
        }}
      />
    </AnimatePresence>
  );
};

export default PdfDownloadOptionsModal;