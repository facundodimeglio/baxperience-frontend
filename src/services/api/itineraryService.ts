/**
 * Itinerary Service
 * Handles personalized itinerary generation
 */

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { GenerateItineraryRequest, GenerateItineraryResponse } from './types';

/**
 * Itinerary Service Class
 */
class ItineraryService {
  /**
   * Generate personalized itinerary
   */
  async generatePersonalizedItinerary(requestData: GenerateItineraryRequest): Promise<GenerateItineraryResponse> {
    try {
      console.log('🤖 Generating personalized itinerary:', requestData);
      
      const response = await apiClient.post<GenerateItineraryResponse>(
        API_CONFIG.ENDPOINTS.ITINERARY.GENERATE,
        requestData,
        true // requires auth
      );

      console.log('✅ Itinerary generated successfully:', response);
      return response as GenerateItineraryResponse;
    } catch (error) {
      console.error('❌ Generate itinerary error:', error);
      throw error;
    }
  }

  /**
   * Confirm and save itinerary to database
   */
  async confirmItinerary(itineraryData: any): Promise<any> {
    try {
      console.log('💾 Confirming itinerary:', itineraryData);
      
      const response = await apiClient.post<any>(
        API_CONFIG.ENDPOINTS.ITINERARY.CONFIRM,
        itineraryData,
        true // requires auth
      );

      console.log('✅ Itinerary confirmed successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Confirm itinerary error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const itineraryService = new ItineraryService();
