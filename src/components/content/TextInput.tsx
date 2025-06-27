import React, { useRef } from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import useContentStore from '../../store/contentStore';

interface TextInputProps {
  minimized?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ minimized = false }) => {
  const { pastedText, setPastedText, processExistingText, loading } = useContentStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 TextInput handleSubmit called');
    console.log('📝 pastedText value:', pastedText);
    console.log('📏 pastedText length:', pastedText.length);
    console.log('🧹 pastedText trimmed:', pastedText.trim());
    console.log('📏 pastedText trimmed length:', pastedText.trim().length);
    processExistingText();
  };
  
  if (minimized) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full sticky bottom-4 px-4 z-50"
      >
        <div className="glowing-wrapper max-w-2xl mx-auto">
          <Card variant="professional" className="p-3 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <TextArea
                ref={textareaRef}
                className="flex-grow h-12 min-h-0 resize-none py-3 input-professional"
                placeholder="Paste different text..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={1}
              />
              <Button 
                type="submit" 
                variant="sketchy" 
                isLoading={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Process
              </Button>
            </form>
          </Card>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="glowing-wrapper">
        <Card variant="professional" className="overflow-hidden shadow-2xl">
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent typography-enhanced">
                Process Your Text
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed typography-enhanced">
                Paste your own text and we'll enhance it with relevant images and interactive quiz questions
              </p>
            </motion.div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <TextArea
                    ref={textareaRef}
                    className="w-full p-4 text-lg min-h-[240px] input-professional"
                    placeholder="Paste your text here..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    rows={10}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    type="submit"
                    variant="sketchy"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200"
                    isLoading={loading}
                  >
                    {loading ? 'Processing...' : 'Process Text'}
                  </Button>
                </motion.div>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default TextInput;