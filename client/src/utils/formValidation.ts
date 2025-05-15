/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates a list of email addresses
 * @param emails Array of email addresses to validate
 * @returns Object with validation results
 */
export function validateEmails(emails: string[]): {
  valid: boolean;
  invalidEmails: string[];
} {
  const invalidEmails = emails.filter(email => !isValidEmail(email));
  return {
    valid: invalidEmails.length === 0,
    invalidEmails
  };
}

/**
 * Checks if a form is ready to be published
 * @param formFields Array of form fields
 * @returns Object with validation results
 */
export function validateFormForPublishing(formFields: any[]): {
  valid: boolean;
  message?: string;
} {
  if (!formFields || formFields.length === 0) {
    return {
      valid: false,
      message: 'Form must have at least one field'
    };
  }

  // Check if required fields have labels/questions
  const emptyRequiredFields = formFields.filter(
    field => field.required && (!field.title || field.title.trim() === '')
  );

  if (emptyRequiredFields.length > 0) {
    return {
      valid: false,
      message: 'All required fields must have questions or labels'
    };
  }

  return { valid: true };
}
