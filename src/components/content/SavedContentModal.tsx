import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Calendar, Loader2, Bookmark } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import useContentStore from '../../store/contentStore';
import { SavedContentItem } from '../../types';

interface SavedContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedContentModal: React.FC<SavedContentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { savedContent, isLoadingSavedContent, loadSavedContent, loadSavedContentItem } = useContentStore();

  React.useEffect(() => {
    if (isOpen) {
      loadSavedContent();
    }
  }, [isOpen, loadSavedContent]);

  const handleLoadContent = (item: SavedContentItem) => {
    loadSavedContentItem(item);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]"
          >
            <Card className="bg-white dark:bg-gray-800 shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <Bookmark className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Saved Content
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Your previously generated content
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X size={20} />
                  </Button>
                </div>
                
                {/* Content */}
                {isLoadingSavedContent ? (
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
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </motion.div>
                    <span className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                      Loading your saved content...
                    </span>
                  </motion.div>
                ) : savedContent.length === 0 ? (
                  <motion.div 
                    className="text-center py-12 bg-gradient-to-br from-gray-100 to-purple-100 dark:from-gray-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-gray-200 dark:border-gray-700"
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
                      <div className="p-6 bg-gradient-to-br from-gray-500 to-purple-500 rounded-full shadow-2xl mx-auto w-fit">
                        <Bookmark className="h-12 w-12 text-white" />
                      </div>
                    </motion.div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      No saved content yet. Generate some content and save it to see it here!
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedContent.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 border-gray-200 dark:border-gray-600 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20"
                          onClick={() => handleLoadContent(item)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700">
                                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate">
                                  {item.title}
                                </h3>
                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(item.created_at)}</span>
                                  </div>
                                  <div className="flex gap-2 text-xs">
                                    {item.generated_images.length > 0 && (
                                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                        {item.generated_images.length} images
                                      </span>
                                    )}
                                    {item.generated_mcqs.length > 0 && (
                                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                        {item.generated_mcqs.length} MCQs
                                      </span>
                                    )}
                                    {item.generated_social_media_post && (
                                      <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-1 rounded">
                                        Social Post
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                  {item.generated_text.substring(0, 100)}...
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Click on any saved content to load it back into the editor
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SavedContentModal;