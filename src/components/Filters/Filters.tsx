import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, MapPin, Building, X } from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';
import { setFilters } from '../../store/slices/brewerySlice';

const Filters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, userLocation } = useSelector((state: RootState) => state.brewery);

  const breweryTypes = [
    { value: '', label: 'All Types' },
    { value: 'micro', label: 'Micro Brewery' },
    { value: 'nano', label: 'Nano Brewery' },
    { value: 'regional', label: 'Regional Brewery' },
    { value: 'brewpub', label: 'Brewpub' },
    { value: 'large', label: 'Large Brewery' },
    { value: 'planning', label: 'Planning' },
    { value: 'bar', label: 'Bar' },
    { value: 'contract', label: 'Contract' },
    { value: 'proprietor', label: 'Proprietor' },
    { value: 'closed', label: 'Closed' },
  ];

  const distanceOptions = [
    { value: null, label: 'Any Distance' },
    { value: 25, label: 'Within 25 miles' },
    { value: 50, label: 'Within 50 miles' },
    { value: 100, label: 'Within 100 miles' },
  ];

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const clearAllFilters = () => {
    dispatch(setFilters({
      search: '',
      city: '',
      state: '',
      distance: null,
      breweryType: '',
    }));
  };

  const hasActiveFilters = filters.search || filters.city || filters.state || filters.distance || filters.breweryType;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4 inline mr-1" />
            City
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Enter city name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            State
          </label>
          <input
            type="text"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            placeholder="Enter state name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Distance Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance
          </label>
          <select
            value={filters.distance || ''}
            onChange={(e) => handleFilterChange('distance', e.target.value ? Number(e.target.value) : null)}
            disabled={!userLocation}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {distanceOptions.map((option) => (
              <option key={option.value || 'any'} value={option.value || ''}>
                {option.label}
              </option>
            ))}
          </select>
          {!userLocation && (
            <p className="text-xs text-gray-500 mt-1">
              Enable location access to filter by distance
            </p>
          )}
        </div>

        {/* Brewery Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brewery Type
          </label>
          <select
            value={filters.breweryType}
            onChange={(e) => handleFilterChange('breweryType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
          >
            {breweryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;