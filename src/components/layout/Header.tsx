import React, { useState } from 'react';
import { LogOut, Sun, Moon, Bookmark, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import SavedContentModal from '../content/SavedContentModal';
import useAuthStore from '../../store/authStore';
import useContentStore from '../../store/contentStore';
import useThemeStore from '../../store/themeStore';

const Header: React.FC = () => {
  const { user, signOut, loading } = useAuthStore();
  const { loadSavedContent } = useContentStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isSavedContentModalOpen, setIsSavedContentModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleOpenSavedContent = () => {
    // First initiate the loading state and data fetch
    loadSavedContent();
    // Then immediately open the modal
    setIsSavedContentModalOpen(true);
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setIsMobileMenuOpen(false);
  };

  const handleAuthRedirect = () => {
    window.location.href = '/auth';
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      <header className="w-full sticky top-0 z-50 px-6 py-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-white shadow-lg border-b-2 border-white/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <img className="w-12 h-16 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 dark:from-slate-900 dark:via-yellow-300 dark:to-slate-900 rounded-xl" src="/rabbitLogoTr.png" alt="Explorer Logo"/>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">EXPLORERrabbit</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4 mr-5 md:mr-8">
            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4">
              {/* Saved Content Button */}
              <Button
                variant="sketchy"
                size="md"
                onClick={handleOpenSavedContent}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 p-2 shadow-md"
              >
                <Bookmark size={18} className="mr-2" />
                Saved Content
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="sketchy"
                size="sm"
                onClick={toggleTheme}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 p-2 shadow-md"
              >
                {theme === 'light' ? (
                  <Moon size={18} />
                ) : (
                  <Sun size={18} />
                )}
              </Button>
              
              {/* User Section */}
              <div className="group">
                {user ? (
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      {/* User Initial Circle */}
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:bg-white/30 transition-all duration-200 shadow-md">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* User Menu - Hidden by default, shown on hover */}
                      <div className="absolute right-0 top-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto p-2 z-50">
                        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg shadow-lg p-2 space-y-2 min-w-[160px]">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => signOut()}
                            disabled={loading}
                            className="w-full justify-start text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            <LogOut size={16} className="mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="sketchy"
                    size="sm"
                    onClick={() => window.location.href = '/auth'}
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 shadow-md"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <Button
              variant="sketchy"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 p-2 shadow-md"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-gradient-to-br from-purple-600 to-pink-500 dark:from-gray-800 dark:to-gray-900 shadow-lg p-6 flex flex-col space-y-6 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/20 text-white"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col space-y-4">
                {/* Saved Content */}
                <Button
                  variant="sketchy"
                  onClick={handleOpenSavedContent}
                  className="w-full justify-start bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 p-3 shadow-md"
                >
                  <Bookmark size={18} className="mr-3" />
                  Saved Content
                </Button>

                {/* Theme Toggle */}
                <Button
                  variant="sketchy"
                  onClick={handleThemeToggle}
                  className="w-full justify-start bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 p-3 shadow-md"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon size={18} className="mr-3" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun size={18} className="mr-3" />
                      Light Mode
                    </>
                  )}
                </Button>

                {/* User Section */}
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-lg">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-white/70">Signed in</p>
                      </div>
                    </div>
                    <Button
                      variant="sketchy"
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full justify-start bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-white hover:bg-red-500/30 p-3 shadow-md"
                    >
                      <LogOut size={18} className="mr-3" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="sketchy"
                    onClick={handleAuthRedirect}
                    className="w-full justify-start bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-white hover:bg-green-500/30 p-3 shadow-md"
                  >
                    Sign In
                  </Button>
                )}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-6 border-t border-white/20">
                <p className="text-sm text-white/70 text-center">
                  EXPLORERrabbit v1.0
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Saved Content Modal */}
      <SavedContentModal
        isOpen={isSavedContentModalOpen}
        onClose={() => setIsSavedContentModalOpen(false)}
      />
    </>
  );
};

export default Header;