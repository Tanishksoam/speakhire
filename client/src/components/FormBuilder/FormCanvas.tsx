import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { addField, selectField, setDraggedField, setFields } from '../../store/features/FormBuilderSlice';
import { addField as addCustomField } from '../../store/features/customFormSlice';
import { FieldToolbar } from './FieldToolbar';
import { FieldComponent } from './FiledComponent';

export const FormCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const { fields, draggedField, selectedFieldId } = useSelector((state: RootState) => state.formBuilder);
  const customFormFields = useSelector((state: RootState) => state.customForm.fields);
  
  // Sync fields from customForm to formBuilder ONLY on component mount
  // This prevents infinite update loops while still ensuring persistence
  useEffect(() => {
    // Only run this effect once on mount
    if (customFormFields.length > 0 && fields.length > 0) {
      // Check if fields actually need updating to avoid unnecessary dispatches
      let needsUpdate = false;
      
      const updatedFields = fields.map(field => {
        const customField = customFormFields.find(cf => cf.id === field.id);
        if (customField) {
          const newTitle = customField.title || customField.label || field.title;
          const newLabel = customField.label || customField.title || field.label;
          
          if (newTitle !== field.title || newLabel !== field.label) {
            needsUpdate = true;
            return {
              ...field,
              title: newTitle,
              label: newLabel
            };
          }
        }
        return field;
      });
      
      // Only dispatch if there are actual changes
      if (needsUpdate) {
        dispatch(setFields(updatedFields));
      }
    }
  }, []); // Empty dependency array = run only on mount

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedField) {
      const newFieldId = Date.now().toString();
      
      // Generate default title and label based on field type
      const getDefaultTitleAndLabel = (fieldType: string) => {
        switch(fieldType) {
          case 'text':
            return 'Text Question';
          case 'textarea':
            return 'Long Answer Question';
          case 'number':
            return 'Number Question';
          case 'select':
            return 'Dropdown Question';
          case 'radio':
          case 'multipleChoice':
            return 'Multiple Choice Question';
          case 'checkbox':
            return 'Checkbox Question';
          case 'date':
            return 'Date Question';
          case 'time':
            return 'Time Question';
          case 'email':
            return 'Email Question';
          case 'tel':
            return 'Phone Number Question';
          case 'url':
            return 'Website URL Question';
          case 'file':
            return 'File Upload Question';
          default:
            return `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Question`;
        }
      };
      
      const defaultTitle = getDefaultTitleAndLabel(draggedField);
      
      // Create default properties based on field type
      let properties = {};
      
      // Add default options for multiple choice, radio, checkbox, and dropdown fields
      if (draggedField === 'multipleChoice' || draggedField === 'radio' || draggedField === 'checkbox' || draggedField === 'select') {
        properties = {
          options: [
            { id: 'option-1', text: 'Option 1' },
            { id: 'option-2', text: 'Option 2' },
            { id: 'option-3', text: 'Option 3' }
          ]
        };
      }
      
      const newField = {
        type: draggedField,
        id: newFieldId,
        title: defaultTitle,
        label: defaultTitle,
        properties: properties
      };
      
      // Add to formBuilder slice
      dispatch(addField(newField));
      
      // Also add to customForm slice for persistence
      dispatch(addCustomField({
        id: newFieldId,
        type: draggedField,
        label: defaultTitle,
        title: defaultTitle,
        required: false,
        properties: properties
      }));
      
      dispatch(setDraggedField(null));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCanvasClick = () => {
    dispatch(selectField(null));
  };

  // Find the selected field for the toolbar
  const selectedField = fields.find(field => field.id === selectedFieldId);

  return (
    <div className="flex-1 p-8 bg-gray-200 h-full relative">
      {/* Main canvas area */}
      <div
        className="bg-white rounded-lg max-w-3xl mx-auto p-6 border-2 border-dashed border-gray-300 h-[calc(100vh-140px)]"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC', overflowY: 'auto', overflowX: 'hidden' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleCanvasClick}
      >
        {fields.map((field) => (
          <div
            key={field.id}
            className={`mb-4 p-4 border rounded-lg relative flex items-center ${
              selectedFieldId === field.id ? "border-blue-500" : "border-gray-200"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(selectField(field.id));
            }}
          >
            <div className="flex-1">
              <FieldComponent field={field} />
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400">
            Drag and drop form fields here
          </div>
        )}
      </div>
      
      {/* Toolbar positioned in the gray area outside the form */}
      {selectedField && (
        <div className="absolute right-8 top-1/4">
          <FieldToolbar field={selectedField} />
        </div>
      )}
    </div>
  );
};