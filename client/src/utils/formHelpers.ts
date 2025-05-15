import type { CustomFormField } from '../store/features/customFormSlice';

/**
 * Formats form data from the Redux store to be sent to the server
 * @param title Form title
 * @param description Form description
 * @param fields Form fields from the Redux store
 * @returns Formatted form data ready to be sent to the server
 */
export function formatFormForSubmission(
  title: string,
  description: string,
  fields: CustomFormField[]
) {
  return {
    title,
    description,
    formFields: fields.map(field => ({
      id: field.id,
      type: field.type,
      label: field.label || field.title || '',
      required: field.required,
      options: field.options || [],
      properties: field.properties || {}
    }))
  };
}

/**
 * Generates a shareable form link
 * @param formId The ID of the form
 * @param token Optional access token for the form
 * @returns A shareable URL for the form
 */
export function generateFormLink(formId: string, token?: string) {
  const baseUrl = window.location.origin;
  const url = new URL(`${baseUrl}/forms/${formId}`);
  
  if (token) {
    url.searchParams.append('token', token);
  }
  
  return url.toString();
}

/**
 * Generates an admin link for form management
 * @param formId The ID of the form
 * @param adminToken The admin access token for the form
 * @returns An admin URL for managing the form
 */
export function generateAdminLink(formId: string, adminToken: string) {
  const baseUrl = window.location.origin;
  const url = new URL(`${baseUrl}/forms/${formId}/admin`);
  url.searchParams.append('token', adminToken);
  
  return url.toString();
}
