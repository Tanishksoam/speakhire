import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Zap } from 'lucide-react';
import { PublishFormDialog } from './publishFormDialog';

interface TopNavbarProps {
  formId: string;
  formTitle: string;
  activeTab?: 'edit' | 'response';
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ formId, formTitle, activeTab = 'edit' }) => {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  return (
    <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white z-10 sticky top-0 left-0 right-0">
      <div className="flex space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTab === 'edit' ? 'default' : 'ghost'} 
                className={`flex items-center ${activeTab === 'edit' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
              >
                <i className="fas fa-edit mr-2"></i>Edit
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit form properties</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTab === 'response' ? 'default' : 'ghost'} 
                className={`flex items-center ${activeTab === 'response' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
              >
                <i className="fas fa-code mr-2"></i>Response
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get responses</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Preview and Publish buttons */}
      <div className="flex items-center space-x-3">
        <Button  className="border border-gray-300 border-width-2 bg-white text-gray-700 hover:bg-gray-100 ">
          Preview
        </Button>
        
        <Button className="bg-gray-900 text-white hover:bg-gray-800 flex items-center" onClick={() => setPublishDialogOpen(true)}>
          Publish <Zap className="ml-2 h-4 w-4" />
        </Button>
        <PublishFormDialog
          formId={formId}
          formTitle={formTitle}
          formToken={"dummy-token"}
          onClose={() => setPublishDialogOpen(false)}
          onPublish={(emails) => { /* TODO: implement publish logic */ }}
          open={publishDialogOpen}
          onOpenChange={setPublishDialogOpen}
        />
      </div>
    </div>
  );
};