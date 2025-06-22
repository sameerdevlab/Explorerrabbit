import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Target, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'Dynamic Content Generation',
      description: 'Create original articles, summaries, and creative pieces from simple prompts.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: Target,
      title: 'Text Enhancement',
      description: 'Transform your existing text by automatically generating relevant images, multiple-choice questions, and social media posts.',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Test your knowledge with AI-generated quizzes tailored to your content.',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Zap,
      title: 'Seamless Sharing',
      description: 'Easily share your creations across various platforms and save your insights for future reference.',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
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
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]"
          >
            <Card className="bg-white dark:bg-gray-800 shadow-2xl">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl shadow-lg">
                      <img 
                        className="w-8 h-10" 
                        src="/rabbitLogoTr.png" 
                        alt="EXPLORERrabbit Logo"
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 dark:from-orange-400 dark:via-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                        About EXPLORERrabbit
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Your intelligent companion for content creation
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X size={24} />
                  </Button>
                </div>
                
                {/* Mission Statement */}
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-700"
                  >
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Our Mission</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      Welcome to EXPLORERrabbit, your intelligent companion for content creation and knowledge exploration. 
                      Our mission is to empower users to effortlessly generate high-quality, engaging content, transform 
                      existing text into rich media, and test their understanding through interactive quizzes.
                    </p>
                  </motion.div>
                </div>

                {/* Vision */}
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                      At EXPLORERrabbit, we believe in making advanced AI accessible and intuitive. Whether you're a 
                      student, educator, marketer, or simply a curious mind, our platform is designed to streamline 
                      your creative process and deepen your learning.
                    </p>
                  </motion.div>
                </div>

                {/* Features Grid */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">What We Offer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => {
                      const IconComponent = feature.icon;
                      
                      return (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className={`p-6 rounded-xl border-2 ${feature.bgColor} border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${feature.bgColor} border border-gray-300 dark:border-gray-600`}>
                              <IconComponent className={`h-6 w-6 ${feature.color}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                                {feature.title}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-700"
                >
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Join the EXPLORERrabbit Community
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                    Unlock your potential to create, learn, and share like never before. Start your journey 
                    with EXPLORERrabbit today and discover what's possible when curiosity meets cutting-edge AI.
                  </p>
                  <Button
                    onClick={onClose}
                    variant="sketchy"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none shadow-lg px-8 py-3"
                  >
                    Start Exploring
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;