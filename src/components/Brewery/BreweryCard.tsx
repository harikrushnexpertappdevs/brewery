import React from 'react';
import { MapPin, Phone, Globe, Navigation, Star } from 'lucide-react';
import { BreweryWithDistance } from '../../types/brewery';

interface BreweryCardProps {
  brewery: BreweryWithDistance;
  onClick: (brewery: BreweryWithDistance) => void;
}

const BreweryCard: React.FC<BreweryCardProps> = ({ brewery, onClick }) => {
  const formatBreweryType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  const getTypeColor = (type: string) => {
    const colors = {
      micro: 'bg-green-100 text-green-800',
      nano: 'bg-blue-100 text-blue-800',
      regional: 'bg-purple-100 text-purple-800',
      brewpub: 'bg-orange-100 text-orange-800',
      large: 'bg-red-100 text-red-800',
      planning: 'bg-gray-100 text-gray-800',
      bar: 'bg-yellow-100 text-yellow-800',
      contract: 'bg-indigo-100 text-indigo-800',
      proprietor: 'bg-pink-100 text-pink-800',
      closed: 'bg-gray-100 text-gray-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      onClick={() => onClick(brewery)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-amber-200 group overflow-hidden"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2">
              {brewery.name}
            </h3>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-4 h-4 mr-1 text-amber-600" />
              <span className="text-sm">
                {brewery.city}, {brewery.state}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(brewery.brewery_type)}`}>
              {formatBreweryType(brewery.brewery_type)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Address */}
          {brewery.address_1 && (
            <div className="flex items-start space-x-2">
              <Navigation className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <p>{brewery.address_1}</p>
                {brewery.address_2 && <p>{brewery.address_2}</p>}
                <p>
                  {brewery.city}, {brewery.state} {brewery.postal_code}
                </p>
              </div>
            </div>
          )}

          {/* Phone */}
          {brewery.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">{brewery.phone}</span>
            </div>
          )}

          {/* Website */}
          {brewery.website_url && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-amber-600 hover:text-amber-700 transition-colors">
                Visit Website
              </span>
            </div>
          )}

          {/* Distance */}
          {brewery.distance && (
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-sm font-medium text-amber-700">
                {brewery.distance} miles away
              </span>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Click for details</span>
            <div className="flex items-center space-x-1 text-amber-600 group-hover:text-amber-700 transition-colors">
              <span className="text-sm font-medium">View Details</span>
              <Navigation className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreweryCard;