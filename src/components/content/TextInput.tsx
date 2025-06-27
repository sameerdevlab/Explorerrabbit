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
          <Card variant="glass" className="p-2">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <TextArea
                ref={textareaRef}
                variant="glass"
                placeholder="Paste different text..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="flex-grow h-10 min-h-0 resize-none py-2"
                rows={1}
              />
              <Button type="submit" variant="sketchy" isLoading={loading}>
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
      className="w-full max-w-3xl mx-auto px-4"
    >
      <div className="glowing-wrapper">
        <Card variant="glass" className="overflow-hidden shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Process Your Text</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Paste your own text and we'll generate images and questions from it
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <TextArea
                  ref={textareaRef}
                  variant="glass"
                  placeholder="Paste your text here..."
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full p-3 text-lg min-h-[200px]"
                  rows={8}
                />
                
                <Button
                  type="submit"
                  variant="sketchy"
                  size="lg"
                  className="w-full"
                  isLoading={loading}
                >
                  {loading ? 'Processing...' : 'Process Text'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default TextInput;