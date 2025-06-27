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
        className="w-full sticky bottom-4 px-4 z-50"
      >
        <div className="glowing-wrapper max-w-2xl mx-auto">
          <Card variant="professional" className="p-3 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                ref={inputRef}
                className="flex-grow input-professional"
                placeholder="Try another prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                icon={<Search size={16} />}
              />
              <Button 
                type="submit" 
                variant="sketchy" 
                isLoading={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200"
              >
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
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent typography-enhanced">
                Generate AI Content
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed typography-enhanced">
                Enter a prompt, and we'll generate comprehensive content with images and interactive elements
              </p>
            </motion.div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Input
                    ref={inputRef}
                    className="w-full p-4 text-lg input-professional"
                    placeholder="Enter a topic or question..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    icon={<Search size={20} />}
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
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200"
                    isLoading={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Content'}
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

export default PromptInput;