import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * Represents a field in a custom form
 */
export interface CustomFormField {
  id: string;
  type: string;
  label: string;
  title?: string; // Title for UI compatibility
  required: boolean;
  options?: string[];
  properties?: Record<string, any>; // For extended field properties
}

/**
 * State shape for the custom form slice
 */
export interface CustomFormState {
  title: string;
  description: string;
  fields: CustomFormField[];
}

const initialState: CustomFormState = {
  title: '',
  description: '',
  fields: [],
};

/**
 * Custom form slice for managing form data
 */
const customFormSlice = createSlice({
  name: 'customForm',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setFields: (state, action: PayloadAction<CustomFormField[]>) => {
      state.fields = action.payload;
    },
    addField: (state, action: PayloadAction<CustomFormField>) => {
      state.fields.push(action.payload);
    },
    updateField: (state, action: PayloadAction<{ id: string; field: Partial<CustomFormField> }>) => {
      const idx = state.fields.findIndex(f => f.id === action.payload.id);
      if (idx !== -1) {
        state.fields[idx] = { ...state.fields[idx], ...action.payload.field };
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(f => f.id !== action.payload);
    },
    resetForm: () => {
      return initialState; // Use the initialState directly for a cleaner reset
    },
  },
});

// Selectors
export const selectCustomForm = (state: RootState) => state.customForm;
export const selectCustomFormTitle = (state: RootState) => state.customForm.title;
export const selectCustomFormDescription = (state: RootState) => state.customForm.description;
export const selectCustomFormFields = (state: RootState) => state.customForm.fields;

// Memoized selector for finding a field by ID
export const selectFieldById = createSelector(
  [selectCustomFormFields, (_, fieldId: string) => fieldId],
  (fields, fieldId) => fields.find(field => field.id === fieldId)
);

export const { 
  setTitle, 
  setDescription, 
  setFields, 
  addField, 
  updateField, 
  removeField, 
  resetForm 
} = customFormSlice.actions;

export default customFormSlice.reducer;
