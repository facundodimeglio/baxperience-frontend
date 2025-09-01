/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 */

// Base API configuration
export const API_CONFIG = {
  // Base URL - change this when deploying to production
  // For Android emulator, use 10.0.2.2 instead of localhost
  BASE_URL: 'http://10.0.2.2:3000',
  
  // API version prefix
  API_PREFIX: '/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Auth endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/profile',
      PROFILE_SETUP: '/auth/profile/setup',
    },
    ITINERARY: {
      BASE: '/itinerary',
      CREATE: '/itinerary',
      LIST: '/itinerary',
      GET_BY_ID: (id: string) => `/itinerary/${id}`,
      UPDATE: (id: string) => `/itinerary/${id}`,
      DELETE: (id: string) => `/itinerary/${id}`,
      ADD_ACTIVITY: (id: string) => `/itinerary/${id}/activity`,
      GET_ACTIVITIES: (id: string) => `/itinerary/${id}/activity`,
      GENERATE: '/itinerary/generate',
      CONFIRM: '/itinerary/confirm',
    },
  },
} as const;

/**
 * Get the full API URL for an endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
};

/**
 * Environment-specific configuration
 */
export const getEnvironmentConfig = () => {
  // In a real app, you might have different URLs for dev/staging/prod
  // For Android emulator development, use 10.0.2.2 instead of localhost
  const isDevelopment = __DEV__;
  
  return {
    baseUrl: isDevelopment ? 'http://10.0.2.2:3000' : 'https://your-production-api.com',
    debug: isDevelopment,
  };
};
