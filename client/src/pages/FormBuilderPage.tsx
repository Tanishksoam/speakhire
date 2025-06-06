import { useNavigate, Link } from "react-router-dom";
import type { FormCreationMethod } from "../types";
import OptionCard from "../components/FormBuilder/Card";
import { Plus, FileUp, Sparkles } from "lucide-react";

export default function FormBuilderPage() {
  const navigate = useNavigate();
  const handleMethodSelection = (method: FormCreationMethod) => {
    console.log(`Selected method: ${method}`);
    navigate(`/form-builder/${method}`);
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full-screen flex flex-col items-center justify-center">
      <div className="flex-1 flex flex-col justify-center w-full">
        <div className="container max-w-5xl mx-auto p-4 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-semibold text-gray-900">
              How do you want to build your form?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Start from scratch option */}
            <Link to="/form-builder/scratch">
              <OptionCard
                title="Start from scratch"
                description="Build from a list of ready-made form elements."
                icon={<Plus className="h-8 w-8 text-blue-500" />}
                method="scratch"
                onSelect={() => handleMethodSelection("scratch")}
              />
            </Link>

            {/* Import questions option */}
            <Link to="/form-builder/import">
              <OptionCard
                title="Import questions"
                description="Copy and paste questions or import from Google Forms."
                icon={<FileUp className="h-8 w-8 text-purple-500" />}
                method="import"
                onSelect={() => handleMethodSelection("import")}
              />
            </Link>
            {/* Create with AI option */}
            <Link to="/form-builder/ai">
              <OptionCard
                title="Create with AI"
                description="Use AI to help generate questions for any form."
                icon={<Sparkles className="h-8 w-8 text-indigo-500" />}
                method="ai"
                onSelect={() => handleMethodSelection("ai")}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
