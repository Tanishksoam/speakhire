import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import FormBuilderPage from './pages/FormBuilderPage';
import Header from './components/FormBuilder/Header';

function App() {
  return (
   <>
      <Header title="Create your form" />
      <Routes>
        <Route path="/" element={<FormBuilderPage />} />
        <Route path="/form-builder/:method" element={<FormBuilderPage />} />
      </Routes>
   </>

  );
}

export default App;
