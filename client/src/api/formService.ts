import axios from 'axios';
import { getErrorMessage } from '../utils/apiHelpers';

// Define the base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Types
export interface PublishFormResponse {
  formId: string;
  accessToken: string;
  adminLink: string;
  recipients: {
    email: string;
    token: string;
    link: string;
  }[];
}

// Form API service
const formService = {
  /**
   * Publish a form to multiple email recipients
   * @param formId The ID of the form to publish
   * @param emails Array of email addresses to send the form to
   * @returns Promise with the publish response data
   */
  publishForm: async (formId: string, emails: string[]): Promise<PublishFormResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/forms/${formId}/publish`, {
        emails
      });
      return response.data;
    } catch (error) {
      console.error('Error publishing form:', error);
      // Convert to a more user-friendly error message
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Create a new form
   * @param formData The form data to create
   * @returns Promise with the created form data
   */
  createForm: async (formData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/forms/create`, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  },

  /**
   * Get a form by ID
   * @param formId The ID of the form to retrieve
   * @param token Optional access token for admin access
   * @returns Promise with the form data
   */
  getForm: async (formId: string, token?: string) => {
    try {
      const url = token 
        ? `${API_BASE_URL}/api/forms/${formId}?token=${token}`
        : `${API_BASE_URL}/api/forms/${formId}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  },

  /**
   * Submit a form response
   * @param formId The ID of the form to submit
   * @param responseData The response data to submit
   * @returns Promise with the submission response
   */
  submitForm: async (formId: string, responseData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/forms/${formId}/submit`, responseData);
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  }
};

export default formService;
