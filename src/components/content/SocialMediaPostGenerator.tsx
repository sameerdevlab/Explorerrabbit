import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Loader2, CheckCircle, Sparkles, Send, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import ShareModal from '../ui/ShareModal';
import SocialMediaPostTypeModal from './SocialMediaPostTypeModal';
import useContentStore from '../../store/contentStore';
import { SocialMediaPostType, UserLevel } from '../../types';
import toast from 'react-hot-toast';

const SocialMediaPostGenerator: React.FC = () => {
  const { 
    socialMediaPost, 
    isGeneratingSocialMediaPost, 
    generateSocialMediaPost,
    currentText 
  } = useContentStore();
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea to fit the full social media post content
  useEffect(() => {
    if (socialMediaPost && textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight to fit content without scrollbars
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [socialMediaPost]);

  const handleOpenModal = () => {
    if (!currentText.trim()) {
      toast.error('No content available to generate social media post');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSelectPostType = (postType: SocialMediaPostType, userLevel?: UserLevel) => {
    generateSocialMediaPost(postType, userLevel);
  };

  const handleSharePost = () => {
    if (!socialMediaPost) {
      toast.error('No social media post to share');
      return;
    }
    setIsShareModalOpen(true);
  };

  const handleCopy = async () => {
    if (!socialMediaPost) return;
    
    try {
      await navigator.clipboard.writeText(socialMediaPost);
      setCopied(true);
      toast.success('Post copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 dark:from-gray-800 dark:via-pink-900/20 dark:to-purple-900/20 shadow-2xl border-2 border-pink-200/50 dark:border-pink-700/50">
          <CardContent className="p-6">
            <motion.div 
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl shadow-lg">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-700 via-purple-600 to-pink-700 dark:from-pink-300 dark:via-purple-400 dark:to-pink-300 bg-clip-text text-transparent">
                Social Media Post
              </h3>
            </motion.div>
            
            {!socialMediaPost && !isGeneratingSocialMediaPost ? (
              <motion.div 
                className="text-center py-12 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-pink-200 dark:border-pink-700"
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
                  <div className="p-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full shadow-2xl mx-auto w-fit">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                  Transform your content into an engaging social media post
                </p>
                <Button 
                  onClick={handleOpenModal}
                  disabled={!currentText.trim()}
                  variant="sketchy"
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-none shadow-lg text-lg py-3 px-8"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Generate Social Media Post
                </Button>
              </motion.div>
            ) : isGeneratingSocialMediaPost ? (
              <motion.div 
                className="flex items-center gap-4 p-12 text-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-pink-200 dark:border-pink-700"
                animate={{ 
                  background: [
                    "linear-gradient(45deg, rgb(252 231 243), rgb(243 232 255))",
                    "linear-gradient(45deg, rgb(243 232 255), rgb(252 231 243))"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Send className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                </motion.div>
                <span className="text-xl font-semibold text-pink-700 dark:text-pink-300">
                  Crafting your viral post...
                </span>
              </motion.div>
            ) : socialMediaPost ? (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative"
                  >
                    <TextArea
                      ref={textareaRef}
                      value={socialMediaPost}
                      readOnly
                      autoResize={true}
                      className="w-full bg-gradient-to-br from-white to-pink-50/50 dark:from-gray-700 dark:to-pink-900/20 border-2 border-pink-200 dark:border-pink-600 rounded-2xl p-6 text-lg leading-relaxed font-medium shadow-inner focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800 transition-all duration-300"
                      placeholder="Generated social media post will appear here..."
                    />
                    <div className="absolute top-4 right-4 opacity-20">
                      <Share2 className="h-6 w-6 text-pink-500" />
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={handleCopy}
                    variant="sketchy"
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-none shadow-lg"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-white" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Post
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSharePost}
                    variant="sketchy"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none shadow-lg"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Post
                  </Button>
                  
                  <Button
                    onClick={handleOpenModal}
                    variant="sketchy"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-none shadow-lg"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </motion.div>
              </motion.div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>

      {/* Social Media Post Type Selection Modal */}
      <SocialMediaPostTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPostType={handleSelectPostType}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Social Media Post"
        textToShare={socialMediaPost || ''}
      />
    </>
  );
};

export default SocialMediaPostGenerator;