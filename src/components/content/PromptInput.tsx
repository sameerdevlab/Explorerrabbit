import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import useContentStore from '../../store/contentStore';

interface PromptInputProps {
  minimized?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ minimized = false }) => {
  const { prompt, setPrompt, generateContent, loading } = useContentStore();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateContent();
  };
  
  if (minimized) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full sticky bottom-4 px-4 z-50 mt-10"
      >
        <div className="glowing-wrapper max-w-2xl mx-auto">
          <Card variant="glass" className="p-2">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                variant="glass"
                placeholder="Try another prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                icon={<Search size={16} />}
                className="flex-grow"
              />
              <Button type="submit" variant="sketchy" isLoading={loading}>
                Generate
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
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Generate AI Content</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Enter a prompt, and we'll generate content with images and questions
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  ref={inputRef}
                  variant="glass"
                  placeholder="Enter a topic or question..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  icon={<Search size={18} />}
                  className="w-full p-3 text-lg"
                />
                
                <Button
                  type="submit"
                  variant="sketchy"
                  size="lg"
                  className="w-full"
                  isLoading={loading}
                >
                  {loading ? 'Generating...' : 'Generate Content'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default PromptInput;