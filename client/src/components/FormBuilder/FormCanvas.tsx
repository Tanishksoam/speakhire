import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { addField, selectField, setDraggedField } from '../../store/features/FormBuilderSlice';
import { FieldToolbar } from './FieldToolbar';
import  { FieldComponent } from './FiledComponent';

export const FormCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const { fields, draggedField, selectedFieldId } = useSelector((state: RootState) => state.formBuilder);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedField) {
      dispatch(addField({ 
        type: draggedField, 
        id: Date.now().toString() 
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