import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CustomFormField {
  id: string;
  type: string;
  label: string;
  title?: string; // add title for UI compatibility
  required: boolean;
  options?: string[];
  properties?: Record<string, any>; // Added to match the Field interface
}

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

const customFormSlice = createSlice({
  name: 'customForm',
  initialState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    setFields(state, action: PayloadAction<CustomFormField[]>) {
      state.fields = action.payload;
    },
    addField(state, action: PayloadAction<CustomFormField>) {
      state.fields.push(action.payload);
    },
    updateField(state, action: PayloadAction<{ id: string; field: Partial<CustomFormField> }>) {
      const idx = state.fields.findIndex(f => f.id === action.payload.id);
      if (idx !== -1) {
        state.fields[idx] = { ...state.fields[idx], ...action.payload.field };
      }
    },
    removeField(state, action: PayloadAction<string>) {
      state.fields = state.fields.filter(f => f.id !== action.payload);
    },
    resetForm(state) {
      state.title = '';
      state.description = '';
      state.fields = [];
    },
  },
});

export const { setTitle, setDescription, setFields, addField, updateField, removeField, resetForm } = customFormSlice.actions;
export default customFormSlice.reducer;
