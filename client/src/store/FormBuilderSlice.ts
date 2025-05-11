import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {Field} from "../types";

interface FormBuilderState{
    fields: Field[];
    draggedField:string|null;
    selectedField:string|null;
    selectedFieldId:string|null;
};

const initialState: FormBuilderState = {
  fields: [],
  draggedField: null,
    selectedField: null,
  selectedFieldId: null,
};

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
    }
  },
});

export const { 
  setDraggedField, 
  addField, 
  selectField, 
  deleteField, 
  duplicateField,
  reorderFields 
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;