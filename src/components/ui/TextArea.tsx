import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'glass';
  error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant = 'default', error, value, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || internalRef;

    // Auto-resize functionality
    useEffect(() => {
      const textarea = textareaRef as React.RefObject<HTMLTextAreaElement>;
      if (textarea.current && value) {
        // Reset height to auto to get the correct scrollHeight
        textarea.current.style.height = 'auto';
        // Set height to scrollHeight to fit content
        textarea.current.style.height = `${textarea.current.scrollHeight}px`;
      }
    }, [value, textareaRef]);

    return (
      <div className="w-full">
        <textarea
          className={cn(
            'w-full px-4 py-2 text-gray-700 dark:text-gray-200 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none overflow-hidden',
            {
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600': variant === 'default',
              'bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-white/20 dark:border-gray-700/20': variant === 'glass',
              'border-red-500 focus:ring-red-500': error,
            },
            className
          )}
          ref={textareaRef}
          value={value}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;