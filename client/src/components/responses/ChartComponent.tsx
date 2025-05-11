"use client";
// Using JSX without importing React is supported in React 17+
// with the new JSX transform

interface Distribution {
  question_text: string;
  options: {
    selected_option: string;
    count: number;
    percentage: number;
  }[];
}

interface ChartProps {
  data: Distribution;
  hoveredSegment: string | null;
  setHoveredSegment: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ChartSelectorProps {
  distribution: Distribution;
  chartTypes: Record<string, string>;
  setChartTypes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface QuestionChartProps {
  distribution: Distribution;
  chartTypes: Record<string, string>;
  setChartTypes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  hoveredSegment: string | null;
  setHoveredSegment: React.Dispatch<React.SetStateAction<string | null>>;
}

export function BarChart({
  data,
  hoveredSegment,
  setHoveredSegment,
}: ChartProps) {
  // Find the maximum percentage value
  const maxPercentage = Math.max(...data.options.map((opt) => opt.percentage));
  // Add 10% to the max percentage, but don't exceed 100%
  const containerWidth = Math.min(100, maxPercentage * 1.1);

  return (
    <div className="space-y-4 mt-4">
      {data.options.map((option, optIndex) => (
        <div
          key={option.selected_option}
          className="flex flex-col  sm:flex-row items-center gap-2 sm:gap-4"
          onMouseEnter={() =>
            setHoveredSegment(`${data.question_text}-${optIndex}`)
          }
          onMouseLeave={() => setHoveredSegment(null)}
        >
          <div className="flex justify-between w-full sm:w-48 sm:min-w-[12rem]">
            <span className="font-roboto text-gray-700 truncate pr-2">
              {option.selected_option}
            </span>
            <span className="sm:hidden font-roboto text-gray-600 whitespace-nowrap">
              {option.percentage}% ({option.count})
            </span>
          </div>

          <div className="flex-1 flex items-center gap-4 max-w-2xl">
            <div
              className="h-5 sm:h-6 bg-gray-100 rounded-full overflow-hidden"
              style={{
                width: "100%",
                maxWidth: `${containerWidth}%`,
              }}
            >
              <div
                className={`h-full bg-blue-600 rounded-full transition-all duration-500 ${
                  hoveredSegment === `${data.question_text}-${optIndex}`
                    ? "opacity-80"
                    : "opacity-100"
                }`}
                style={{
                  width: `${(option.percentage / containerWidth) * 100}%`,
                }}
              />
            </div>
            <span className="hidden sm:block w-24 font-roboto text-gray-600 text-right whitespace-nowrap">
              {option.percentage}% ({option.count})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PieChart({
  data,
  hoveredSegment,
  setHoveredSegment,
}: ChartProps) {
  return (
    <div className="flex justify-center items-center mt-4">
      <svg width="200" height="200" viewBox="0 0 100 100">
        {data.options.map((option, index) => {
          const total = data.options.reduce(
            (sum, opt) => sum + opt.percentage,
            0
          );

          // Calculate the angles for the pie segments
          let startAngle = 0;
          for (let i = 0; i < index; i++) {
            startAngle += (data.options[i].percentage / total) * 360;
          }

          const endAngle = startAngle + (option.percentage / total) * 360;

          // Convert angles to radians for SVG path
          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = (endAngle - 90) * (Math.PI / 180);

          const x1 = 50 + 40 * Math.cos(startRad);
          const y1 = 50 + 40 * Math.sin(startRad);
          const x2 = 50 + 40 * Math.cos(endRad);
          const y2 = 50 + 40 * Math.sin(endRad);

          const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

          const d = [
            "M",
            50,
            50,
            "L",
            x1,
            y1,
            "A",
            40,
            40,
            0,
            largeArcFlag,
            1,
            x2,
            y2,
            "Z",
          ].join(" ");

          // Generate a color based on the index
          const colors = [
            "#3B82F6", // blue-500
            "#10B981", // emerald-500
            "#F59E0B", // amber-500
            "#EF4444", // red-500
            "#8B5CF6", // violet-500
            "#EC4899", // pink-500
          ];

          const color = colors[index % colors.length];

          return (
            <path
              key={option.selected_option}
              d={d}
              fill={color}
              stroke="white"
              strokeWidth="1"
              onMouseEnter={() =>
                setHoveredSegment(`${data.question_text}-${index}`)
              }
              onMouseLeave={() => setHoveredSegment(null)}
              className={`transition-opacity duration-300 ${
                hoveredSegment === `${data.question_text}-${index}`
                  ? "opacity-80"
                  : "opacity-100"
              }`}
            />
          );
        })}
      </svg>

      <div className="ml-8">
        {data.options.map((option, index) => {
          const colors = [
            "#3B82F6", // blue-500
            "#10B981", // emerald-500
            "#F59E0B", // amber-500
            "#EF4444", // red-500
            "#8B5CF6", // violet-500
            "#EC4899", // pink-500
          ];

          const color = colors[index % colors.length];

          return (
            <div
              key={option.selected_option}
              className="flex items-center mb-2"
              onMouseEnter={() =>
                setHoveredSegment(`${data.question_text}-${index}`)
              }
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div
                className="w-4 h-4 mr-2 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className="font-roboto text-sm">
                {option.selected_option} ({option.percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartSelector({
  distribution,
  chartTypes,
  setChartTypes,
}: ChartSelectorProps) {
  // Handle chart type selection
  const handleChartTypeChange = (type: string) => {
    // Create a new object with the updated chart type
    const updatedChartTypes = { ...chartTypes };
    updatedChartTypes[distribution.question_text] = type;
    // Call setChartTypes with the new object
    setChartTypes(updatedChartTypes);
  };

  const buttons = [
    {
      label: "Bar Chart",
      type: "bar",
    },
    {
      label: "Pie Chart",
      type: "pie",
    },
  ];
  return (
    <div className="flex space-x-2 mt-2 mb-4">
      {buttons.map((button) => (
        <button
          key={button.label}
          onClick={() => handleChartTypeChange(button.type)}
          style={{
            borderRadius: "0.45rem",
            padding: "0.25rem 0.5rem",
            ...(chartTypes[distribution.question_text] === button.type
              ? {
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                }
              : {
                  color: "#374151",

                  ":hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }),
          }}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}

export function QuestionChart({
  distribution,
  chartTypes,
  setChartTypes,
  hoveredSegment,
  setHoveredSegment,
}: QuestionChartProps) {
  return (
    <div
      key={distribution.question_text}
      className="bg-white p-6 rounded-lg shadow mb-6 border "
    >
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="text-xl font-roboto font-semibold">
          {distribution.question_text}
        </h3>
        <ChartSelector
          distribution={distribution}
          chartTypes={chartTypes}
          setChartTypes={setChartTypes}
        />
      </div>

      {chartTypes[distribution.question_text] === "pie" ? (
        <PieChart
          data={distribution}
          hoveredSegment={hoveredSegment}
          setHoveredSegment={setHoveredSegment}
        />
      ) : (
        <BarChart
          data={distribution}
          hoveredSegment={hoveredSegment}
          setHoveredSegment={setHoveredSegment}
        />
      )}
    </div>
  );
}
