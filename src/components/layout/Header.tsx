import React from 'react';
import { Sparkles, LogOut, Sun, Moon, Bookmark } from 'lucide-react';
import Button from '../ui/Button';
import SavedContentModal from '../content/SavedContentModal';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';

const Header: React.FC = () => {
  const { user, signOut, loading } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isSavedContentModalOpen, setIsSavedContentModalOpen] = React.useState(false);
  
  return (
    <>
      <header className="w-full sticky top-0 z-50 px-6 py-4 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-white shadow-lg border-b-2 border-white/20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">EXPLORER</h1>
        </div>
        
        <div className="flex items-center gap-4">
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
                        onClick={() => setIsSavedContentModalOpen(true)}
                        className="w-full justify-start text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      >
                        <Bookmark size={16} className="mr-2" />
                        Saved Content
                      </Button>
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
      </div>
      </header>
      
      {/* Saved Content Modal */}
      <SavedContentModal
        isOpen={isSavedContentModalOpen}
        onClose={() => setIsSavedContentModalOpen(false)}
      />
    </>
  );
};

export default Header;