import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'sketchy';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    disabled, 
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg': variant === 'primary',
            'bg-pink-500 text-white hover:bg-pink-600 shadow-md hover:shadow-lg': variant === 'secondary',
            'border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 shadow-md hover:shadow-lg': variant === 'outline',
            'hover:bg-slate-100 hover:text-slate-900 text-slate-700': variant === 'ghost',
            'text-purple-600 hover:underline underline-offset-4': variant === 'link',
            'bg-white text-slate-900 dark:bg-gray-700 dark:text-gray-100 transform -rotate-1 hover:rotate-1 shadow-[0_0_0_2px_#333,0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_0_0_2px_#333,0_6px_8px_-1px_rgba(0,0,0,0.15)] dark:shadow-[0_0_0_2px_#999,0_4px_6px_-1px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_0_2px_#999,0_6px_8px_-1px_rgba(0,0,0,0.4)]': variant === 'sketchy',
            'h-9 px-4 py-2 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <svg 
            className="mr-2 h-4 w-4 animate-spin" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;