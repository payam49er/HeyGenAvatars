import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Props interface for ErrorDisplay component
 */
interface ErrorDisplayProps {
  /** Error message to display */
  message?: string;
  
  /** Callback function for retry action */
  onRetry?: () => void;
}

/**
 * Error display component with retry functionality
 * Shows user-friendly error messages with optional retry button
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message = 'Something went wrong while loading avatars', 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 text-center p-8">
      {/* Error icon */}
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      
      {/* Error message */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Unable to Load Avatars
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;