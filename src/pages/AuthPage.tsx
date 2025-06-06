import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import AuthForm from '../components/auth/AuthForm';
import useAuthStore from '../store/authStore';

const AuthPage: React.FC = () => {
  const { user, loading } = useAuthStore();
  
  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="flex justify-center">
          <Sparkles size={48} className="text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600">
          AI Content Generator
        </h1>
        <p className="mt-2 text-slate-600">
          Sign in to start generating amazing content with AI
        </p>
      </div>
      
      <AuthForm onSuccess={() => window.location.href = '/'} />
    </div>
  );
};

export default AuthPage;