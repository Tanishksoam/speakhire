import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for our API responses
interface Form {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  formFields: any[];
  isPublished: boolean;
  publishedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface PublishFormResponse {
  message: string;
  form: {
    id: string;
    title: string;
    isPublished: boolean;
    publishedUrl: string;
  };
}

// Create the API slice with endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      // Get token from localStorage since auth slice isn't fully implemented yet
      // This is a temporary solution until the auth slice is properly implemented
      const token = localStorage.getItem('token');
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Form', 'Response'],
  endpoints: (builder) => ({
    // Get all forms for the current user
    getUserForms: builder.query<Form[], void>({
      query: () => '/forms/user',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Form' as const, id: _id })),
              { type: 'Form', id: 'LIST' },
            ]
          : [{ type: 'Form', id: 'LIST' }],
    }),
    
    // Get a single form by ID
    getFormById: builder.query<Form, string>({
      query: (id) => `/forms/${id}`,
      providesTags: (_, __, id) => [{ type: 'Form', id }],
    }),
    
    // Create a new form
    createForm: builder.mutation<Form, Partial<Form>>({
      query: (formData) => ({
        url: '/forms',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),
    
    // Update an existing form
    updateForm: builder.mutation<Form, { id: string; formData: Partial<Form> }>({
      query: ({ id, formData }) => ({
        url: `/forms/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Form', id }],
    }),
    
    // Publish a form
    publishForm: builder.mutation<PublishFormResponse, string>({
      query: (id) => ({
        url: `/forms/${id}/publish`,
        method: 'PUT',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Form', id }],
    }),
    
    // Delete a form
    deleteForm: builder.mutation<{ message: string; formId: string }, string>({
      query: (id) => ({
        url: `/forms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),
  }),
});

// Export the auto-generated hooks for the endpoints
export const {
  useGetUserFormsQuery,
  useGetFormByIdQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  usePublishFormMutation,
  useDeleteFormMutation,
} = apiSlice;