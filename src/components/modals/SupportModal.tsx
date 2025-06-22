import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, MessageCircle, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('General');

  const categories = ['General', 'Account & Login', 'Content Generation', 'Saved Content', 'Troubleshooting'];

  const faqs: FAQItem[] = [
    {
      category: 'General',
      question: 'What is EXPLORERrabbit?',
      answer: 'EXPLORERrabbit is an AI-powered content generation and text enhancement platform. It allows you to generate original text, create images and quizzes from existing text, and generate social media posts.'
    },
    {
      category: 'General',
      question: 'Is EXPLORERrabbit free to use?',
      answer: 'EXPLORERrabbit is currently in beta and free to use. We may introduce premium plans in the future for extended access and advanced capabilities.'
    },
    {
      category: 'General',
      question: 'What kind of content can I generate?',
      answer: 'You can generate various types of content, including informative articles, summaries, creative pieces, and more, based on your prompts. You can also enhance your own text with images, MCQs, and social media posts.'
    },
    {
      category: 'Account & Login',
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking on the "Sign Up" button on the authentication page and providing your email and a password.'
    },
    {
      category: 'Account & Login',
      question: 'I forgot my password. How can I reset it?',
      answer: 'On the sign-in page, click "Forgot Password" and follow the instructions sent to your registered email address.'
    },
    {
      category: 'Account & Login',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account from your profile settings. Please note that this action is irreversible and will remove all your saved content.'
    },
    {
      category: 'Content Generation',
      question: 'How do I generate content from a prompt?',
      answer: 'Navigate to the "Generate Content" mode, enter your desired topic or question in the prompt input field, and click "Generate Content."'
    },
    {
      category: 'Content Generation',
      question: 'How do I process my own text?',
      answer: 'Switch to the "Paste Your Own Text" mode, paste your text into the provided area, and click "Process Text." The system will then generate images and questions based on your input.'
    },
    {
      category: 'Content Generation',
      question: 'Why are images not appearing for my text?',
      answer: 'Image generation relies on the content of your text. Ensure your text is descriptive enough for the AI to create relevant image prompts. Also, check your internet connection.'
    },
    {
      category: 'Content Generation',
      question: 'Can I generate MCQs for any text?',
      answer: 'While the system attempts to generate MCQs for any text, highly complex, very short, or ambiguous texts might result in fewer or no questions. Ensure your text provides clear factual information.'
    },
    {
      category: 'Saved Content',
      question: 'How do I save my generated content?',
      answer: 'After content is generated, if you are signed in, a "Save Content" button will appear. Click it to save the current content (text, images, MCQs, social media post) to your account.'
    },
    {
      category: 'Saved Content',
      question: 'Where can I find my saved content?',
      answer: 'Click the "Saved Content" button in the header. A modal will appear displaying all your previously saved items.'
    },
    {
      category: 'Saved Content',
      question: 'Can I download my saved content?',
      answer: 'Yes, from the "Saved Content" modal, you can select options to download your content as a PDF.'
    },
    {
      category: 'Saved Content',
      question: 'How do I delete saved content?',
      answer: 'In the "Saved Content" modal, hover over the item you wish to delete, and a trash can icon will appear. Click it to delete the item.'
    },
    {
      category: 'Troubleshooting',
      question: 'I\'m getting an "Unauthorized" error.',
      answer: 'This usually means you are not signed in or your session has expired. Please sign in again.'
    },
    {
      category: 'Troubleshooting',
      question: 'The content generation is taking too long or failing.',
      answer: 'This could be due to network issues, API rate limits, or problems with the AI service. Please try again after a few moments. If the issue persists, contact support.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
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
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto z-[9999]"
          >
            <Card className="bg-white dark:bg-gray-800 shadow-2xl">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg">
                      <HelpCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                        Support & FAQs
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Get help and find answers to common questions
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
                
                {/* Contact Options */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Get in Touch</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Help Center</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Browse our comprehensive FAQ section below for quick answers
                      </p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Email Support</h4>
                      </div>
                      <a
                        href="mailto:smartteam034@gmail.com"
                        className="text-green-600 dark:text-green-400 text-sm hover:underline"
                      >
                        smartteam034@gmail.com
                      </a>
                    </motion.div>
                  </div>
                </div>

                {/* FAQ Categories */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Frequently Asked Questions</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category, index) => (
                      <motion.button
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={`${selectedCategory}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-800 dark:text-gray-200 pr-4">
                          {faq.question}
                        </span>
                        {expandedFAQ === index ? (
                          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFAQ === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Still Need Help */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700"
                >
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                    Still Need Help?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Can't find what you're looking for? Our support team is here to help!
                  </p>
                  <a
                    href="mailto:support@explorerrabbit.com"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </a>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;