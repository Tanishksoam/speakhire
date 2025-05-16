import { apiSlice } from '../../api/apiSlice';

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  _id: string;
  title: string;
  description: string;
  formFields: FormField[];
  isPublished: boolean;
  publishedUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const formApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<Form[], void>({
      query: () => '/forms',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Form' as const, id: _id })),
              { type: 'Form', id: 'LIST' },
            ]
          : [{ type: 'Form', id: 'LIST' }],
    }),
    
    getFormById: builder.query<Form, string>({
      query: (id) => `/forms/owned/${id}`,
      providesTags: (_, __, id) => [{ type: 'Form', id }],
    }),
    
    getPublicForm: builder.query<Form, string>({
      query: (uniqueId) => `/forms/f/${uniqueId}`,
    }),
    
    createForm: builder.mutation<Form, Partial<Form>>({
      query: (form) => ({
        url: '/forms',
        method: 'POST',
        body: form,
      }),
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),
    
    updateForm: builder.mutation<Form, { id: string; form: Partial<Form> }>({
      query: ({ id, form }) => ({
        url: `/forms/${id}`,
        method: 'PUT',
        body: form,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Form', id }],
    }),
    
    publishForm: builder.mutation<{ publishedUrl: string }, string>({
      query: (id) => ({
        url: `/forms/${id}/publish`,
        method: 'PUT',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Form', id }],
    }),
    
    unpublishForm: builder.mutation<void, string>({
      query: (id) => ({
        url: `/forms/${id}/unpublish`,
        method: 'PUT',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Form', id }],
    }),
    
    deleteForm: builder.mutation<void, string>({
      query: (id) => ({
        url: `/forms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormByIdQuery,
  useGetPublicFormQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  usePublishFormMutation,
  useUnpublishFormMutation,
  useDeleteFormMutation,
} = formApiSlice;