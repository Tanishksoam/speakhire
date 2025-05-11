import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { FieldSelector } from '../components/FormBuilder/FormSelector';
import { FormCanvas } from '../components/FormBuilder/FormCanvas';
import { TopNavbar } from '../components/FormBuilder/TopNavbar';


export const FormBuilder: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="flex h-screen bg-gray-50">
        <FieldSelector />
        <div className="flex-1 flex flex-col">
          <TopNavbar />
          <FormCanvas />
     
        </div>
      </div>
    </Provider>
  );
};
