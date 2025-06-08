import React from 'react';
import { cn } from '../../lib/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'glass';
  error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant = 'default', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            'w-full px-4 py-2 text-gray-700 dark:text-gray-200 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all',
            {
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600': variant === 'default',
              'bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-white/20 dark:border-gray-700/20': variant === 'glass',
              'border-red-500 focus:ring-red-500': error,
            },
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;