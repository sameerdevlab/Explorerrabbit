import React from 'react';
import { Sparkles, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

const Header: React.FC = () => {
  const { user, signOut, loading } = useAuthStore();
  
  return (
    <header className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles size={24} className="text-white" />
          <h1 className="text-xl font-bold">AI Content Generator</h1>
        </div>
        
        <div className= "group">
          {user ? (
            <div className="relative">
              <div className="flex items-center gap-4">
                {/* User Initial Circle */}
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:bg-white/30 transition-all duration-200">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                
                {/* Logout Button - Hidden by default, shown on hover */}
                <div className="absolute right-0 top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    disabled={loading}
                    className="bg-white/90 backdrop-blur-sm border-white/30 text-purple-700 hover:bg-white hover:text-purple-800 shadow-lg whitespace-nowrap"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/auth'}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;