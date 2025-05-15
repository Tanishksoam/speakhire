import React, { useState, useCallback } from 'react';
import type { Field } from '../../types';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateField } from '../../store/features/customFormSlice';

interface FieldComponentProps {
  field: Field;
  onUpdate?: (updatedField: Field) => void;
}

// Validation interface
interface ValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  // Error messages are now handled automatically
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
  const dispatch = useDispatch();
  
  // Add local state for immediate preview updates - we need this for smooth typing
  const [questionText, setQuestionText] = useState(field.title || '');
  const [options, setOptions] = useState<string[]>(
    field.properties?.options?.map((opt: any) => opt.text) || ['Option 1', 'Option 2']
  );
  const [date, setDate] = useState(field.properties?.date || '');
  const [time, setTime] = useState(field.properties?.time || '');
  const [rating, setRating] = useState<number>(field.properties?.rating || 0);
  const [charCount, setCharCount] = useState((field.title || '').length);
  const [longAnswerText, setLongAnswerText] = useState(field.properties?.previewText || '');
  
  // Sync field title to local state when it changes from external sources
  React.useEffect(() => {
    // Only update local state if it's different from Redux state and the input isn't focused
    if (field.title !== questionText && !document.activeElement?.id?.includes('question-text')) {
      setQuestionText(field.title || '');
      setCharCount((field.title || '').length);
    }
  }, [field.title]);



  // Validation states
  const [isRequired, setIsRequired] = useState(field.required || false);
  const [minLength, setMinLength] = useState(field.properties?.validation?.minLength || '');
  const [maxLength, setMaxLength] = useState(field.properties?.validation?.maxLength || '');
  const [minValue, setMinValue] = useState(field.properties?.validation?.min || '');
  const [maxValue, setMaxValue] = useState(field.properties?.validation?.max || '');
  const [pattern, setPattern] = useState(field.properties?.validation?.pattern || '');
  const [showValidationOptions, setShowValidationOptions] = useState(false);

  const handleQuestionChange = useCallback((value: string) => {
    // Update local state first for real-time feedback
    setQuestionText(value);
    setCharCount(value.length);
    
    // Then update Redux store (throttled to avoid performance issues)
    dispatch(updateField({ 
      id: field.id, 
      field: { 
        title: value, 
        label: value 
      } 
    }));
    
    // Also notify parent if callback exists
    if (onUpdate) {
      onUpdate({
        ...field,
        title: value,
        label: value
      });
    }
  }, [field.id, dispatch, onUpdate]);

  
  const handleClear = () => {
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

  // Validation handlers
  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsRequired(isChecked);
    if (onUpdate) {
      onUpdate({
        ...field,
        required: isChecked
      });
    }
  };

  const handleValidationChange = (property: string, value: string | number) => {
    // Prevent negative values for length and numeric properties
    if (['minLength', 'maxLength', 'min', 'max'].includes(property)) {
      const numValue = Number(value);
      if (numValue < 0) {
        // If negative, set to 0 or ignore
        value = 0;
      }
    }
  
    // Convert empty strings to undefined to avoid validation issues
    const processedValue = value === '' ? undefined : 
                          typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value;
  
    let updatedValidation = {
      ...(field.properties?.validation || {}),
      [property]: processedValue
    };
  
    // Clean up empty values
    Object.keys(updatedValidation).forEach(key => {
      if (updatedValidation[key] === '' || updatedValidation[key] === undefined) {
        delete updatedValidation[key];
      }
    });
  
    // Create a new properties object with the updated validation
    const updatedProperties = {
      ...field.properties,
      validation: updatedValidation
    };
  
    // Update the field with the new properties
    if (onUpdate) {
      onUpdate({
        ...field,
        properties: updatedProperties
      });
    }
  
    // Update local state
    switch (property) {
      case 'minLength':
        // Ensure we don't set negative values in state
        setMinLength(Number(value) < 0 ? '0' : value as string);
        break;
      case 'maxLength':
        setMaxLength(Number(value) < 0 ? '0' : value as string);
        break;
      case 'min':
        setMinValue(Number(value) < 0 ? '0' : value as string);
        break;
      case 'max':
        setMaxValue(Number(value) < 0 ? '0' : value as string);
        break;
      case 'pattern':
        setPattern(value as string);
        break;
    }
  
    // Log the updated validation for debugging
    console.log(`Updated ${property} validation:`, updatedValidation);
  };

  // Validation options UI
  const renderValidationOptions = () => {
    // For email fields, automatically apply validation without showing the button
    if (field.type === 'email') {
      // Automatically set the pattern for email validation
      if (!field.properties?.validation?.pattern) {
        setTimeout(() => {
          handleValidationChange('pattern', '^[\\w-\\.]+@gmail\\.com$');
          // Error message is handled automatically by the system
        }, 0);
      }
      return (
        <div className="mt-4">
          <p className="text-xs text-gray-500">Emails must end with @gmail.com</p>
        </div>
      );
    }

    // For short answer fields, apply validation with customization option
    if (field.type === 'shortAnswer') {
      // Apply sensible defaults for text input validation if not already set
      setTimeout(() => {
        // Make sure validation properties exist
        if (!field.properties) {
          if (onUpdate) {
            onUpdate({
              ...field,
              properties: { validation: {} }
            });
          }
        }
      }, 0);
      
      // Show simplified validation UI when options are hidden
      if (!showValidationOptions) {
        return (
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              {isRequired ? 'Required field' : 'Optional field'}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowValidationOptions(true)}
              className="mt-2 text-blue-600"
            >
              <AlertCircle className="h-4 w-4 mr-2" /> Customize Validation
            </Button>
          </div>
        );
      }
    }
    
    // For other field types, show the validation button
    if (!showValidationOptions) {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowValidationOptions(true)}
          className="mt-4 text-blue-600"
        >
          <AlertCircle className="h-4 w-4 mr-2" /> Add Validation Rules
        </Button>
      );
    }

    return (
      <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <Label className="font-medium">Validation Rules</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowValidationOptions(false)}
          >
            Hide
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <Checkbox 
              id={`required-${field.id}`} 
              checked={isRequired}
              onChange={handleRequiredChange}
            />
            <Label htmlFor={`required-${field.id}`} className="ml-2">Required field</Label>
          </div>

          {(field.type === 'longAnswer' || field.type === 'email') && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`min-length-${field.id}`}>Min Length</Label>
                  <Input 
                    id={`min-length-${field.id}`}
                    type="number"
                    min="0" 
                    value={minLength}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleValidationChange('minLength', e.target.value)}
                    placeholder="Min characters"
                  />
                </div>
                <div>
                  <Label htmlFor={`max-length-${field.id}`}>Max Length</Label>
                  <Input 
                    id={`max-length-${field.id}`}
                    type="number"
                    min="0" 
                    value={maxLength}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleValidationChange('maxLength', e.target.value)}
                    placeholder="Max characters"
                  />
                </div>
              </div>
            </>
          )}

          {field.type === 'email' && (
            <div>
              <Label htmlFor={`pattern-${field.id}`}>Email Pattern</Label>
              <Input 
                id={`pattern-${field.id}`}
                type="text" 
                value={pattern || '^[\\w-\\.]+@gmail\\.com$'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleValidationChange('pattern', e.target.value)}
                placeholder="Regex pattern"
                disabled={true}
              />
              <p className="text-xs text-gray-500 mt-1">Only Gmail addresses (@gmail.com) are accepted</p>
            </div>
          )}

          {field.type === 'number' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`min-value-${field.id}`}>Min Value</Label>
                <Input 
                  id={`min-value-${field.id}`}
                  type="number"
                  min="0" 
                  value={minValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleValidationChange('min', e.target.value)}
                  placeholder="Minimum"
                />
              </div>
              <div>
                <Label htmlFor={`max-value-${field.id}`}>Max Value</Label>
                <Input 
                  id={`max-value-${field.id}`}
                  type="number"
                  min="0" 
                  value={maxValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleValidationChange('max', e.target.value)}
                  placeholder="Maximum"
                />
              </div>
            </div>
          )}

          {field.type === 'date' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`min-date-${field.id}`}>Min Date</Label>
                <Input 
                  id={`min-date-${field.id}`}
                  type="date" 
                  value={minValue as string}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleValidationChange('min', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`max-date-${field.id}`}>Max Date</Label>
                <Input 
                  id={`max-date-${field.id}`}
                  type="date" 
                  value={maxValue as string}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleValidationChange('max', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Error messages are now handled automatically by the system */}
        </div>
      </div>
    );
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
                handleQuestionChange(e.currentTarget.value);
              }
            }}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText}</div>
              <Input 
                type="date" 
                value={date} 
                onChange={handleDateChange} 
              />
            </div>
          </div>
          {renderValidationOptions()}
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
                handleQuestionChange(e.currentTarget.value);
              }
            }}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText}</div>
              <Input 
                type="time" 
                value={time} 
                onChange={handleTimeChange} 
              />
            </div>
          </div>
          {renderValidationOptions()}
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
                handleQuestionChange(e.currentTarget.value);
              }
            }}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText}</div>
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
          {renderValidationOptions()}
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
                handleQuestionChange(e.currentTarget.value);
              }
            }}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText}</div>
              <Input type="text" placeholder="Short answer text" />
            </div>
          </div>
          {renderValidationOptions()}
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
                handleQuestionChange(e.currentTarget.value);
              }
            }}
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
              <div className="font-medium mb-2">{questionText}</div>
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
          {renderValidationOptions()}
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
                handleQuestionChange(e.currentTarget.value);
              }
            }}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <div className="font-medium mb-2">{questionText}</div>
              <Input type="email" placeholder="Email address" />
            </div>
          </div>
          {renderValidationOptions()}
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
                handleQuestionChange(e.currentTarget.value);
              }
            }}
            className="mb-4"
          />
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Preview</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              <h2 className="text-xl font-bold">{questionText}</h2>
            </div>
          </div>
          {renderValidationOptions()}
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
              <p className="text-gray-600">{questionText}</p>
            </div>
          </div>
          {renderValidationOptions()}
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
               <div className="font-medium mb-2">{questionText}</div>
               <textarea
                 placeholder="Type your answer here"
                 rows={4}
                 value={longAnswerText}
                 maxLength={maxLength || 100}
                 onChange={(e) => {
                   const limit = maxLength ? Number(maxLength) : 100;
                   let newText = e.target.value;
                   if (newText.length > limit) {
                     newText = newText.slice(0, limit);
                   }
                   setLongAnswerText(newText);
                   setCharCount(newText.length);
                   if (onUpdate) {
                     onUpdate({
                       ...field,
                       properties: {
                         ...field.properties,
                         previewText: newText
                       }
                     });
                   }
                 }}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
               />
               {(typeof maxLength === 'number' && longAnswerText.length >= maxLength) && (
                 <div className="text-xs text-red-500 mt-1">Maximum character limit reached.</div>
               )}
               <div className="flex justify-between items-center mt-2">
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => {
                     setLongAnswerText('');
                     setCharCount(0);
                     if (onUpdate) {
                       onUpdate({
                         ...field,
                         properties: {
                           ...field.properties,
                           previewText: ''
                         }
                       });
                     }
                   }}
                   className="text-blue-500"
                 >
                   Clear
                 </Button>
                 <span className="text-sm text-gray-500">{charCount} / {maxLength || 100}</span>
               </div>
             </div>
           </div>
           {renderValidationOptions()}
         </div>
       );
    case 'dropdown':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="dropdown-question-text" className="font-medium mb-2 block">Question</Label>
          <Input 
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
          {renderValidationOptions()}
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