/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  UserProfile,
  ApiResponse 
} from './types';

/**
 * Authentication Service Class
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('🔐 AuthService.login called with:', { 
        email: credentials.email,
        password: '[REDACTED]'
      });
      
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log('✅ Login API response:', response);

      // Extract the actual response data
      const loginData = response as LoginResponse;

      // Store the token
      if (loginData.token) {
        apiClient.setAuthToken(loginData.token);
      }

      return loginData;
    } catch (error) {
      console.error('❌ Login error in authService:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      console.log('🚀 AuthService.register called with:', userData);
      
      const response = await apiClient.post<RegisterResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );

      console.log('✅ Registration API response:', response);

      // Extract the actual response data
      const registerData = response as RegisterResponse;

      // Store the token
      if (registerData.token) {
        apiClient.setAuthToken(registerData.token);
      }

      return registerData;
    } catch (error) {
      console.error('❌ Registration error in authService:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE,
        true // requires auth
      );

      return response as UserProfile;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Clear the stored token
      apiClient.clearAuthToken();
      
      // In a real app, you might want to call a logout endpoint
      // to invalidate the token on the server
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = apiClient.getAuthToken();
    return token !== null && token.length > 0;
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    return apiClient.getAuthToken();
  }

  /**
   * Set auth token (useful for persisted sessions)
   */
  setAuthToken(token: string): void {
    apiClient.setAuthToken(token);
  }

  /**
   * Helper method to create registration data from form steps
   */
  createRegistrationData(
    basicInfo: {
      fullName: string;
      email: string;
      password: string;
    },
    profileInfo: {
      fechaNacimiento: string;
      paisOrigen: string;
      ciudadOrigen: string;
      idiomaPreferido: string;
      telefono: string;
      tipoViajero: string;
      genero: string;
    },
    preferences: string[]
  ): RegisterRequest {
    // Split full name into nombre and apellido
    const nameParts = basicInfo.fullName.trim().split(' ');
    const nombre = nameParts[0] || '';
    const apellido = nameParts.slice(1).join(' ') || 'Sin Apellido';
    
    // Generate username from email
    const username = basicInfo.email.split('@')[0];

    return {
      email: basicInfo.email,
      password: basicInfo.password,
      nombre,
      apellido,
      username,
      fechaNacimiento: profileInfo.fechaNacimiento,
      paisOrigen: profileInfo.paisOrigen,
      ciudadOrigen: profileInfo.ciudadOrigen,
      idiomaPreferido: profileInfo.idiomaPreferido,
      telefono: profileInfo.telefono,
      tipoViajero: profileInfo.tipoViajero,
      genero: profileInfo.genero,
      preferencias: preferences,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
