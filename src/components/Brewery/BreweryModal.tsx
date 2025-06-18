import React from 'react';
import { X, MapPin, Phone, Globe, Navigation, Building, Calendar, ExternalLink } from 'lucide-react';
import { Brewery } from '../../types/brewery';

interface BreweryModalProps {
  brewery: Brewery;
  onClose: () => void;
}

const BreweryModal: React.FC<BreweryModalProps> = ({ brewery, onClose }) => {
  const formatBreweryType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  const getTypeColor = (type: string) => {
    const colors = {
      micro: 'bg-green-100 text-green-800 border-green-200',
      nano: 'bg-blue-100 text-blue-800 border-blue-200',
      regional: 'bg-purple-100 text-purple-800 border-purple-200',
      brewpub: 'bg-orange-100 text-orange-800 border-orange-200',
      large: 'bg-red-100 text-red-800 border-red-200',
      planning: 'bg-gray-100 text-gray-800 border-gray-200',
      bar: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      contract: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      proprietor: 'bg-pink-100 text-pink-800 border-pink-200',
      closed: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const openInMaps = () => {
    if (brewery.latitude && brewery.longitude) {
      const url = `https://www.google.com/maps?q=${brewery.latitude},${brewery.longitude}`;
      window.open(url, '_blank');
    } else if (brewery.address_1) {
      const address = `${brewery.address_1}, ${brewery.city}, ${brewery.state} ${brewery.postal_code}`;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{brewery.name}</h2>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="text-white/90">
                  {brewery.city}, {brewery.state}
                </span>
              </div>
              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(brewery.brewery_type)}`}>
                  {formatBreweryType(brewery.brewery_type)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Address Section */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Navigation className="w-5 h-5 mr-2 text-amber-600" />
              Address
            </h3>
            <div className="space-y-2 text-gray-700">
              {brewery.address_1 && <p>{brewery.address_1}</p>}
              {brewery.address_2 && <p>{brewery.address_2}</p>}
              {brewery.address_3 && <p>{brewery.address_3}</p>}
              <p>
                {brewery.city}, {brewery.state} {brewery.postal_code}
              </p>
              <p>{brewery.country}</p>
            </div>
            <button
              onClick={openInMaps}
              className="mt-4 flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Open in Maps</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Phone */}
            {brewery.phone && (
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  Phone
                </h3>
                <a
                  href={`tel:${brewery.phone}`}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {brewery.phone}
                </a>
              </div>
            )}

            {/* Website */}
            {brewery.website_url && (
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-600" />
                  Website
                </h3>
                <a
                  href={brewery.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors flex items-center space-x-1"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Coordinates */}
          {brewery.latitude && brewery.longitude && (
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Coordinates
              </h3>
              <div className="text-gray-700 font-mono text-sm">
                <p>Latitude: {brewery.latitude}</p>
                <p>Longitude: {brewery.longitude}</p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-orange-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Building className="w-5 h-5 mr-2 text-orange-600" />
              Additional Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Brewery ID:</p>
                <p className="font-medium text-gray-900">{brewery.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Type:</p>
                <p className="font-medium text-gray-900">{formatBreweryType(brewery.brewery_type)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-3xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreweryModal;