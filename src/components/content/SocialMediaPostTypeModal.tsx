import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, List, Heart, TrendingUp, User, Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { SocialMediaPostType } from '../../types';

interface SocialMediaPostTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPostType: (postType: SocialMediaPostType) => void;
}

const postTypes = [
  {
    type: 'informative-summary' as SocialMediaPostType,
    title: 'Informative Summary Post',
    description: 'Professional, clear summary with key facts and insights',
    icon: FileText,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700',
  },
  {
    type: 'tips-carousel' as SocialMediaPostType,
    title: 'Tips or Steps Carousel Post',
    description: 'Actionable steps broken down for carousel format',
    icon: List,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-700',
  },
  {
    type: 'motivational-quote' as SocialMediaPostType,
    title: 'Motivational Quote + Hook',
    description: 'Inspiring message with emotional hook and powerful quote',
    icon: Heart,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    borderColor: 'border-pink-200 dark:border-pink-700',
  },
  {
    type: 'stats-based' as SocialMediaPostType,
    title: 'Did You Know? / Stats-Based Post',
    description: 'Data-driven content with surprising facts and statistics',
    icon: TrendingUp,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-700',
  },
  {
    type: 'personal-journey' as SocialMediaPostType,
    title: 'Personal Journey Style Post',
    description: 'Relatable story with personal reflection and encouragement',
    icon: User,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700',
  },
  {
    type: 'experimental-remix' as SocialMediaPostType,
    title: 'Experimental / AI Remix Post',
    description: 'Creative, Gen Z-friendly style with humor and modern flair',
    icon: Zap,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-700',
  },
];

const SocialMediaPostTypeModal: React.FC<SocialMediaPostTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectPostType,
}) => {
  const handleSelectPostType = (postType: SocialMediaPostType) => {
    onSelectPostType(postType);
    onClose();
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
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      Choose Your Post Style
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Select the type of social media post you'd like to generate
                    </p>
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
                
                {/* Post Type Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {postTypes.map((postType, index) => {
                    const IconComponent = postType.icon;
                    
                    return (
                      <motion.div
                        key={postType.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 ${postType.borderColor} ${postType.bgColor}`}
                          onClick={() => handleSelectPostType(postType.type)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${postType.bgColor} border ${postType.borderColor}`}>
                                <IconComponent className={`h-5 w-5 ${postType.color}`} />
                              </div>
                              <div className="flex-1">
                                <h3 className={`font-semibold text-gray-800 dark:text-gray-200 mb-1`}>
                                  {postType.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {postType.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Each style is optimized for different social media platforms and audiences
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

export default SocialMediaPostTypeModal;