import React from 'react';
import { Heart, Mail, MessageCircle } from 'lucide-react';

interface FooterProps {
  onAboutClick: () => void;
  onTermsClick: () => void;
  onSupportClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAboutClick, onTermsClick, onSupportClick }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-tl from-gray-900 via-purple-800 to-gray-400 dark:from-gray-950 dark:via-purple-950 dark:to-gray-800 text-white py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                className="w-10 h-14 rounded-xl bg-gradient-to-r from-gray-900 via-yellow-300 to-gray-800" 
                src="/rabbitLogoTr.png" 
                alt="EXPLORERrabbit Logo"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                EXPLORERrabbit
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-md">
              Your intelligent companion for content creation and knowledge exploration. 
              Transform ideas into engaging content with the power of AI.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current" />
              <span>for curious minds everywhere</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-300">Company</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={onAboutClick}
                  className="text-gray-300 hover:text-orange-300 transition-colors duration-200 text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={onTermsClick}
                  className="text-gray-300 hover:text-orange-300 transition-colors duration-200 text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={onSupportClick}
                  className="text-gray-300 hover:text-orange-300 transition-colors duration-200 text-left"
                >
                  Support & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-300">Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={onSupportClick}
                  className="flex items-center gap-2 text-gray-300 hover:text-orange-300 transition-colors duration-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  Help Center
                </button>
              </li>
              <li>
                <a
                  href="mailto:support@explorerrabbit.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-orange-300 transition-colors duration-200"
                >
                  <Mail className="h-4 w-4" />
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} EXPLORERrabbit. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <button
                onClick={onTermsClick}
                className="hover:text-orange-300 transition-colors duration-200"
              >
                Privacy Policy
              </button>
              <button
                onClick={onTermsClick}
                className="hover:text-orange-300 transition-colors duration-200"
              >
                Terms
              </button>
              <button
                onClick={onSupportClick}
                className="hover:text-orange-300 transition-colors duration-200"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;