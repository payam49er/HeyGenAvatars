import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import AvatarGallery from './components/AvatarGallery';

/**
 * Main application component
 * Provides the layout and header for the HeyGen Avatar Gallery
 */
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header section */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  HeyGen Avatar Gallery
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </h1>
                <p className="text-sm text-gray-600">
                  Discover and explore AI-powered avatars
                </p>
              </div>
            </div>

            {/* Stats badge */}
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">
                Live API Connection
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction section */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Professional AI Avatars for Your Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our collection of high-quality AI avatars. Each avatar comes with preview videos 
            and can be used for various applications including presentations, videos, and digital content.
          </p>
        </div>

        {/* Avatar gallery */}
        <AvatarGallery />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© 2025 HeyGen Avatar Gallery. Built with React & TypeScript.</p>
            <div className="flex items-center gap-4">
              <span>Powered by HeyGen API</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span>Real-time data</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;