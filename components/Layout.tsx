import React, { ReactNode } from 'react';
import { Moon, Sun, Camera } from 'lucide-react';

interface HeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleTheme, isDark, onReset }) => (
  <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group" 
        onClick={onReset}
      >
        <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
          <Camera className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            RezAI Product Studio
          </h1>
        </div>
      </div>
      
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  </header>
);

export const Container: React.FC<{ children: ReactNode }> = ({ children }) => (
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    {children}
  </main>
);
