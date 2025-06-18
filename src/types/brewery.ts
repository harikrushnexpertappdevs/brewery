export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  address_1: string;
  address_2?: string;
  address_3?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  longitude?: string;
  latitude?: string;
  phone?: string;
  website_url?: string;
  state: string;
  street?: string;
}

export interface BreweryFilters {
  search: string;
  city: string;
  state: string;
  distance: number | null;
  breweryType: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface BreweryWithDistance extends Brewery {
  distance?: number;
}