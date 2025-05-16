import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../store/features/customFormSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormTitleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormTitleSubmit: (title: string) => void;
  initialTitle?: string;
}

export const FormTitle: React.FC<FormTitleProps> = ({
  open,
  onOpenChange,
  onFormTitleSubmit,
  initialTitle = "",
}) => {
  const [formTitle, setFormTitle] = useState(initialTitle);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormTitle(initialTitle);
      setError("");
    }
  }, [open, initialTitle]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formTitle.trim()) {
      setError("Please enter a form title");
      return;
    }

    // Update Redux store with the form title
    dispatch(setTitle(formTitle.trim()));
    
    // Notify parent component
    onFormTitleSubmit(formTitle.trim());
    
    // Close the dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            Give your form a title to get started. You can change it later.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="form-title" className="text-sm font-medium text-gray-700">
              Form Title
            </label>
            <input
              id="form-title"
              type="text"
              value={formTitle}
              onChange={handleTitleChange}
              placeholder="Enter form title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Form
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormTitle;