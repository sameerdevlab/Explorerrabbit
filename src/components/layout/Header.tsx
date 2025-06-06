import React from 'react';
import { Sparkles } from 'lucide-react';
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
        
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">{user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                disabled={loading}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Sign Out
              </Button>
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