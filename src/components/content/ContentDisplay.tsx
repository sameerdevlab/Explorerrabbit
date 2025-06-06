import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import useContentStore from '../../store/contentStore';

const ContentDisplay: React.FC = () => {
  const { result, mode } = useContentStore();

  if (!result) return null;

  // Split the text by newline characters
  const lines = result.text.split('\n');
  
  // Create an array to store the content (text and images)
  const content: JSX.Element[] = [];
  
  // Find image positions
  const imagePositions = new Set(result.images.map(img => img.position));
  
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
      const image = result.images.find(img => img.position === index);
      if (image) {
        content.push(
          <div key={`img-${index}`} className="my-6">
            <img
              src={image.url}
              alt={image.alt}
              className="rounded-lg shadow-lg w-full object-cover max-h-80"
              loading="lazy"
            />
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
          <div className="prose prose-slate max-w-none">
            {content}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContentDisplay;