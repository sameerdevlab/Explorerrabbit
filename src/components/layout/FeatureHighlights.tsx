import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Brain, Share2, Download, Zap } from 'lucide-react';

const FeatureHighlights: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Content Generation',
      description: 'Create original articles and content from simple prompts',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
    },
    {
      icon: FileText,
      title: 'Text Enhancement',
      description: 'Transform your existing text with relevant images',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
    },
    {
      icon: Brain,
      title: 'Interactive Quizzes',
      description: 'Generate MCQs to test knowledge and understanding',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700',
    },
    {
      icon: Share2,
      title: 'Social Media Posts',
      description: 'Create engaging posts for various platforms',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-700',
    },
    {
      icon: Download,
      title: 'PDF Export',
      description: 'Download your saved content as professional PDFs',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-700',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get comprehensive content packages in seconds',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-700',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-6xl mx-auto px-4 mb-8"
    >
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3"
        >
          Everything You Need for Content Creation
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Powerful AI tools to transform your ideas into engaging, shareable content
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer`}
            >
              {/* Background gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgColor} border ${feature.borderColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-6 w-6 ${feature.color}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 ${feature.color.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} opacity-5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
            </motion.div>
          );
        })}
      </div>

      {/* Bottom decorative element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="flex justify-center mt-8"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full border border-purple-200 dark:border-purple-700">
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Powered by Advanced AI
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeatureHighlights;