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

  return (
    <div className="flex-1 flex">
      <div
        className="flex-1 p-8 bg-gray-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      onClick={handleCanvasClick}
      >
        <div 
          className="bg-white rounded-lg min-h-[600px] p-6 border-2 border-dashed border-gray-300"
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
              {selectedFieldId === field.id && <FieldToolbar field={field} />}
            </div>
          ))}
          {fields.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-400">
              Drag and drop form fields here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};