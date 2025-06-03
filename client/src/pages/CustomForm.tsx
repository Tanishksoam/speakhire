import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFields } from '../store/features/FormBuilderSlice';
import { setTitle } from '../store/features/customFormSlice';
import { FieldSelector } from '../components/FormBuilder/FormSelector';
import { FormCanvas } from '../components/FormBuilder/FormCanvas';
import { TopNavbar } from '../components/FormBuilder/TopNavbar';
import FormTitle from '../components/FormBuilder/formtitle';
import { useParams, useNavigate } from 'react-router-dom';


export const FormBuilder: React.FC = () => {
  // Get form ID from URL params if available
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    id: formId || 'new-form', // Use URL param or default for new forms
    title: 'Untitled Form'
  });
  
  // State to control the form title dialog
  const [showTitleDialog, setShowTitleDialog] = useState(formId === 'new-form');
  // State to control showing the form builder
  const [showFormBuilder, setShowFormBuilder] = useState(formId !== 'new-form');
  
  // Fetch form data if we have an existing form ID
  useEffect(() => {
    async function fetchForm() {
      if (formId && formId !== 'new-form') {
        try {
          const res = await fetch(`/api/forms/${formId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.fields) {
              dispatch(setFields(data.fields));
            }
            if (data.title) {
              setFormData((prev) => ({ ...prev, title: data.title }));
              dispatch(setTitle(data.title));
            }
          }
        } catch (err) {
          console.error('Failed to fetch form data:', err);
        }
      }
    }
    fetchForm();
  }, [formId, dispatch]);
  
  // Handle form title submission
  const handleFormTitleSubmit = (title: string) => {
    setFormData((prev) => ({ ...prev, title }));
    setShowFormBuilder(true);
    
    // If we're creating a new form, update the URL
    if (formId === 'new-form') {
      const newFormId = `form-${Date.now()}`;
      navigate(`/forms/${newFormId}`, { replace: true });
    }
  };
  
  // If we're showing the title dialog and not the form builder yet
  if (!showFormBuilder && showTitleDialog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FormTitle
          open={showTitleDialog}
          onOpenChange={setShowTitleDialog}
          onFormTitleSubmit={handleFormTitleSubmit}
          initialTitle={formData.title !== 'Untitled Form' ? formData.title : ''}
        />
      </div>
    );
  }
  
  return (
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
      
      {/* Form Title Dialog - shown when editing an existing form's title */}
      {formId !== 'new-form' && (
        <FormTitle
          open={showTitleDialog}
          onOpenChange={setShowTitleDialog}
          onFormTitleSubmit={handleFormTitleSubmit}
          initialTitle={formData.title}
        />
      )}
    </div>
  );
};
