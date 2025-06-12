import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, User } from 'lucide-react';
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
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  
  const onSubmit = async (data: FormValues) => {
    try {
      if (isSignUp) {
        await signUp(data.email, data.password);
      } else {
        await signIn(data.email, data.password);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Auth error:', error);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <User size={24} />
            <span>{isSignUp ? 'Create an account' : 'Sign in to your account'}</span>
          </CardTitle>
          <CardDescription className="text-white/80">
            {isSignUp 
              ? 'Create a new account to use the AI Content Generator'
              : 'Sign in to access the AI Content Generator'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="Email address"
                icon={<Mail size={16} />}
                error={errors.email?.message}
              />
            </div>
            
            <div>
              <Input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type="password"
                placeholder="Password"
                icon={<Lock size={16} />}
                error={errors.password?.message}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-600 hover:text-purple-800 underline underline-offset-2 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthForm;