import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TopNavbar: React.FC = () => {
  return (
    <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-white z-10 sticky top-0 left-0 right-0">
      <div className="flex space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                <i className="fas fa-edit mr-2"></i>Edit
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit form properties</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                <i className="fas fa-code mr-2"></i>Response
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get responses</p>
            </TooltipContent>
          </Tooltip>


          
        </TooltipProvider>
      </div>
    </div>
  );
};