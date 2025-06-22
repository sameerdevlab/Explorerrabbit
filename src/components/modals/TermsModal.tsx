import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Shield, AlertTriangle, Scale } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: 'By creating an account, accessing, or using the Service, you affirm that you are at least 13 years old and have the legal capacity to enter into these Terms. If you are accessing or using the Service on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Shield,
      title: 'Your Account',
      content: 'You may need to register for an account to access certain features of the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: AlertTriangle,
      title: 'AI-Generated Content',
      content: 'The Service utilizes artificial intelligence to generate content, images, and questions ("AI-Generated Content"). While we strive for accuracy and quality, AI-Generated Content may contain errors, inaccuracies, or biases. EXPLORERrabbit does not guarantee the accuracy, completeness, or usefulness of any AI-Generated Content and is not responsible for any reliance you place on such content.',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: Scale,
      title: 'Intellectual Property',
      content: 'All intellectual property rights in the Service, including but not limited to software, design, text, graphics, logos, and trademarks, are owned by EXPLORERrabbit or its licensors. You may not use any of our intellectual property without our prior written consent.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
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
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                      <Scale className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                        Terms of Service
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Last Updated: June 22, 2025
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
                
                {/* Introduction */}
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700"
                  >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      Welcome to EXPLORERrabbit! These Terms of Service ("Terms") govern your access to and use of the 
                      EXPLORERrabbit website, services, and applications (collectively, the "Service"). By accessing or 
                      using the Service, you agree to be bound by these Terms.
                    </p>
                  </motion.div>
                </div>

                {/* Key Sections */}
                <div className="space-y-6 mb-8">
                  {sections.map((section, index) => {
                    const IconComponent = section.icon;
                    
                    return (
                      <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className={`p-6 rounded-xl border-2 ${section.bgColor} border-gray-200 dark:border-gray-600`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${section.bgColor} border border-gray-300 dark:border-gray-600`}>
                            <IconComponent className={`h-6 w-6 ${section.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                              {section.title}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {section.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Additional Terms */}
                <div className="space-y-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                  >
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Prohibited Conduct</h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Use the Service for any illegal or unauthorized purpose</li>
                      <li>• Interfere with or disrupt the integrity or performance of the Service</li>
                      <li>• Attempt to gain unauthorized access to the Service or its related systems</li>
                      <li>• Use the Service to generate or disseminate harmful, offensive, or illegal content</li>
                      <li>• Impersonate any person or entity</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                  >
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">User Content</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      You retain all rights to any text, images, or other content you submit, post, or display on or through 
                      the Service ("User Content"). By submitting User Content, you grant EXPLORERrabbit a worldwide, 
                      non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create 
                      derivative works from, distribute, and display such User Content in connection with the operation of the Service.
                    </p>
                  </motion.div>
                </div>

                {/* Disclaimers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-700 mb-8"
                >
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Important Disclaimers</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                    INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, EXPLORERrabbit SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                    INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
                  </p>
                </motion.div>

                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-center"
                >
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    If you have any questions about these Terms, please contact us through the Support section.
                  </p>
                  <Button
                    onClick={onClose}
                    variant="sketchy"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none shadow-lg px-8 py-3"
                  >
                    I Understand
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

export default TermsModal;