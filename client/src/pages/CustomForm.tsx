import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { FieldSelector } from '../components/FormBuilder/FormSelector';
import { FormCanvas } from '../components/FormBuilder/FormCanvas';
import { TopNavbar } from '../components/FormBuilder/TopNavbar';


export const FormBuilder: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="grid grid-cols-[260px_1fr] h-screen bg-gray-100 overflow-hidden w-full">
        <div className="h-full border-r border-gray-200 overflow-y-auto">
          <FieldSelector />
        </div>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="bg-white border-b border-gray-300">
            <TopNavbar />
          </div>
          <div className="flex-1 overflow-hidden">
            <FormCanvas />
          </div>
        </div>
      </div>
    </Provider>
  );
};
