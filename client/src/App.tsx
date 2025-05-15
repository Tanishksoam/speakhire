import ResponsesPage from "./pages/responses/page";
import {  Routes, Route } from "react-router-dom";
import "./App.css";
import FormBuilderPage from "./pages/FormBuilderPage";
import Header from "./components/FormBuilder/Header";
import { FormBuilder } from "./pages/CustomForm";
import ImportForm from "./pages/ImportForm";
import AiFormBuilder from "./pages/AiForm";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <div className=" min-h-[100dvh] w-screen ">
      <Header title="Create your form" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<FormBuilderPage />} />
        <Route path="/responses" element={<ResponsesPage />} />
        <Route path="/form-builder/scratch" element={<FormBuilder />} />
        <Route path="/form-builder/import" element={<ImportForm />} />
        <Route path="/form-builder/ai" element={<AiFormBuilder />} />
      </Routes>
    </div>
  );
}

export default App;
