import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'professional';
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, variant = 'default', error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-gray-500 z-10">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 text-gray-700 dark:text-gray-200 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 typography-enhanced',
            {
              'pl-12': icon,
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600': variant === 'default',
              'bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-white/20 dark:border-gray-700/20': variant === 'glass',
              'input-professional': variant === 'professional',
              'border-red-500 focus:ring-red-500': error,
            },
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-500 typography-enhanced">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;