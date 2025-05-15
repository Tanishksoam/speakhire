import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { PublishFormDialog } from "./publishFormDialog";

interface TopNavbarProps {
  formId: string;
  formTitle: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ formId, formTitle }) => {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  return (
    <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white z-10 sticky top-0 left-0 right-0">
      <div className="flex space-x-4">
        {/* Removed edit/response buttons */}
      </div>

      {/* Preview and Publish buttons */}
      <div className="flex items-center space-x-3">
        <Button className="border border-gray-300 border-width-2 bg-white text-gray-700 hover:bg-gray-100 ">
          Preview
        </Button>

        <Button
          className="bg-gray-900 text-white hover:bg-gray-800 flex items-center"
          onClick={() => setPublishDialogOpen(true)}
        >
          Publish <Zap className="ml-2 h-4 w-4" />
        </Button>
        <PublishFormDialog
          formId={formId}
          formTitle={formTitle}
          formToken={"dummy-token"}
          onClose={() => setPublishDialogOpen(false)}
          onPublish={() => {
            /* TODO: implement publish logic */
          }}
          open={publishDialogOpen}
          onOpenChange={setPublishDialogOpen}
        />
      </div>
    </div>
  );
};
