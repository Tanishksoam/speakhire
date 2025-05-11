"use client";
// Using JSX without importing React is supported in React 17+
// with the new JSX transform
import { QuestionChart } from "./ChartComponent";

interface Distribution {
  question_text: string;
  options: {
    selected_option: string;
    count: number;
    percentage: number;
  }[];
}

interface SummaryViewProps {
  summary: {
    distributions: Distribution[];
  };
  chartTypes: Record<string, string>;
  setChartTypes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  hoveredSegment: string | null;
  setHoveredSegment: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function SummaryView({
  summary,
  chartTypes,
  setChartTypes,
  hoveredSegment,
  setHoveredSegment,
}: SummaryViewProps) {
  return (
    <div className=" w-full">
      {summary.distributions.map((distribution) => (
        <QuestionChart
          key={distribution.question_text}
          distribution={distribution}
          chartTypes={chartTypes}
          setChartTypes={setChartTypes}
          hoveredSegment={hoveredSegment}
          setHoveredSegment={setHoveredSegment}
        />
      ))}
    </div>
  );
}
