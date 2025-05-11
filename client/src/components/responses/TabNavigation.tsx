"use client";
// Using JSX without importing React is supported in React 17+
// with the new JSX transform

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  const tabs = [
    { id: "results", label: "Results" },
    { id: "summary", label: "Summary" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 border-b-2 bg-white font-roboto font-medium text-sm ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
