import React, { useState } from 'react';
import type { Field } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface FieldComponentProps {
  field: Field;
  onUpdate?: (updatedField: Field) => void;
}

// Simple UI components to avoid dependencies
const Input = ({ type = 'text', placeholder, value, onChange, className = '' }: any) => (
  <input 
    type={type} 
    placeholder={placeholder} 
    value={value} 
    onChange={onChange} 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Textarea = ({ placeholder, value, onChange, rows = 3, className = '' }: any) => (
  <textarea 
    placeholder={placeholder} 
    value={value} 
    onChange={onChange} 
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
  />
);

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false }: any) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base',
    lg: 'text-lg px-5 py-2.5',
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${sizeClasses[size as keyof typeof sizeClasses]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Label = ({ children, htmlFor, className = '' }: any) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
);



const Checkbox = ({ id, checked, onChange }: { id: string, checked?: boolean, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <input 
    type="checkbox" 
    id={id} 
    checked={checked} 
    onChange={onChange}
    className="mr-2"
  />
);



export const FieldComponent: React.FC<FieldComponentProps> = ({ field, onUpdate }) => {
  const [questionText, setQuestionText] = useState(field.title || '');
  const [options, setOptions] = useState<string[]>(
    field.properties?.options?.map((opt: any) => opt.text) || ['Option 1', 'Option 2']
  );
  const [date, setDate] = useState(field.properties?.date || '');
  const [time, setTime] = useState(field.properties?.time || '');
  const [rating, setRating] = useState<number>(field.properties?.rating || 0);
  const [charCount, setCharCount] = useState(questionText.length || 0);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    setCharCount(value.length);
    if (onUpdate) {
      onUpdate({
        ...field,
        title: value
      });
    }
  };
  
  const handleClear = () => {
    setQuestionText('');
    setCharCount(0);
    if (onUpdate) {
      onUpdate({
        ...field,
        title: ''
      });
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    if (onUpdate) {
      onUpdate({
        ...field,
        properties: {
          ...field.properties,
          date: e.target.value
        }
      });
    }
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    if (onUpdate) {
      onUpdate({
        ...field,
        properties: {
          ...field.properties,
          time: e.target.value
        }
      });
    }
  };
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (onUpdate) {
      onUpdate({
        ...field,
        properties: {
          ...field.properties,
          rating: newRating
        }
      });
    }
  };

  const handleAddOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    setOptions(newOptions);
    if (onUpdate) {
      onUpdate({
        ...field,
        properties: {
          ...field.properties,
          options: newOptions.map((text, i) => ({ id: `option-${i}`, text }))
        }
      });
    }
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (onUpdate) {
      onUpdate({
        ...field,
        properties: {
          ...field.properties,
          options: newOptions.map((text, i) => ({ id: `option-${i}`, text }))
        }
      });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    if (onUpdate) {
      onUpdate({
        ...field,
        properties: {
          ...field.properties,
          options: newOptions.map((text, i) => ({ id: `option-${i}`, text }))
        }
      });
    }
  };

  switch (field.type) {
    case 'date':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="date-question" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="date-question"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Date'}</div>
              <Input 
                type="date" 
                value={date} 
                onChange={handleDateChange} 
              />
            </div>
          </div>
        </div>
      );
    
    case 'time':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="time-question" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="time-question"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Time'}</div>
              <Input 
                type="time" 
                value={time} 
                onChange={handleTimeChange} 
              />
            </div>
          </div>
        </div>
      );
      
    case 'rating':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="rating-question" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="rating-question"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Rating'}</div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
      
    case 'shortAnswer':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="question-text" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="question-text"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Short Answer Question'}</div>
              <Input type="text" placeholder="Short answer text" />
            </div>
          </div>
        </div>
      );
    case 'multipleChoice':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="mc-question-text" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="mc-question-text"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <Label className="font-medium mb-2 block mt-4">Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input 
                type="text" 
                value={option}
                onChange={(e: { target: { value: string; }; }) => handleOptionChange(index, e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddOption} 
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Multiple Choice Question'}</div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input 
                      type="radio" 
                      name="preview-options" 
                      value={`option${index + 1}`} 
                      id={`preview-option${index + 1}`} 
                    />
                    <label htmlFor={`preview-option${index + 1}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    case 'email':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="email-question-text" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="email-question-text"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Email Question'}</div>
              <Input type="email" placeholder="Email address" />
            </div>
          </div>
        </div>
      );
    case 'heading':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="heading-text" className="font-medium mb-2 block">Heading Text</Label>
          <Input 
            id="heading-text"
            type="text" 
            placeholder="Enter heading text" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <h2 className="text-xl font-bold">{questionText || 'Sample Heading'}</h2>
            </div>
          </div>
        </div>
      );
    case 'paragraph':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="paragraph-text" className="font-medium mb-2 block">Paragraph Text</Label>
          <Textarea 
            id="paragraph-text"
            placeholder="Enter paragraph text" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
            rows={4}
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <p className="text-gray-600">{questionText || 'This is a sample paragraph text that would appear in your form.'}</p>
            </div>
          </div>
        </div>
      );
      
    case 'longAnswer':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="long-answer-text" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="long-answer-text"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Long Answer Question'}</div>
              <Textarea 
                placeholder="Type your answer here" 
                rows={4} 
              />
              <div className="flex justify-between items-center mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClear}
                  className="text-blue-500"
                >
                  Clear
                </Button>
                <span className="text-sm text-gray-500">{charCount} / 100</span>
              </div>
            </div>
          </div>
        </div>
      );
    case 'dropdown':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="dropdown-question-text" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="dropdown-question-text"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <Label className="font-medium mb-2 block mt-4">Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input 
                type="text" 
                value={option}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOptionChange(index, e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
              >
                <span className="text-red-500">✕</span>
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddOption} 
            className="mt-2"
          >
            <span className="mr-2">+</span> Add Option
          </Button>
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Dropdown Question'}</div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">  
                <option value="" disabled>Select an option</option>
                {options.map((option, index) => (
                  <option key={index} value={`option${index + 1}`}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      );
    case 'pictureChoice':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="picture-question-text" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="picture-question-text"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <Label className="font-medium mb-2 block mt-4">Image Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input 
                type="text" 
                value={option}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOptionChange(index, e.target.value)}
                className="flex-1"
                placeholder={`Label for Image ${index + 1}`}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
              >
                <span className="text-red-500">✕</span>
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddOption} 
            className="mt-2"
          >
            <span className="mr-2">+</span> Add Image Option
          </Button>
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Picture Choice Question'}</div>
              <div className="grid grid-cols-2 gap-2">
                {options.map((option, index) => (
                  <div key={index} className="border p-2 rounded flex flex-col items-center">
                    <div className="bg-gray-200 w-full h-16 mb-2 flex items-center justify-center">
                      Image {index + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`preview-image${index + 1}`} />
                      <label htmlFor={`preview-image${index + 1}`}>{option}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    case 'slider':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="slider-question" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="slider-question"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText || 'Slider'}</div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={field.properties?.sliderValue || 50} 
                className="w-full"
              />
            </div>
          </div>
        </div>
      );
      
    default:
      return <div>Unknown field type: {field.type}</div>;
  }
};