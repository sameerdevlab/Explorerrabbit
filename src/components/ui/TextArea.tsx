import React from 'react';
import { cn } from '../../lib/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'glass';
  error?: string;
  glowing?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant = 'default', error, glowing = false, ...props }, ref) => {
    return (
      <div className={cn(
        "w-full",
        {
          'glowing-textarea-border': glowing,
        }
      )}>
        <textarea
          className={cn(
            'w-full px-4 py-2 text-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all relative z-10',
            {
              'bg-white border-gray-300': variant === 'default',
              'bg-white/40 backdrop-blur-md border-white/20': variant === 'glass',
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