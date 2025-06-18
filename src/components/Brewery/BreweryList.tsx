import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Beer, AlertCircle } from "lucide-react";
import { RootState } from "../../store/store";
import { BreweryWithDistance } from "../../types/brewery";
import BreweryCard from "./BreweryCard";
import BreweryModal from "./BreweryModal";
import Pagination from "../Pagination/Pagination";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const BreweryList: React.FC = () => {
  const { filteredBreweries, loading, error, currentPage, itemsPerPage } =
    useSelector((state: RootState) => state.brewery);
  const [selectedBrewery, setSelectedBrewery] =
    useState<BreweryWithDistance | null>(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Breweries
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (filteredBreweries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 max-w-md mx-auto">
          <Beer className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            No Breweries Found
          </h3>
          <p className="text-amber-600">
            Try adjusting your search criteria or filters to find breweries in
            your area.
          </p>
        </div>
      </div>
    );
  }
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBreweries = filteredBreweries.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredBreweries.length}{" "}
            {filteredBreweries.length === 1 ? "Brewery" : "Breweries"} Found
          </h2>
          <p className="text-gray-600 mt-1">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredBreweries.length)} of{" "}
            {filteredBreweries.length} results
          </p>
        </div>
      </div>

      {/* Brewery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBreweries.map((brewery) => (
          <BreweryCard
            key={brewery.id}
            brewery={brewery}
            onClick={setSelectedBrewery}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination />

      {/* Brewery Modal */}
      {selectedBrewery && (
        <BreweryModal
          brewery={selectedBrewery}
          onClose={() => setSelectedBrewery(null)}
        />
      )}
    </div>
  );
};

export default BreweryList;
