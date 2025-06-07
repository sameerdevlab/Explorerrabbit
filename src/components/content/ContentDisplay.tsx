import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import useContentStore from '../../store/contentStore';

const ContentDisplay: React.FC = () => {
  const { currentText, currentImages, mode, isGeneratingText, isGeneratingImages } = useContentStore();

  if (!currentText && !isGeneratingText) return null;

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <Card className="overflow-hidden bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            {mode === 'generate' ? 'Generated Content' : 'Your Text with Images'}
          </h2>
          
          {isGeneratingText ? (
            <div className="flex items-center gap-3 p-8 text-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              <span className="text-gray-600">Text is getting generated...</span>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              {content}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ContentDisplay;