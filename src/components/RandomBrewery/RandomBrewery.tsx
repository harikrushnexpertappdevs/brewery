import React from 'react';
import { useSelector } from 'react-redux';
import { Dice6, MapPin, ExternalLink } from 'lucide-react';
import { RootState } from '../../store/store';

const RandomBrewery: React.FC = () => {
  const { randomBrewery } = useSelector((state: RootState) => state.brewery);

  if (!randomBrewery) return null;

  const formatBreweryType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  const openInMaps = () => {
    if (randomBrewery.latitude && randomBrewery.longitude) {
      const url = `https://www.google.com/maps?q=${randomBrewery.latitude},${randomBrewery.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm">
          <Dice6 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Random Discovery</h2>
          <p className="text-white/80">A brewery within 10 miles of you</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{randomBrewery.name}</h3>
            <div className="flex items-center space-x-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span>{randomBrewery.city}, {randomBrewery.state}</span>
            </div>
          </div>
          <div className="ml-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              {formatBreweryType(randomBrewery.brewery_type)}
            </span>
          </div>
        </div>

        {randomBrewery.address_1 && (
          <div className="text-white/80 mb-4">
            <p>{randomBrewery.address_1}</p>
            <p>{randomBrewery.city}, {randomBrewery.state} {randomBrewery.postal_code}</p>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {randomBrewery.phone && (
            <a
              href={`tel:${randomBrewery.phone}`}
              className="text-white/90 hover:text-white transition-colors"
            >
              {randomBrewery.phone}
            </a>
          )}
          
          {randomBrewery.website_url && (
            <a
              href={randomBrewery.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-white/90 hover:text-white transition-colors"
            >
              <span>Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {randomBrewery.latitude && randomBrewery.longitude && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <button
              onClick={openInMaps}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomBrewery;