import React from 'react';
import { cn } from '../../lib/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'glass' | 'professional';
  error?: string;
  autoResize?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant = 'default', error, autoResize = false, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            'w-full px-4 py-3 text-gray-700 dark:text-gray-200 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 typography-enhanced',
            {
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600': variant === 'default',
              'bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-white/20 dark:border-gray-700/20': variant === 'glass',
              'input-professional': variant === 'professional',
              'border-red-500 focus:ring-red-500': error,
              'resize-none overflow-hidden': autoResize,
              'overflow-y-auto resize-y': !autoResize,
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

TextArea.displayName = 'TextArea';

export default TextArea;