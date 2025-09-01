/**
 * API Types
 * TypeScript interfaces for all API requests and responses
 */

// Base API Response
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  success?: boolean;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    fechaRegistro: string;
  };
  token: string;
}

export interface RegisterRequest {
  // Basic auth fields
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  username: string;
  
  // Profile fields
  fechaNacimiento: string; // ISO date string
  paisOrigen: string;
  ciudadOrigen: string;
  idiomaPreferido: string;
  telefono: string;
  tipoViajero: string;
  genero: string;
  
  // Preferences
  preferencias: number[] | string[]; // Array of preference IDs
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
  };
  token: string;
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  username?: string;
  fechaNacimiento?: string;
  paisOrigen?: string;
  ciudadOrigen?: string;
  idiomaPreferido?: string;
  telefono?: string;
  tipoViajero?: string;
  genero?: string;
  fechaRegistro: string;
}

export interface UserProfile extends User {
  preferencias?: string[];
}

// Error Types
export interface ApiError {
  error: string;
  details?: any;
  statusCode?: number;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request Config
export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

// Itinerary Generation Types
export interface GenerateItineraryRequest {
  name: string; // Trip name
  fecha_visita: string; // Format: YYYY-MM-DD
  hora_inicio: string; // Format: HH:MM
  duracion_horas: number; // Between 1 and 12
  longitud_origen: number; // Origin longitude coordinate
  latitud_origen: number; // Origin latitude coordinate
  zona_preferida?: string; // Optional: Preferred neighborhood  
  ubicacion_direccion?: string; // Optional: Literal address description
}

export interface GeneratedItineraryActivity {
  id: number;
  nombre: string;
  tipo: string;
  hora_inicio: string;
  hora_fin: string;
  direccion?: string;
  descripcion?: string;
  precio_estimado?: number;
}

export interface GenerateItineraryResponse {
  message: string;
  request_id: string;
  itinerario_propuesto: {
    nombre: string;
    fecha_visita: string;
    hora_inicio: string;
    duracion_horas: number;
    ubicacion_origen: {
      latitud: number;
      longitud: number;
      direccion?: string; // Dirección literal para mostrar al usuario
    };
    zona_preferida?: string;
    actividades: GeneratedItineraryActivity[];
    preferencias_usadas: {
      categorias?: string[];
      zona?: string;
    };
    metadata: {
      processing_time_seconds?: number;
      timestamp: string;
    };
  };
}

