import axios, { AxiosError } from 'axios';

/**
 * Helper function to extract error messages from API responses
 * @param error The error object from axios
 * @returns A user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Check for server response with error message
    if (axiosError.response?.data) {
      const data = axiosError.response.data as any;
      if (data.message) {
        return data.message;
      }
      if (data.error) {
        return data.error;
      }
    }
    
    // Check for network errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection and try again.';
    }
    
    // Default error message based on status code
    if (axiosError.response?.status) {
      switch (axiosError.response.status) {
        case 400:
          return 'Invalid request. Please check your data and try again.';
        case 401:
          return 'Authentication required. Please log in.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Error: ${axiosError.response.status}`;
      }
    }
  }
  
  // For non-axios errors
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred. Please try again.';
}
