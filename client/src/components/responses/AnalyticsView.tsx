"use client";
// Using JSX without importing React is supported in React 17+
// with the new JSX transform

interface AnalyticsViewProps {
  analytics: {
    total_responses: number;
    satisfaction_rate: number;
    recommendation_rate: number;
    completion_rate: number;
    average_time: string;
    popular_choices: {
      tshirt: string;
      color: string;
      size: string;
    };
  };
}

export default function AnalyticsView({ analytics }: AnalyticsViewProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-lg font-roboto font-semibold mb-2 text-gray-700">
            Total Responses
          </h3>
          <p className="text-3xl font-roboto font-bold text-blue-600">
            {analytics.total_responses}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-lg font-roboto font-semibold mb-2 text-gray-700">
            Satisfaction Rate
          </h3>
          <p className="text-3xl font-roboto font-bold text-green-600">
            {analytics.satisfaction_rate}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-lg font-roboto font-semibold mb-2 text-gray-700">
            Completion Rate
          </h3>
          <p className="text-3xl font-roboto font-bold text-purple-600">
            {analytics.completion_rate}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border">
        <h3 className="text-xl font-roboto font-semibold mb-4 text-gray-700">
          Popular Choices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-roboto text-gray-500 mb-1">
              Most Popular T-Shirt
            </h4>
            <p className="text-lg font-roboto font-semibold text-gray-800">
              {analytics.popular_choices?.tshirt}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-roboto text-gray-500 mb-1">
              Most Popular Color
            </h4>
            <p className="text-lg font-roboto font-semibold text-gray-800">
              {analytics.popular_choices?.color}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-roboto text-gray-500 mb-1">
              Most Popular Size
            </h4>
            <p className="text-lg font-roboto font-semibold text-gray-800">
              {analytics.popular_choices?.size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
