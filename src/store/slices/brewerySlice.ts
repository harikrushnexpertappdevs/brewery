import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Brewery,
  BreweryFilters,
  UserLocation,
  BreweryWithDistance,
} from "../../types/brewery";
import { API_ENDPOINTS } from "../../utils/api-constants";
import { haversineDistance } from "../../utils/haversineDistance";

interface BreweryState {
  breweries: BreweryWithDistance[];
  filteredBreweries: BreweryWithDistance[];
  selectedBrewery: Brewery | null;
  randomBrewery: Brewery | null;
  loading: boolean;
  error: string | null;
  filters: BreweryFilters;
  userLocation: UserLocation | null;
  suggestions: string[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

const initialState: BreweryState = {
  breweries: [],
  filteredBreweries: [],
  selectedBrewery: null,
  randomBrewery: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    city: "",
    state: "",
    distance: null,
    breweryType: "",
  },
  userLocation: null,
  suggestions: [],
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 12,
};

export const fetchBreweries = createAsyncThunk(
  "brewery/fetchBreweries",
  async (params: {
    page?: number;
    perPage?: number;
    search?: string;
    city?: string;
    state?: string;
    type?: string;
  }) => {
    const { page = 1, perPage = 200, search, city, state, type } = params;

    let url = `${API_ENDPOINTS.BREWERIES}?page=${page}&per_page=${perPage}`;

    if (search) url += `&by_name=${encodeURIComponent(search)}`;
    if (city) url += `&by_city=${encodeURIComponent(city)}`;
    if (state) url += `&by_state=${encodeURIComponent(state)}`;
    if (type) url += `&by_type=${encodeURIComponent(type)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch breweries");
    }

    const data = await response.json();
    return data as Brewery[];
  }
);

export const fetchBreweriesWithFilters = createAsyncThunk(
  "brewery/fetchBreweriesWithFilters",
  async (filters: BreweryFilters, { getState }) => {
    const state = getState() as { brewery: BreweryState };
    const { userLocation } = state.brewery;

    let url = `${API_ENDPOINTS.BREWERIES}?per_page=200`;

    if (filters.search) url += `&by_name=${encodeURIComponent(filters.search)}`;
    if (filters.city) url += `&by_city=${encodeURIComponent(filters.city)}`;
    if (filters.state) url += `&by_state=${encodeURIComponent(filters.state)}`;
    if (filters.distance)
      url += `&by_distance=${`${userLocation?.latitude},${userLocation?.longitude}`}`;
    if (filters.breweryType)
      url += `&by_type=${encodeURIComponent(filters.breweryType)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch breweries");
    }

    let breweries = (await response.json()) as Brewery[];

    if (filters.distance && userLocation) {
      breweries = breweries.map((brewery) => {
        if (brewery.latitude && brewery.longitude) {
          const distance = haversineDistance(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(brewery.latitude),
            parseFloat(brewery.longitude)
          );
          return { ...brewery, distance };
        }
        return brewery;
      });
    }

    return breweries;
  }
);

export const fetchBreweryById = createAsyncThunk(
  "brewery/fetchBreweryById",
  async (id: string) => {
    const response = await fetch(`${API_ENDPOINTS.BREWERIES}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch brewery details");
    }

    const data = await response.json();
    return data as Brewery;
  }
);

export const fetchRandomBrewery = createAsyncThunk(
  "brewery/fetchRandomBrewery",
  async (userLocation: UserLocation) => {
    // Fetch breweries near user location
    const response = await fetch(
      `${API_ENDPOINTS.BREWERIES}/random?by_dist=${userLocation.latitude},${userLocation.longitude}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch random brewery");
    }

    const breweries = (await response.json()) as Brewery[];

    // Filter breweries within 10 miles
    const nearbyBreweries = breweries.filter((brewery) => {
      if (!brewery.latitude || !brewery.longitude) return false;

      const distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(brewery.latitude),
        parseFloat(brewery.longitude)
      );

      return distance <= 10;
    });

    if (nearbyBreweries.length === 0) {
      // If no nearby breweries, return a random one from all breweries
      return breweries[Math.floor(Math.random() * breweries.length)];
    }

    return nearbyBreweries[Math.floor(Math.random() * nearbyBreweries.length)];
  }
);

export const fetchSuggestions = createAsyncThunk(
  "brewery/fetchSuggestions",
  async (query: string) => {
    if (query.length < 2) return [];

    // Add a small delay to prevent too many requests
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await fetch(
      `${API_ENDPOINTS.BREWERIES}/search?query=${encodeURIComponent(
        query
      )}&per_page=200`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch suggestions");
    }

    const breweries = (await response.json()) as Brewery[];
    return breweries.map((brewery) => brewery.name);
  }
);

const brewerySlice = createSlice({
  name: "brewery",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<BreweryFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },
    setUserLocation: (state, action: PayloadAction<UserLocation>) => {
      state.userLocation = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    // Remove the local applyFilters reducer since we'll use the async thunk
  },
  extraReducers: (builder) => {
    builder
      // Fetch breweries
      .addCase(fetchBreweries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBreweries.fulfilled, (state, action) => {
        state.loading = false;
        state.breweries = action.payload;
        state.filteredBreweries = action.payload;
        state.totalPages = Math.ceil(
          action.payload.length / state.itemsPerPage
        );
      })
      .addCase(fetchBreweries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch breweries";
      })

      // Fetch breweries with filters
      .addCase(fetchBreweriesWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBreweriesWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.breweries = action.payload;
        state.filteredBreweries = action.payload;
        state.totalPages = Math.ceil(
          action.payload.length / state.itemsPerPage
        );
        state.currentPage = 1;
      })
      .addCase(fetchBreweriesWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch breweries";
      })

      // Fetch brewery by ID
      .addCase(fetchBreweryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBreweryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBrewery = action.payload;
      })
      .addCase(fetchBreweryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch brewery details";
      })

      // Fetch random brewery
      .addCase(fetchRandomBrewery.fulfilled, (state, action) => {
        state.randomBrewery = action.payload;
      })
      .addCase(fetchRandomBrewery.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch random brewery";
      })

      // Fetch suggestions
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state) => {
        state.suggestions = [];
      });
  },
});

export const {
  setFilters,
  setUserLocation,
  setCurrentPage,
  clearError,
  clearSuggestions,
} = brewerySlice.actions;

export default brewerySlice.reducer;
