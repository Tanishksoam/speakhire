"use client";
import { useEffect, useState } from "react";
import TabNavigation from "./TabNavigation";
import ResponsesTable from "./ResponsesTable";
import SummaryView from "./SummaryView";
import AnalyticsView from "./AnalyticsView";
import { type Response, type Summary, type Analytics, DUMMY_RESPONSES, DUMMY_SUMMARY, DUMMY_ANALYTICS } from "./constants";

export default function ResponsesContainer(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>("results");
  const [responses, setResponses] = useState<Response[]>(DUMMY_RESPONSES);
  const [summary, setSummary] = useState<Summary>(DUMMY_SUMMARY);
  const [analytics, setAnalytics] = useState<Analytics>(DUMMY_ANALYTICS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

  // Initialize chartTypes with default values for each question
  const [chartTypes, setChartTypes] = useState<Record<string, string>>(() => {
    const initialChartTypes: Record<string, string> = {};
    DUMMY_SUMMARY.distributions.forEach(
      (distribution: { question_text: string }) => {
        initialChartTypes[distribution.question_text] = "bar";
      }
    );
    return initialChartTypes;
  });

  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: string;
  }>({ key: null, direction: "asc" });

  const handleEdit = async (): Promise<void> => {
    if (!selectedResponse) return;

    try {
      const response = await fetch("/api/survey-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "updateResponse",
          id: selectedResponse.id,
          selected_option: selectedResponse.selected_option,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update response");
      }

      // Update the local state with the edited response
      setResponses((prevResponses) =>
        prevResponses.map((resp) =>
          resp.id === selectedResponse.id ? selectedResponse : resp
        )
      );

      setSelectedResponse(null);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === "results") {
        setResponses(DUMMY_RESPONSES);
      } else if (activeTab === "summary") {
        setSummary(DUMMY_SUMMARY);
      } else if (activeTab === "analytics") {
        setAnalytics(DUMMY_ANALYTICS);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleSort = (key: string): void => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    setResponses((prevResponses) => {
      return [...prevResponses].sort((a, b) => {
        if (a[key as keyof typeof DUMMY_RESPONSES[0]] < b[key as keyof typeof DUMMY_RESPONSES[0]]) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[key as keyof typeof DUMMY_RESPONSES[0]] > b[key as keyof typeof DUMMY_RESPONSES[0]]) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    });
  };

  return (
    <div className=" w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-roboto font-bold text-gray-800 mb-4">
            Survey Responses
          </h1>

          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          ) : (
            <div>
              {activeTab === "results" && (
                <ResponsesTable
                  responses={responses}
                  selectedResponse={selectedResponse}
                  setSelectedResponse={setSelectedResponse}
                  handleEdit={handleEdit}
                  handleSort={handleSort}
                  sortConfig={sortConfig}
                />
              )}

              {activeTab === "summary" && (
                <SummaryView
                  summary={summary}
                  chartTypes={chartTypes}
                  setChartTypes={setChartTypes}
                  hoveredSegment={hoveredSegment}
                  setHoveredSegment={setHoveredSegment}
                />
              )}

              {activeTab === "analytics" && (
                <AnalyticsView analytics={analytics} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
