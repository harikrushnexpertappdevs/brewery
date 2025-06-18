import React from "react";
import { MapPin } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Brewery Finder</h1>
              <p className="text-white/80 text-sm md:text-base">
                Discover amazing breweries near you
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
