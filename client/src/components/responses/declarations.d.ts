// This file provides TypeScript declarations for JavaScript modules

declare module './TabNavigation' {
  import React from 'react';
  interface TabNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }
  const TabNavigation: React.FC<TabNavigationProps>;
  export default TabNavigation;
}

declare module './ResponsesTable' {
  import React from 'react';
  interface ResponsesTableProps {
    responses: Array<{
      id: string;
      question_text: string;
      selected_option: string;
      timestamp: string;
      [key: string]: string | number;
    }>;
    editingResponse: {
      id: string;
      question_text: string;
      selected_option: string;
      timestamp: string;
      [key: string]: string | number;
    } | null;
    setEditingResponse: (response: {
      id: string;
      question_text: string;
      selected_option: string;
      timestamp: string;
      [key: string]: string | number;
    } | null) => void;
    handleEdit: () => void;
    handleSort: (key: string) => void;
    sortConfig: { key: string | null; direction: string };
  }
  const ResponsesTable: React.FC<ResponsesTableProps>;
  export default ResponsesTable;
}

declare module './SummaryView' {
  import React from 'react';
  interface SummaryViewProps {
    summary: {
      distributions: {
        question_text: string;
        options: {
          option_text: string;
          count: number;
        }[];
      }[];
    };
    chartTypes: Record<string, string>;
    setChartTypes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    hoveredSegment: string | null;
    setHoveredSegment: React.Dispatch<React.SetStateAction<string | null>>;
  }
  const SummaryView: React.FC<SummaryViewProps>;
  export default SummaryView;
}

declare module './AnalyticsView' {
  import React from 'react';
  interface AnalyticsViewProps {
    analytics: {
      completion_rate: number;
      average_time: number;
      drop_off_points: {
        question: string;
        drop_off_rate: number;
      }[];
    };
  }
  const AnalyticsView: React.FC<AnalyticsViewProps>;
  export default AnalyticsView;
}

declare module './constants' {
  export const DUMMY_RESPONSES: Array<{
    id: string;
    question_text: string;
    selected_option: string;
    timestamp: string;
    [key: string]: string | number;
  }>;
  export const DUMMY_SUMMARY: {
    distributions: {
      question_text: string;
      options: {
        option_text: string;
        count: number;
      }[];
    }[];
  };
  export const DUMMY_ANALYTICS: {
    completion_rate: number;
    average_time: number;
    drop_off_points: {
      question: string;
      drop_off_rate: number;
    }[];
  };
}
