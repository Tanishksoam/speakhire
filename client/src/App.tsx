import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import FormBuilderPage from './pages/FormBuilderPage';
import Header from './components/FormBuilder/Header';
import CustomForm from './pages/CustomForm';
import ImportForm from './pages/ImportForm';   
import AiFormBuilder from './pages/AiForm';

function App() {
  return (
   <>
      <Header title="Create your form" />
      <Routes>
        <Route path="/form-builder" element={<FormBuilderPage />} />
        <Route path="/form-builder/scratch" element={<CustomForm />} />
        <Route path="/form-builder/import" element={<ImportForm />} />
        <Route path="/form-builder/ai" element={<AiFormBuilder />} />
      </Routes>
   </>

  );
}

export default App;
