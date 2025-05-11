import { Routes, Route } from "react-router-dom";
import "./App.css";
import FormBuilderPage from "./pages/FormBuilderPage";
import Header from "./components/FormBuilder/Header";
import ResponsesPage from "./pages/responses/page";

function App() {
  return (
    <div className=" min-h-[100dvh] w-screen ">
      <Header title="Create your form" />
      <Routes >
        <Route path="/" element={<FormBuilderPage />} />
        <Route path="/form-builder/:method" element={<FormBuilderPage />} />
        <Route path="/responses" element={<ResponsesPage />} />
      </Routes>
    </div>
  );
}

export default App;
