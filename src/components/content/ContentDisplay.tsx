import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import useContentStore from '../../store/contentStore';
import { generateInitialPlaceholderImages, PLACEHOLDER_IMAGE_URL } from '../../lib/utils';

const ContentDisplay: React.FC = () => {
  const { currentText, currentImages, mode, isGeneratingText, isGeneratingImages } = useContentStore();

  // Generate blinking lines for text loading
  const renderBlinkingLines = () => {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gray-200 rounded animate-pulse`}
            style={{
              width: `${Math.random() * 40 + 60}%`, // Random width between 60-100%
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1.5s'
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
      <div className="space-y-6">
        {placeholderImages.map((_, index) => (
          <div key={index} className="relative">
            <img
              src={PLACEHOLDER_IMAGE_URL}
              alt="Loading image..."
              className="rounded-lg shadow-lg w-full object-cover max-h-80 opacity-50"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3 shadow-lg">
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Generating image...</span>
              </div>
            </div>
          </div>
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
          <p key={`line-${index}`} className="mb-4">
            {line}
          </p>
        );
      } else {
        content.push(<br key={`br-${index}`} />);
      }
      
      // Check if we should insert an image after this line
      if (imagePositions.has(index)) {
        const image = currentImages.find(img => img.position === index);
        if (image) {
          content.push(
            <div key={`img-${index}`} className="my-6 relative">
              <img
                src={image.url}
                alt={image.alt}
                className="rounded-lg shadow-lg w-full object-cover max-h-80"
                loading="lazy"
              />
              {isGeneratingImages && image.alt === 'Loading image...' && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3 shadow-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Images are getting generated...</span>
                  </div>
                </div>
              )}
            </div>
          );
        }
      }
    });
    
    return (
      <div className="prose prose-slate max-w-none">
        {content}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full h-full flex flex-com min-h-0"
    >
      <div>
        <Card className="h-full flex flex-col bg-white shadow-md min-h-0">
        <CardContent className="flex-grow overflow-y-auto min-h-0">
          <h2 className="text-xl font-semibold mb-4 text-purple-700 sticky top-0 bg-white z-10 pb-2">
            {mode === 'generate' ? 'Generated Content' : 'Your Text with Images'}
          </h2>
          
          {/* Show blinking lines when generating text from scratch */}
          {isGeneratingText && !currentText ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                  <span className="text-gray-600">Generating text content...</span>
                </div>
                {renderBlinkingLines()}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                  <span className="text-gray-600">Preparing images...</span>
                </div>
                {renderPlaceholderImages()}
              </div>
            </div>
          ) : currentText ? (
            /* Show actual content when text is available */
            renderActualContent()
          ) : (
            /* Fallback for edge cases */
            <div className="flex items-center gap-3 p-8 text-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              <span className="text-gray-600">Loading content...</span>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </motion.div>
  );
};

export default ContentDisplay;