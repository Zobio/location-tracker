export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Checkin {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  prefecture: string | null;
  city: string | null;
  address_detail: string | null;
  checked_at: string;
  created_at: string;
}

export interface CheckinCreate {
  latitude: number;
  longitude: number;
  checked_at: string;
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
}
