import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

interface AuthFormProps {
  onSuccess?: () => void;
}

interface FormValues {
  email: string;
  password: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const { signIn, signUp, loading, error } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  
  const onSubmit = async (data: FormValues) => {
    try {
      if (isSignUp) {
        await signUp(data.email, data.password);
      } else {
        await signIn(data.email, data.password);
      }
      
      // Reset form on success
      reset();
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Auth error:', error);
      // Error is already handled in the store with toast
    }
  };
  
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    reset(); // Clear form when switching modes
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="overflow-hidden shadow-2xl border-2 border-purple-200/50 dark:border-purple-700/50">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <CardTitle className="flex items-center gap-2 relative z-10">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <User size={24} />
            </motion.div>
            <span>{isSignUp ? 'Create an account' : 'Welcome back!'}</span>
          </CardTitle>
          <CardDescription className="text-white/90 relative z-10">
            {isSignUp 
              ? 'Join Explorer to start generating amazing AI content'
              : 'Sign in to continue your AI content journey'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-purple-900/20 dark:to-pink-900/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                placeholder="Enter your email address"
                icon={<Mail size={16} />}
                error={errors.email?.message}
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <Input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={<Lock size={16} />}
                error={errors.password?.message}
                className="transition-all duration-300 focus:scale-[1.02] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </motion.div>
            
            {error && (
              <motion.div 
                className="p-4 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm border-2 border-red-200 dark:border-red-700"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {error}
                </div>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 text-white border-none shadow-lg text-lg py-3 transition-all duration-300 hover:scale-[1.02]"
                isLoading={loading}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </span>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button
                type="button"
                onClick={toggleMode}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold underline underline-offset-2 transition-all duration-200 hover:scale-105"
              >
                {isSignUp ? 'Sign In Instead' : 'Create New Account'}
              </button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthForm;