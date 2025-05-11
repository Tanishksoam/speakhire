import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteField, duplicateField } from '../../store/features/FormBuilderSlice';
import type { Field } from '../../types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface FieldToolbarProps {
  field: Field;
}

export const FieldToolbar: React.FC<FieldToolbarProps> = ({ field }) => {
  const dispatch = useDispatch();

  const handleDuplicateField = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(duplicateField(field.id));
  };



  const handleImportQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement import functionality
    console.log("Import question for field:", field);
  };

    const handleDeleteField = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        dispatch(deleteField(field.id));
    };

  return (
    <div className="absolute -right-12 flex flex-col gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="p-2 bg-white rounded shadow hover:bg-gray-50 text-gray-600"
              onClick={handleDuplicateField}
            >
              <i className="fas fa-plus"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate field</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="p-2 bg-white rounded shadow hover:bg-gray-50 text-gray-600"
              onClick={handleImportQuestion}
            >
              <i className="fas fa-file-import"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import question</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="p-2 bg-white rounded shadow hover:bg-gray-50 text-gray-600"
            >
              <i className="fas fa-font"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Text options</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="p-2 bg-white rounded shadow hover:bg-gray-50 text-gray-600"
            >
              <i className="fas fa-image"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="p-2 bg-white rounded shadow hover:bg-gray-50 text-gray-600"
            >
              <i className="fas fa-video"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add video</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="p-2 bg-white rounded shadow hover:bg-gray-50 text-gray-600"
            >
              <i className="fas fa-cog"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Field settings</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="p-2 bg-white rounded shadow hover:bg-gray-50 text-red-500"
              onClick={handleDeleteField}
            >
              <i className="fas fa-trash"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete field</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};