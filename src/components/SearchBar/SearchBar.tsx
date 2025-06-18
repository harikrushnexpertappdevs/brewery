import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, X } from "lucide-react";
import { RootState, AppDispatch } from "../../store/store";
import {
  setFilters,
  fetchSuggestions,
  clearSuggestions,
} from "../../store/slices/brewerySlice";
import { debounce } from "../../utils/debounce";

const SearchBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, suggestions } = useSelector(
    (state: RootState) => state.brewery
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(filters.search);
  const dropdownRef = useRef(null);

  // Create a stable debounced function using useCallback
  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => {
      if (query.length >= 2) {
        dispatch(fetchSuggestions(query));
      } else {
        dispatch(clearSuggestions());
      }
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetchSuggestions(inputValue);
  }, [inputValue, debouncedFetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !(dropdownRef.current as any).contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    dispatch(setFilters({ search: suggestion }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search: inputValue }));
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setInputValue("");
    dispatch(setFilters({ search: "" }));
    dispatch(clearSuggestions());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(inputValue.length >= 2)}
            placeholder="Search breweries by name, city, or state..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-amber-500 focus:ring-0 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
          />
          {inputValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl mt-2 z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
