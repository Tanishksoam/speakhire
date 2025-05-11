interface TShirtItem {
  name: string;
  color: string;
  size: string;
}

interface Response {
  id: number;
  submission_id: string;
  question_text: string;
  selected_option: string;
  submitted_at: string;
}

interface Distribution {
  question_text: string;
  options: {
    selected_option: string;
    count: number;
    percentage: number;
  }[];
}

interface Analytics {
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
}

export const TSHIRT_FORM_DATA: TShirtItem[] = [
  { name: "Basic Tee", color: "Black", size: "M" },
  { name: "Sport Tee", color: "Blue", size: "L" },
  { name: "Casual Fit", color: "White", size: "S" },
  { name: "V-Neck", color: "Gray", size: "XL" },
  { name: "Long Sleeve", color: "Red", size: "M" },
];

export const DUMMY_RESPONSES: Response[] = [
  {
    id: 1,
    submission_id: "550e8400-e29b-41d4-a716-446655440000",
    question_text: "What type of t-shirt do you prefer?",
    selected_option: "Basic Tee",
    submitted_at: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    submission_id: "550e8400-e29b-41d4-a716-446655440000",
    question_text: "What color do you prefer?",
    selected_option: "Black",
    submitted_at: "2025-01-15T10:30:00Z",
  },
  {
    id: 3,
    submission_id: "550e8400-e29b-41d4-a716-446655440000",
    question_text: "What size do you wear?",
    selected_option: "M",
    submitted_at: "2025-01-15T10:30:00Z",
  },
  {
    id: 4,
    submission_id: "550e8400-e29b-41d4-a716-446655440001",
    question_text: "What type of t-shirt do you prefer?",
    selected_option: "Sport Tee",
    submitted_at: "2025-01-15T11:15:00Z",
  },
  {
    id: 5,
    submission_id: "550e8400-e29b-41d4-a716-446655440001",
    question_text: "What color do you prefer?",
    selected_option: "Blue",
    submitted_at: "2025-01-15T11:15:00Z",
  },
];

export const DUMMY_SUMMARY: { distributions: Distribution[] } = {
  distributions: [
    {
      question_text: "What type of t-shirt do you prefer?",
      options: [
        { selected_option: "Basic Tee", count: 30, percentage: 30 },
        { selected_option: "Sport Tee", count: 25, percentage: 25 },
        { selected_option: "Casual Fit", count: 20, percentage: 20 },
        { selected_option: "V-Neck", count: 15, percentage: 15 },
        { selected_option: "Long Sleeve", count: 10, percentage: 10 },
      ],
    },
    {
      question_text: "What color do you prefer?",
      options: [
        { selected_option: "Black", count: 40, percentage: 40 },
        { selected_option: "Blue", count: 30, percentage: 30 },
        { selected_option: "White", count: 20, percentage: 20 },
        { selected_option: "Gray", count: 10, percentage: 10 },
      ],
    },
    {
      question_text: "What size do you wear?",
      options: [
        { selected_option: "S", count: 20, percentage: 20 },
        { selected_option: "M", count: 40, percentage: 40 },
        { selected_option: "L", count: 30, percentage: 30 },
        { selected_option: "XL", count: 10, percentage: 10 },
      ],
    },
  ],
};

export const DUMMY_ANALYTICS: Analytics = {
  total_responses: 100,
  satisfaction_rate: 85,
  recommendation_rate: 75,
  completion_rate: 92,
  average_time: "2.5 minutes",
  popular_choices: {
    tshirt: "Basic Tee",
    color: "Black",
    size: "M",
  },
};
