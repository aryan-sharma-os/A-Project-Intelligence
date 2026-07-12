import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Research Failed</h2>
      <p className="text-zinc-400 max-w-md mb-8">{message || "The AI encountered an unexpected error while gathering data or analyzing the stock."}</p>
      
      <button 
        onClick={onRetry}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
      >
        <RefreshCcw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
};

export default ErrorState;
