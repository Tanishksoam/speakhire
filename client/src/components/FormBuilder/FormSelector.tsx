import React from 'react';
import { useDispatch } from 'react-redux';
import { setDraggedField } from '../../store/features/FormBuilderSlice';
import type  { FieldCategory, FieldType } from '../../types';
import { 
  Pencil, 
  List, 
  Mail, 
  AlignLeft, 
  Heading, 
  Text, 
  ChevronDown, 
  Image, 
  Calendar, 
  Clock, 
  Star, 
  Sliders 
} from 'lucide-react';



const getIconComponent = (iconType: string) => {
  const iconMap = {
    'pencil-alt': Pencil,
    'list-ul': List,
    'envelope': Mail,
    'align-left': AlignLeft,
    'heading': Heading,
    'paragraph': Text,
    'caret-square-down': ChevronDown,
    'images': Image,
    'calendar': Calendar,
    'clock': Clock,
    'star': Star,
    'sliders-h': Sliders
  };

   const IconComponent = iconMap[iconType as keyof typeof iconMap] || Pencil;
  return IconComponent;
};

const fieldCategories: FieldCategory[] = [
  {
    title: 'Frequently Used',
    fields: [
      { type: 'shortAnswer', label: 'Short Answer', icon: 'pencil-alt' },
      { type: 'multipleChoice', label: 'Multiple Choice', icon: 'list-ul' },
      { type: 'email', label: 'Email Input', icon: 'envelope' },
      { type: 'longAnswer', label: 'Long Answer', icon: 'align-left' },
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
  {
    title: 'Date & Time',
    fields: [
      { type: 'date', label: 'Date', icon: 'calendar' },
      { type: 'time', label: 'Time', icon: 'clock' },
    ],
  },
  {
    title: 'Rating & Scale',
    fields: [
      { type: 'rating', label: 'Rating', icon: 'star' },
      { type: 'slider', label: 'Slider', icon: 'sliders-h' },
    ],
  },
];

export const FieldSelector: React.FC = () => {
  const dispatch = useDispatch();

  const handleDragStart = (fieldType: FieldType) => {
    dispatch(setDraggedField(fieldType));
  };

 

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Form Fields</h2>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC' }}>
        <div className="p-4">
          {fieldCategories.map((category) => (
            <div key={category.title} className="mb-6">
              <h3 className="text-base font-medium text-gray-600 mb-3">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.fields.map((field) => {
                  const IconComponent = getIconComponent(field.icon);
                  return (
                  <div
                    key={field.type}
                    draggable
                    onDragStart={() => handleDragStart(field.type)}
                    className="cursor-pointer hover:bg-gray-100 transition-colors mb-3 p-3 rounded-lg bg-gray-50 flex items-center"
                  >
                    <div className="w-8 h-8 flex items-center justify-center mr-3 text-lg">
                      <IconComponent size={20} />
                    </div>
                    <span className="font-medium">{field.label}</span>
                  </div>
                )})}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
