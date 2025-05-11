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
    <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-white">
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
                <i className="fas fa-code mr-2"></i>Integrate
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get integration code</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                <i className="fas fa-share mr-2"></i>Share
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share this form</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                <i className="fas fa-chart-bar mr-2"></i>Results
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View form results</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                <i className="fas fa-cog mr-2"></i>Settings
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Form settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};