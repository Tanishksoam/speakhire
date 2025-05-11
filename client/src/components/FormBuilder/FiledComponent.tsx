import React, { useState } from 'react';
import type { Field } from '../../types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface FieldComponentProps {
  field: Field;
  onUpdate?: (updatedField: Field) => void;
}

export const FieldComponent: React.FC<FieldComponentProps> = ({ field, onUpdate }) => {
  const [questionText, setQuestionText] = useState(field.title || '');
  const [options, setOptions] = useState<string[]>(
    field.properties?.options?.map((opt: any) => opt.text) || ['Option 1', 'Option 2']
  );

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    if (onUpdate) {
      onUpdate({
        ...field,
        title: value
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
    case 'shortAnswer':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="question-text" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="question-text"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e) => handleQuestionChange(e.target.value)}
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
            onChange={(e) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <Label className="font-medium mb-2 block mt-4">Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input 
                type="text" 
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
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
              <RadioGroup defaultValue="option1">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={`option${index + 1}`} id={`preview-option${index + 1}`} />
                    <label htmlFor={`preview-option${index + 1}`}>{option}</label>
                  </div>
                ))}
              </RadioGroup>
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
            onChange={(e) => handleQuestionChange(e.target.value)}
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
            onChange={(e) => handleQuestionChange(e.target.value)}
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
            onChange={(e) => handleQuestionChange(e.target.value)}
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
    case 'dropdown':
      return (
        <div className="p-4 border rounded-md">
          <Label htmlFor="dropdown-question-text" className="font-medium mb-2 block">Question</Label>
          <Input 
            id="dropdown-question-text"
            type="text" 
            placeholder="Enter your question" 
            value={questionText}
            onChange={(e) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <Label className="font-medium mb-2 block mt-4">Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input 
                type="text" 
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
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
              <div className="font-medium mb-2">{questionText || 'Dropdown Question'}</div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option, index) => (
                    <SelectItem key={index} value={`option${index + 1}`}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            onChange={(e) => handleQuestionChange(e.target.value)}
            className="mb-4"
          />
          <Label className="font-medium mb-2 block mt-4">Image Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input 
                type="text" 
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1"
                placeholder={`Label for Image ${index + 1}`}
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
            <Plus className="h-4 w-4 mr-2" /> Add Image Option
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
    default:
      return <div>Unknown field type: {field.type}</div>;
  }
};