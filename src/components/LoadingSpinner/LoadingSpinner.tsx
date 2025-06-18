import React from 'react';
import { Beer } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="relative">
          <Beer className="w-16 h-16 text-amber-600 mx-auto animate-bounce" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-20 animate-ping"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Finding Great Breweries</h3>
        <p className="text-gray-600 mt-2">Please wait while we search for the perfect spots...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;