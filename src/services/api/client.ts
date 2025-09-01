/**
 * API Client
 * Base HTTP client for making API requests
 */

import { API_CONFIG, getApiUrl } from './config';
import { ApiResponse, ApiError, RequestConfig } from './types';

/**
 * Custom error class for API errors
 */
export class ApiException extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Storage service for managing tokens
 */
class TokenStorage {
  private static token: string | null = null;
  
  static setToken(token: string): void {
    this.token = token;
    // In a real app, you'd store this in AsyncStorage or Keychain
    // For now, keeping it in memory
  }
  
  static getToken(): string | null {
    return this.token;
  }
  
  static clearToken(): void {
    this.token = null;
  }
}

/**
 * Base API Client class
 */
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL + API_CONFIG.API_PREFIX;
    this.defaultHeaders = { ...API_CONFIG.DEFAULT_HEADERS };
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    TokenStorage.setToken(token);
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    TokenStorage.clearToken();
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    return TokenStorage.getToken();
  }

  /**
   * Build headers for request
   */
  private buildHeaders(customHeaders?: Record<string, string>, requiresAuth = false): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    if (requiresAuth) {
      const token = TokenStorage.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  /**
   * Make HTTP request
   */
  private async makeRequest<T>(
    endpoint: string, 
    config: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = getApiUrl(endpoint);
    const headers = this.buildHeaders(config.headers, config.requiresAuth);

    const requestOptions: RequestInit = {
      method: config.method,
      headers,
    };

    // Add body for POST/PUT/PATCH requests
    if (config.body && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      requestOptions.body = JSON.stringify(config.body);
    }

    try {
      console.log(`🌐 API Request: ${config.method} ${url}`);
      console.log(`📤 Request body:`, config.body);
      
      const response = await fetch(url, requestOptions);

      // Log raw response headers for debugging
      console.log(`🔍 Response status: ${response.status} ${response.statusText}`);
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log(`🔍 Response headers:`, headers);

      const responseText = await response.text();
      console.log(`🔍 Raw response:`, responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));
      
      let data: any;

      // Try to parse JSON, fallback to text
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error(`❌ JSON parse error:`, e);
        data = { message: responseText };
      }

      if (!response.ok) {
        throw new ApiException(
          data.error || data.message || 'Request failed',
          response.status,
          data
        );
      }

      console.log(`✅ API Response: ${response.status}`, data);
      return data;

    } catch (error) {
      console.error(`❌ API Error: ${config.method} ${url}`, error);
      
      if (error instanceof ApiException) {
        throw error;
      }
      
      // Handle network errors, timeouts, etc.
      throw new ApiException(
        'Network error or request timeout',
        0,
        error
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, requiresAuth = false): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string, 
    body?: any, 
    requiresAuth = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body,
      requiresAuth,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string, 
    body?: any, 
    requiresAuth = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body,
      requiresAuth,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, requiresAuth = false): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
