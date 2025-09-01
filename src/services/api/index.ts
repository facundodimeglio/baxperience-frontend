/**
 * API Services Index
 * Central export point for all API services
 */

// Core API infrastructure
export { apiClient, ApiException } from './client';
export { API_CONFIG, getApiUrl, getEnvironmentConfig } from './config';

// Services
export { authService } from './authService';
export { itineraryService } from './itineraryService';

// Types
export type {
  ApiResponse,
  ApiError,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  UserProfile,
  HttpMethod,
  RequestConfig,
} from './types';

// Import services for re-export
import { authService } from './authService';
import { itineraryService } from './itineraryService';

// Re-export for convenience
export const API_SERVICES = {
  auth: authService,
  itinerary: itineraryService,
} as const;

