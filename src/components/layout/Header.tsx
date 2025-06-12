import React from 'react';
import { Sparkles, LogOut, Sun, Moon, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';

const Header: React.FC = () => {
  const { user, signOut, loading } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to auth page after successful sign out
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };
  
  return (
    <header className="w-full sticky top-0 z-50 px-6 py-4 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-white shadow-lg border-b-2 border-white/20">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={24} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-wide">EXPLORER</h1>
        </motion.div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
          </motion.div>
          
          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* User Info */}
              <motion.div 
                className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <User size={16} className="text-white/80" />
                <span className="text-sm font-medium text-white/90 max-w-[150px] truncate">
                  {user.email}
                </span>
              </motion.div>
              
              {/* User Avatar */}
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {user.email.charAt(0).toUpperCase()}
              </motion.div>
              
              {/* Logout Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="sketchy"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="bg-red-500/80 backdrop-blur-sm border border-red-400/50 text-white hover:bg-red-600/80 shadow-md flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="sketchy"
                size="sm"
                onClick={() => window.location.href = '/auth'}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 shadow-md flex items-center gap-2"
              >
                <User size={16} />
                Sign In
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;