// API service for making HTTP requests to the backend

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust this to match your server URL

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // If the server response was not ok, throw an error with the response data
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }
  
  return data;
};

// API service object with methods for different API calls
const apiService = {
  // Auth endpoints
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    },
    register: async (userData: { name: string; email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    getCurrentUser: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    },
  },
  
  // Form endpoints
  forms: {
    createForm: async (formData: any) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/forms`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      return handleResponse(response);
    },
    
    publishForm: async (formId: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/forms/${formId}/publish`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    },
    
    getFormById: async (formId: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/forms/${formId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    },
    
    getUserForms: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/forms/user`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    },
    
    updateForm: async (formId: string, formData: any) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/forms/${formId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      return handleResponse(response);
    },
    
    deleteForm: async (formId: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/forms/${formId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    },
  },
  
  // Response endpoints
  responses: {
    submitResponse: async (formId: string, responseData: any) => {
      const response = await fetch(`${API_BASE_URL}/responses/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData),
      });
      return handleResponse(response);
    },
    
    getFormResponses: async (formId: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/responses/${formId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    },
  }
};

export default apiService;
