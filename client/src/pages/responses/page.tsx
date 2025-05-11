"use client";
// Using JSX without importing React is supported in React 17+
// with the new JSX transform
import ResponsesContainer from "../../components/responses/ResponsesContainer";

export default function ResponsesPage() {
  return (
    <div className="h-full max-w-[1200px] mx-auto">
      <ResponsesContainer />
    </div>
  );
}
