import React from 'react';
import { useDispatch } from 'react-redux';
import { setDraggedField, addField } from '../../store/features/FormBuilderSlice';
import type  { FieldCategory, FieldType } from '../../types';
import { Card, CardContent } from "@/components/ui/card";

const fieldCategories: FieldCategory[] = [
  {
    title: 'Frequently Used',
    fields: [
      { type: 'shortAnswer', label: 'Short Answer', icon: 'pencil-alt' },
      { type: 'multipleChoice', label: 'Multiple Choice', icon: 'list-ul' },
      { type: 'email', label: 'Email Input', icon: 'envelope' },
    ],
  },
  {
    title: 'Display Text',
    fields: [
      { type: 'heading', label: 'Heading', icon: 'heading' },
      { type: 'paragraph', label: 'Paragraph', icon: 'paragraph' },
    ],
  },
  {
    title: 'Choices',
    fields: [
      { type: 'dropdown', label: 'Dropdown', icon: 'caret-square-down' },
      { type: 'pictureChoice', label: 'Picture Choice', icon: 'images' },
    ],
  },
];

export const FieldSelector: React.FC = () => {
  const dispatch = useDispatch();

  const handleDragStart = (fieldType: FieldType) => {
    dispatch(setDraggedField(fieldType));
  };

 

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Form Fields</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {fieldCategories.map((category) => (
            <div key={category.title} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.fields.map((field) => (
                  <Card 
                    key={field.type}
                    draggable
                    onDragStart={() => handleDragStart(field.type)}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <CardContent className="p-3 flex items-center">
                      <i className={`fas fa-${field.icon} mr-2`}></i>
                      {field.label}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
