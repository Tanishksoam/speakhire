"use client";
// Using JSX without importing React is supported in React 17+
// with the new JSX transform
import { TSHIRT_FORM_DATA } from "./constants";

interface Response {
  id: number;
  submission_id: string;
  question_text: string;
  selected_option: string;
  submitted_at: string;
  [key: string]: string | number;
}

interface ResponsesTableProps {
  responses: Response[];
  editingResponse: Response | null;
  setEditingResponse: (response: Response | null) => void;
  handleEdit: () => void;
  handleSort: (key: string) => void;
  sortConfig: { key: string | null; direction: string };
}

export default function ResponsesTable({ 
  responses, 
  editingResponse, 
  setEditingResponse, 
  handleEdit, 
  handleSort, 
  sortConfig 
}: ResponsesTableProps) {
  const getSortIndicator = (key: string): string => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("question_text")}
            >
              Question{getSortIndicator("question_text")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("selected_option")}
            >
              Response{getSortIndicator("selected_option")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("submitted_at")}
            >
              Submitted At{getSortIndicator("submitted_at")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {responses.map((response) => (
            <tr key={response.id}>
              <td className="px-6 py-4 whitespace-nowrap font-roboto">
                {response.question_text}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-roboto">
                {editingResponse?.id === response.id ? (
                  <select
                    value={editingResponse.selected_option}
                    onChange={(e) =>
                      setEditingResponse({
                        ...editingResponse,
                        selected_option: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded px-3 py-1"
                  >
                    {TSHIRT_FORM_DATA.map((item) => (
                      <option
                        key={
                          response.question_text.includes("t-shirt")
                            ? item.name
                            : response.question_text.includes("color")
                            ? item.color
                            : item.size
                        }
                        value={
                          response.question_text.includes("t-shirt")
                            ? item.name
                            : response.question_text.includes("color")
                            ? item.color
                            : item.size
                        }
                      >
                        {response.question_text.includes("t-shirt")
                          ? item.name
                          : response.question_text.includes("color")
                          ? item.color
                          : item.size}
                      </option>
                    ))}
                  </select>
                ) : (
                  response.selected_option
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-roboto">
                {/* Using a fixed date format to avoid hydration errors */}
                {new Date(response.submitted_at).toISOString().replace('T', ' ').substring(0, 19)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingResponse?.id === response.id ? (
                  <div className="space-x-2">
                    <button
                      onClick={handleEdit}
                      className="text-green-600 hover:text-green-900"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingResponse(null)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingResponse(response)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
