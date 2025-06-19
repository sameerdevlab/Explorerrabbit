import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Twitter, Linkedin, Facebook, MessageCircle, Copy, Download, Share2 } from 'lucide-react';
import { Card, CardContent } from './Card';
import Button from './Button';
import toast from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  textToShare: string;
  imageUrlToShare?: string | null;
  showSocialPlatforms?: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  textToShare,
  imageUrlToShare,
  showSocialPlatforms = true,
}) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textToShare);
      toast.success('Text copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleDownloadImage = () => {
    if (!imageUrlToShare) return;
    
    try {
      const link = document.createElement('a');
      link.download = `shared-content-${Date.now()}.png`;
      link.href = imageUrlToShare;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(textToShare + '\n\n' + currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const socialPlatforms = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      onClick: shareToTwitter,
      color: 'bg-black hover:bg-gray-800 text-white',
      description: 'Share on X'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: shareToLinkedIn,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      description: 'Share on LinkedIn'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: shareToFacebook,
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      description: 'Share on Facebook'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      onClick: shareToWhatsApp,
      color: 'bg-green-500 hover:bg-green-600 text-white',
      description: 'Share on WhatsApp'
    }
  ];

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
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto z-[9999]"
          >
            <Card className="bg-white dark:bg-gray-800 shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                      <Share2 className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {title}
                    </h2>
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
                
                {/* Generated Image Display - Show prominently when available and social platforms are hidden */}
                {imageUrlToShare && !showSocialPlatforms && (
                  <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Generated Result
                    </h3>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-lg"
                    >
                      <img
                        src={imageUrlToShare}
                        alt="Generated quiz result"
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </div>
                )}
                
                {/* Social Media Platforms - Only show when showSocialPlatforms is true */}
                {showSocialPlatforms && (
                  <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Share on Social Media
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {socialPlatforms.map((platform, index) => {
                        const IconComponent = platform.icon;
                        
                        return (
                          <motion.button
                            key={platform.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={platform.onClick}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg ${platform.color}`}
                          >
                            <IconComponent className="h-5 w-5" />
                            <span className="font-medium text-sm">{platform.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Additional Actions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Other Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      onClick={handleCopyText}
                      variant="sketchy"
                      className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-none shadow-lg"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </Button>
                    
                    {imageUrlToShare && (
                      <Button
                        onClick={handleDownloadImage}
                        variant="sketchy"
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-none shadow-lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Image
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {showSocialPlatforms ? 'Share your content and inspire others! 🚀' : 'Save and share your quiz results! 📊'}
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

export default ShareModal;