import ResponsesPage from "./pages/responses/page";
import {  Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import FormBuilderPage from "./pages/FormBuilderPage";
import Header from "./components/FormBuilder/Header";
import { FormBuilder } from "./pages/CustomForm";
import ImportForm from "./pages/ImportForm";
import AiFormBuilder from "./pages/AiForm";
import LandingPage from "./pages/LandingPage";

const LayoutWithHeader = () => (
  <>
    <Header title="Create your form" />
    <Outlet />
  </>
);

function App() {
  return (
    <div className=" min-h-[100dvh] w-screen ">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<LayoutWithHeader />}>
          <Route path="/create" element={<FormBuilderPage />} />
          <Route path="/responses" element={<ResponsesPage />} />
          <Route path="/form-builder/scratch" element={<FormBuilder />} />
          <Route path="/form-builder/import" element={<ImportForm />} />
          <Route path="/form-builder/ai" element={<AiFormBuilder />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
