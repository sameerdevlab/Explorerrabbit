import React from 'react';
import { Lightbulb, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import useContentStore from '../../store/contentStore';

const ModeToggle: React.FC = () => {
  const { mode, setMode } = useContentStore();
  
  return (
    <div className="flex justify-center mb-8">
      <div className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-md p-1 rounded-lg flex shadow-lg">
        <button
          className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
            mode === 'generate' ? 'text-purple-900 dark:text-purple-100' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setMode('generate')}
        >
          <Lightbulb size={18} />
          <span>Generate Content</span>
          
          {mode === 'generate' && (
            <motion.div
              className="absolute glowing-wrapper inset-0 bg-white/60 dark:bg-gray/40 rounded-md shadow-sm"
              layoutId="pill"
              initial={false}
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
        </button>
        
        <button
          className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
            mode === 'paste' ? 'text-purple-900 dark:text-purple-100' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setMode('paste')}
        >
          <FileText size={18} />
          <span>Paste Your Own Text</span>
          
          {mode === 'paste' && (
            <motion.div
              className="absolute glowing-wrapper inset-0 bg-white/60 dark:bg-gray/40 rounded-md shadow-sm"
              layoutId="pill"
              initial={false}
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;