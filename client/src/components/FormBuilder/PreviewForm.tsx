"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, AlertCircle } from "lucide-react";
import type { Field, FieldType } from "../../types";

interface PreviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: Field[];
  formTitle?: string;
}

interface FormValues {
  [key: string]: string | number | string[] | boolean;
}

interface ValidationError {
  fieldId: string;
  message: string;
}

export function PreviewForm({ open, onOpenChange, fields, formTitle }: PreviewFormProps) {
  const [formValues, setFormValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormValues({});
      setErrors([]);
      setSubmitted(false);
    }
  }, [open]);

  const handleInputChange = (fieldId: string, value: string | number | string[] | boolean) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear any errors for this field
    setErrors(prev => prev.filter(error => error.fieldId !== fieldId));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    fields.forEach(field => {
      // Skip validation for heading and paragraph fields
      if (field.type === 'heading' || field.type === 'paragraph') {
        return;
      }

      const value = formValues[field.id];
      
      // Required field validation
      if (field.required && (!value || (Array.isArray(value) && value.length === 0) || value === '')) {
        newErrors.push({
          fieldId: field.id,
          message: 'This field is required'
        });
        return; // Skip other validations if required field is empty
      }

      // Skip other validations if field is empty and not required
      if (!value || value === '') return;

      // Type-specific validations
      if (field.properties?.validation) {
        const validation = field.properties.validation;

        // Text length validation
        if ((field.type === 'shortAnswer' || field.type === 'longAnswer' || field.type === 'email') && typeof value === 'string') {
          if (validation.minLength && value.length < validation.minLength) {
            newErrors.push({
              fieldId: field.id,
              message: `Minimum length is ${validation.minLength} characters`
            });
          }
          if (validation.maxLength && value.length > validation.maxLength) {
            newErrors.push({
              fieldId: field.id,
              message: `Maximum length is ${validation.maxLength} characters`
            });
          }
        }

        // Email validation
        if (field.type === 'email' && typeof value === 'string') {
          if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
            newErrors.push({
              fieldId: field.id,
              message: 'Please enter a valid email address (must end with @gmail.com)'
            });
          }
        }

        // Number range validation
        if (field.type === 'number' && typeof value === 'number') {
          if (validation.min !== undefined && value < validation.min) {
            newErrors.push({
              fieldId: field.id,
              message: `Minimum value is ${validation.min}`
            });
          }
          if (validation.max !== undefined && value > validation.max) {
            newErrors.push({
              fieldId: field.id,
              message: `Maximum value is ${validation.max}`
            });
          }
        }

        // Date range validation
        if (field.type === 'date' && typeof value === 'string') {
          const dateValue = new Date(value).getTime();
          if (validation.min && new Date(validation.min).getTime() > dateValue) {
            newErrors.push({
              fieldId: field.id,
              message: `Date must be after ${new Date(validation.min).toLocaleDateString()}`
            });
          }
          if (validation.max && new Date(validation.max).getTime() < dateValue) {
            newErrors.push({
              fieldId: field.id,
              message: `Date must be before ${new Date(validation.max).toLocaleDateString()}`
            });
          }
        }
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 1500);
    }
  };

  const renderField = (field: Field) => {
    const fieldId = field.id;
    const fieldError = errors.find(error => error.fieldId === fieldId);
    const value = formValues[fieldId] || '';

    switch (field.type as FieldType) {
      case 'shortAnswer':
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Short Answer'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
              type="text" 
              className={`w-full p-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              disabled={submitted}
            />
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'email':
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Email'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
              type="email" 
              className={`w-full p-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              disabled={submitted}
            />
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'longAnswer':
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Long Answer'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea 
              className={`w-full p-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              rows={4}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              disabled={submitted}
            />
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'multipleChoice':
        const options = field.properties?.options || [];
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Multiple Choice'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {options.map((option: {id: string, text: string}, index: number) => (
                <div key={option.id || index} className="flex items-center">
                  <input 
                    type="radio" 
                    id={`${fieldId}-option-${index}`}
                    name={fieldId}
                    value={option.text}
                    checked={value === option.text}
                    onChange={() => handleInputChange(fieldId, option.text)}
                    disabled={submitted}
                    className="mr-2"
                  />
                  <label htmlFor={`${fieldId}-option-${index}`}>{option.text}</label>
                </div>
              ))}
            </div>
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'dropdown':
        const dropdownOptions = field.properties?.options || [];
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Dropdown'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select 
              className={`w-full p-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              disabled={submitted}
            >
              <option value="">Select an option</option>
              {dropdownOptions.map((option: {id: string, text: string}, index: number) => (
                <option key={option.id || index} value={option.text}>
                  {option.text}
                </option>
              ))}
            </select>
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'date':
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Date'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
              type="date" 
              className={`w-full p-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              disabled={submitted}
            />
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'time':
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Time'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
              type="time" 
              className={`w-full p-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              disabled={submitted}
            />
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'rating':
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Rating'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${Number(value) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => handleInputChange(fieldId, star)}
                  disabled={submitted}
                >
                  ★
                </button>
              ))}
            </div>
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'pictureChoice':
        const pictureOptions = field.properties?.options || [];
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Picture Choice'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {pictureOptions.map((option: {id: string, text: string}, index: number) => (
                <div 
                  key={option.id || index} 
                  className={`border p-2 rounded flex flex-col items-center cursor-pointer ${value === option.text ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => !submitted && handleInputChange(fieldId, option.text)}
                >
                  <div className="bg-gray-200 w-full h-16 mb-2 flex items-center justify-center">
                    Image {index + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      checked={value === option.text}
                      onChange={() => handleInputChange(fieldId, option.text)}
                      disabled={submitted}
                      className="mr-2"
                    />
                    <label>{option.text}</label>
                  </div>
                </div>
              ))}
            </div>
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'slider':
        return (
          <div className="mb-6" key={fieldId}>
            <label className="block text-sm font-medium mb-1">
              {field.title || field.label || 'Slider'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={typeof value === 'number' ? value : 50} 
              onChange={(e) => handleInputChange(fieldId, parseInt(e.target.value))}
              disabled={submitted}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
            {fieldError && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>
        );
      
      case 'heading':
        return (
          <div className="mb-6" key={fieldId}>
            <h2 className="text-xl font-bold">{field.title}</h2>
          </div>
        );
      
      case 'paragraph':
        return (
          <div className="mb-6" key={fieldId}>
            <p className="text-gray-600">{field.title}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{submitted ? "Form Submitted" : formTitle || "Form Preview"}</DialogTitle>
          <DialogDescription>
            {submitted 
              ? "Thank you for submitting the form. Your response has been recorded." 
              : "This is how recipients will see your form."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Submission Successful</h3>
            <p className="text-gray-500 mb-6">Your form response has been recorded.</p>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <h1 className="text-2xl font-bold mb-6">{formTitle || "Untitled Form"}</h1>
              
              {fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>This form doesn't have any fields yet.</p>
                </div>
              ) : (
                fields.map(renderField)
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting || fields.length === 0}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
