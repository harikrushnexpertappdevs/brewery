import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import {
  fetchBreweries,
  setUserLocation,
  fetchRandomBrewery,
  fetchBreweriesWithFilters,
} from "./store/slices/brewerySlice";
import { useGeolocation } from "./hooks/useGeolocation";
import Header from "./components/Layout/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import Filters from "./components/Filters/Filters";
import BreweryList from "./components/Brewery/BreweryList";
import RandomBrewery from "./components/RandomBrewery/RandomBrewery";
import { AlertTriangle, MapPin } from "lucide-react";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { filters } = useSelector((state: RootState) => state.brewery);
  const {
    latitude,
    longitude,
    error: locationError,
    loading: locationLoading,
  } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude) {
      dispatch(setUserLocation({ latitude, longitude }));
      dispatch(fetchRandomBrewery({ latitude, longitude }));
    }
  }, [latitude, longitude, dispatch]);

  useEffect(() => {
    const hasFilters =
      filters.search ||
      filters.city ||
      filters.state ||
      filters.distance ||
      filters.breweryType;

    if (hasFilters) {
      dispatch(fetchBreweriesWithFilters(filters));
    } else {
      dispatch(fetchBreweries({}));
    }
  }, [filters, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Location Error Alert */}
        {locationError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8 flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800">
                Location Access Unavailable
              </h4>
              <p className="text-yellow-700 text-sm mt-1">
                {locationError}. Distance filtering and random brewery discovery
                won't be available.
              </p>
            </div>
          </div>
        )}

        {/* Location Loading */}
        {locationLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 animate-pulse" />
            <div>
              <h4 className="font-medium text-blue-800">
                Getting Your Location
              </h4>
              <p className="text-blue-700 text-sm mt-1">
                We're accessing your location to provide distance-based
                filtering and find breweries near you.
              </p>
            </div>
          </div>
        )}

        {/* Random Brewery Section */}
        <div className="mb-12">
          <RandomBrewery />
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Your Perfect Brewery
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Search through thousands of breweries, filter by location and
              type, and discover amazing craft beer destinations.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <SearchBar />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Filters />
        </div>

        {/* Brewery List */}
        <BreweryList />
      </main>
    </div>
  );
}

export default App;
