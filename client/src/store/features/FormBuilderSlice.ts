import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Field } from "../../types";
import type { RootState } from "../store";

/**
 * State shape for the form builder slice
 * Manages UI state and fields for the form builder interface
 */
interface FormBuilderState {
  fields: Field[];
  draggedField: string | null;
  selectedField: string | null;
  selectedFieldId: string | null;
}

const initialState: FormBuilderState = {
  fields: [],
  draggedField: null,
  selectedField: null,
  selectedFieldId: null,
};

/**
 * Form builder slice for managing form building UI and interactions
 */
export const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setDraggedField: (state, action: PayloadAction<string | null>) => {
      state.draggedField = action.payload;
    },
    addField: (state, action: PayloadAction<Field>) => {
      state.fields.push(action.payload);
    },
    selectField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(field => field.id !== action.payload);
      if (state.selectedFieldId === action.payload) {
        state.selectedFieldId = null;
      }
    },
    duplicateField: (state, action: PayloadAction<string>) => {
      const fieldToDuplicate = state.fields.find(field => field.id === action.payload);
      if (fieldToDuplicate) {
        const newField = { 
          ...fieldToDuplicate, 
          id: Date.now().toString() 
        };
        const index = state.fields.findIndex(field => field.id === action.payload);
        state.fields.splice(index + 1, 0, newField);
      }
    },
    reorderFields: (state, action: PayloadAction<Field[]>) => {
      state.fields = action.payload;
    },
    setFields: (state, action: PayloadAction<Field[]>) => {
      state.fields = action.payload;
    },
    updateField: (state, action: PayloadAction<{ id: string; field: Partial<Field> }>) => {
      const idx = state.fields.findIndex(f => f.id === action.payload.id);
      if (idx !== -1) {
        state.fields[idx] = { ...state.fields[idx], ...action.payload.field };
      }
    },
    resetFormBuilder: () => {
      return initialState; // Use initialState directly for a cleaner reset
    }
  },
});

// Selectors
export const selectFormBuilder = (state: RootState) => state.formBuilder;
export const selectFormBuilderFields = (state: RootState) => state.formBuilder.fields;
export const selectDraggedField = (state: RootState) => state.formBuilder.draggedField;
export const selectSelectedFieldId = (state: RootState) => state.formBuilder.selectedFieldId;

// Memoized selector for finding a field by ID
export const selectFormBuilderFieldById = createSelector(
  [selectFormBuilderFields, (_, fieldId: string) => fieldId],
  (fields, fieldId) => fields.find(field => field.id === fieldId)
);

export const { 
  setDraggedField, 
  addField, 
  selectField, 
  deleteField, 
  duplicateField,
  reorderFields,
  setFields,
  updateField,
  resetFormBuilder
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;