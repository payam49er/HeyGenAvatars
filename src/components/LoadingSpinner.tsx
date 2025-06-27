import React from 'react';

/**
 * Reusable loading spinner component
 * Displays an animated spinner during data loading states
 */
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="relative">
        {/* Main spinner circle */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Inner pulse effect */}
        <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-blue-300 rounded-full animate-ping"></div>
      </div>
      
      <span className="ml-4 text-gray-600 font-medium">Loading avatars...</span>
    </div>
  );
};

export default LoadingSpinner;