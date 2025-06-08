import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import useContentStore from '../../store/contentStore';
import toast from 'react-hot-toast';

const SocialMediaPostGenerator: React.FC = () => {
  const { 
    socialMediaPost, 
    isGeneratingSocialMediaPost, 
    generateSocialMediaPost,
    currentText 
  } = useContentStore();
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!currentText.trim()) {
      toast.error('No content available to generate social media post');
      return;
    }
    generateSocialMediaPost();
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
              Social Media Post
            </h3>
          </div>
          
          {!socialMediaPost && !isGeneratingSocialMediaPost ? (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Generate an engaging social media post based on your content
              </p>
              <Button 
                onClick={handleGenerate}
                disabled={!currentText.trim()}
                className="w-full sm:w-auto"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Generate Social Media Post
              </Button>
            </div>
          ) : isGeneratingSocialMediaPost ? (
            <div className="flex items-center gap-3 p-6 text-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600 dark:text-purple-400" />
              <span className="text-gray-600 dark:text-gray-300">Generating social media post...</span>
            </div>
          ) : socialMediaPost ? (
            <div className="space-y-4">
              <TextArea
                value={socialMediaPost}
                readOnly
                className="w-full min-h-[120px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                placeholder="Generated social media post will appear here..."
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
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
                  onClick={handleGenerate}
                  variant="outline"
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SocialMediaPostGenerator;