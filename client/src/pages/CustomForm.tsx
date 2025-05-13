import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { FieldSelector } from '../components/FormBuilder/FormSelector';
import { FormCanvas } from '../components/FormBuilder/FormCanvas';
import { TopNavbar } from '../components/FormBuilder/TopNavbar';
import { useParams } from 'react-router-dom';


export const FormBuilder: React.FC = () => {
  // Get form ID from URL params if available
  const { formId } = useParams<{ formId: string }>();
  
  // State for form data
  const [formData, setFormData] = useState({
    id: formId || 'new-form', // Use URL param or default for new forms
    title: 'Untitled Form'
  });
  
  // Fetch form data if we have an existing form ID
  useEffect(() => {
    if (formId && formId !== 'new-form') {
      // Here you would fetch the form data from your API
      // For now, we'll just use the ID from the URL
      console.log('Would fetch form data for ID:', formId);
    }
  }, [formId]);
  
  return (
    <Provider store={store}>
      <div className="grid grid-cols-[260px_1fr] h-screen bg-gray-100 overflow-hidden w-full">
        <div className="h-full border-r border-gray-200 overflow-y-auto">
          <FieldSelector />
        </div>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="bg-white border-b border-gray-200">
            <TopNavbar 
              formId={formData.id} 
              formTitle={formData.title} 
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <FormCanvas />
          </div>
        </div>
      </div>
    </Provider>
  );
};
