import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import useContentStore from '../../store/contentStore';
import { generateInitialPlaceholderImages, PLACEHOLDER_IMAGE_URL } from '../../lib/utils';

const ContentDisplay: React.FC = () => {
  const { currentText, currentImages, mode, isGeneratingText, isGeneratingImages } = useContentStore();

  // Generate blinking lines for text loading
  const renderBlinkingLines = () => {
    return (
      <div className="space-y-6">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1, 0.95] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
            className={`h-5 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 dark:from-purple-800 dark:via-pink-800 dark:to-purple-800 rounded-lg shadow-sm`}
            style={{
              width: `${Math.random() * 30 + 70}%`, // Random width between 70-100%
            }}
          />
        ))}
      </div>
    );
  };

  // Generate placeholder images for loading
  const renderPlaceholderImages = () => {
    const placeholderImages = generateInitialPlaceholderImages(3);
    
    return (
      <div className="space-y-8">
        {placeholderImages.map((_, index) => (
          <motion.div 
            key={index} 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200 dark:border-purple-700">
              <img
                src={PLACEHOLDER_IMAGE_URL}
                alt="Loading image..."
                className="w-full object-cover max-h-80 opacity-40 transition-all duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-6 flex items-center gap-4 shadow-2xl border border-white/50 dark:border-gray-700/50"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, -1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600 dark:text-purple-400" />
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Generating magical image...
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render actual content with images
  const renderActualContent = () => {
    if (!currentText) return null;

    // Split the text by newline characters
    const lines = currentText.split('\n');
    
    // Create an array to store the content (text and images)
    const content: JSX.Element[] = [];
    
    // Find image positions
    const imagePositions = new Set(currentImages.map(img => img.position));
    
    // Create the content array with text and images
    lines.forEach((line, index) => {
      // Add the text line
      if (line.trim()) {
        content.push(
          <motion.div
            key={`line-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6"
          >
            <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium tracking-wide">
              {line}
            </p>
          </motion.div>
        );
      } else {
        content.push(<div key={`br-${index}`} className="h-4" />);
      }
      
      // Check if we should insert an image after this line
      if (imagePositions.has(index)) {
        const image = currentImages.find(img => img.position === index);
        if (image) {
          content.push(
            <motion.div 
              key={`img-${index}`} 
              className="my-8 relative group"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-all duration-300">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full object-cover max-h-80 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Image caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium truncate">
                    {image.alt}
                  </p>
                </div>
              </div>
              
              {isGeneratingImages && image.alt === 'Loading image...' && (
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <motion.div 
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-6 flex items-center gap-4 shadow-2xl border border-white/50 dark:border-gray-700/50"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, -1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600 dark:text-purple-400" />
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Images are getting generated...
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          );
        }
      }
    });
    
    return (
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {content}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full h-full"
    >
      <Card className="h-full flex flex-col bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-purple-900/20 dark:to-pink-900/20 shadow-2xl border-2 border-purple-200/50 dark:border-purple-700/50">
        <CardContent className="flex-grow overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 bg-gradient-to-r from-white via-purple-50/50 to-pink-50/50 dark:from-gray-800 dark:via-purple-900/30 dark:to-pink-900/30 z-10 pb-6 mb-6 border-b-2 border-purple-200/50 dark:border-purple-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 dark:from-purple-300 dark:via-pink-400 dark:to-purple-300 bg-clip-text text-transparent">
                {mode === 'generate' ? 'Generated Content' : 'Your Text with Images'}
              </h2>
            </div>
          </motion.div>
          
          {/* Show blinking lines when generating text from scratch */}
          {isGeneratingText && !currentText ? (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-purple-900/30 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                  <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                    Crafting amazing content...
                  </span>
                </div>
                {renderBlinkingLines()}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                    Preparing stunning visuals...
                  </span>
                </div>
                {renderPlaceholderImages()}
              </motion.div>
            </div>
          ) : currentText ? (
            /* Show actual content when text is available */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {renderActualContent()}
            </motion.div>
          ) : (
            /* Fallback for edge cases */
            <motion.div 
              className="flex items-center gap-4 p-12 text-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-purple-200 dark:border-purple-700"
              animate={{ 
                background: [
                  "linear-gradient(45deg, rgb(243 232 255), rgb(252 231 243))",
                  "linear-gradient(45deg, rgb(252 231 243), rgb(243 232 255))"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
              <span className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                Loading magical content...
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentDisplay;