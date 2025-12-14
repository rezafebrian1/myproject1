import React, { useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  title?: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ children, className = '', title, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 overflow-hidden
      ${active ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'}
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
  >
    {title && (
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">{title}</h3>
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', disabled, loading, fullWidth }) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:ring-gray-500",
    outline: "border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-600 dark:text-gray-300 bg-transparent"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

interface FileUploadProps {
  onUpload: (file: File) => void;
  image: string | null;
  onRemove: () => void;
  label?: string;
  optional?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, image, onRemove, label, optional }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB");
        return;
      }
      onUpload(file);
    }
  };

  return (
    <div className="relative">
      {image ? (
        <div className="relative group w-full h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={image} alt="Upload" className="w-full h-full object-cover" />
          <button 
            onClick={onRemove}
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
        >
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <span className="text-xs text-gray-500 font-medium text-center px-2">
            {label || "Upload"} <br/>
            {optional && <span className="text-gray-400 font-normal">(Optional)</span>}
          </span>
          <input 
            type="file" 
            ref={inputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFile}
          />
        </div>
      )}
    </div>
  );
};
