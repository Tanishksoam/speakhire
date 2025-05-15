import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Check, Copy, Link } from "lucide-react";
// Import the RTK Query hook instead of the custom API service
import { usePublishFormMutation } from "@/store/api/apiSlice";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

interface PublishFormDialogProps {
  formId: string;
  formTitle: string;
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PublishFormDialog({
  formId,
  formTitle,
  trigger,
  defaultOpen,
  open,
  onOpenChange,
}: PublishFormDialogProps) {
  const [copied, setCopied] = useState(false);
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [responseLimitEnabled, setResponseLimitEnabled] = useState(false);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTemplate, setisTemplate] = useState(false);
  // Initialize with a placeholder, will be updated with the actual URL from the server after publishing
  const [shareableLink, setShareableLink] = useState<string>("");

  // We'll also track if there's an error during publishing
  const [publishError, setPublishError] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with others.",
    });
  };

  // Use the RTK Query hook for publishing forms
  const [publishForm, { isLoading, isSuccess, isError, error, data }] =
    usePublishFormMutation();

  // Update state based on the mutation status
  useEffect(() => {
    if (isSuccess && data) {
      console.log(
        "Publish success, full response data:",
        JSON.stringify(data, null, 2)
      );
      setisTemplate(true);

      // Force a more explicit check on the response structure
      try {
        // Check if data.form exists and has a publishedUrl property
        if (data.form && typeof data.form === "object") {
          console.log("Form object found:", data.form);

          // Check for publishedUrl in the form object
          if (
            "publishedUrl" in data.form &&
            typeof data.form.publishedUrl === "string"
          ) {
            console.log(
              "Found publishedUrl in form object:",
              data.form.publishedUrl
            );
            setShareableLink(data.form.publishedUrl);
          } else {
            throw new Error("No publishedUrl in form object");
          }
        } else {
          // If data.form doesn't exist, look for publishedUrl directly in the data object
          if ("publishedUrl" in data && typeof data.publishedUrl === "string") {
            console.log(
              "Found publishedUrl directly in data:",
              data.publishedUrl
            );
            setShareableLink(data.publishedUrl);
          } else {
            throw new Error("No form object or publishedUrl in response");
          }
        }
      } catch (error) {
        console.error("Error extracting publishedUrl:", error);
        // Always use a fallback URL if we can't find the publishedUrl
        const fallbackUrl = `${window.location.origin}/f/${formId}`;
        console.log("Using fallback URL:", fallbackUrl);
        setShareableLink(fallbackUrl);
      }

      toast({
        title: "Form published successfully",
        description: "Your form is now live and ready to be shared.",
      });
    }

    if (isError) {
      const errorMessage =
        error && "data" in error
          ? String(error.data)
          : "An unexpected error occurred.";

      setPublishError(errorMessage);
      toast({
        title: "Error publishing form",
        description: errorMessage,
        variant: "destructive",
      });
    }

    // Update the isPublishing state based on the RTK Query loading state
    setIsPublishing(isLoading);
  }, [isLoading, isSuccess, isError, error, data, formId, toast]);

  const handlePublish = useCallback(async () => {
    setPublishError(null); // Clear any previous errors

    // Call the RTK Query mutation
    await publishForm(formId);
  }, [formId, publishForm, setPublishError]);

  const handleSocialShare = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareableLink
        )}&text=${encodeURIComponent(`Check out my form: ${formTitle}`)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareableLink
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareableLink
        )}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(
          `Check out my form: ${formTitle}`
        )}&body=${encodeURIComponent(
          `I've created a form that I'd like to share with you: ${shareableLink}`
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  // Effect to automatically publish the form when the dialog opens
  useEffect(() => {
    if (open && formId && !isTemplate && !isPublishing) {
      // Automatically publish the form when the dialog opens
      handlePublish();
    }
  }, [open, formId, isTemplate, isPublishing, handlePublish]);

  // Handle dialog open state changes
  const handleOpenChange = (newOpenState: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpenState);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      defaultOpen={defaultOpen}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Publish Form</DialogTitle>
          <DialogDescription>
            Make your form available to respondents and customize sharing
            settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Sharing Options</TabsTrigger>
            <TabsTrigger value="settings">Access Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 pt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Form Link</h3>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input value={shareableLink} readOnly className="pr-10" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy link</span>
                  </Button>
                </div>
                <Button onClick={handleCopyLink}>
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Share this link with people you want to fill out your form.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Embed Options</h3>
              <RadioGroup defaultValue="link">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="r1" />
                  <Label htmlFor="r1">Share as link</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="embed" id="r2" />
                  <Label htmlFor="r2">Embed in website</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="qr" id="r3" />
                  <Label htmlFor="r3">QR code</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="expiration" className="text-sm font-medium">
                    Expiration Date
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Set a date when the form will no longer accept responses.
                  </p>
                </div>
                <Switch
                  id="expiration"
                  checked={expirationEnabled}
                  onCheckedChange={setExpirationEnabled}
                />
              </div>

              {expirationEnabled && (
                <div className="pl-6 border-l-2 border-muted">
                  <Label htmlFor="expiration-date">Select Date</Label>
                  <Input
                    id="expiration-date"
                    type="date"
                    className="mt-1"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="response-limit"
                    className="text-sm font-medium"
                  >
                    Response Limit
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Limit the number of responses your form can receive.
                  </p>
                </div>
                <Switch
                  id="response-limit"
                  checked={responseLimitEnabled}
                  onCheckedChange={setResponseLimitEnabled}
                />
              </div>

              {responseLimitEnabled && (
                <div className="pl-6 border-l-2 border-muted">
                  <Label htmlFor="max-responses">Maximum Responses</Label>
                  <Input
                    id="max-responses"
                    type="number"
                    min="1"
                    placeholder="100"
                    className="mt-1"
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="password-protection"
                    className="text-sm font-medium"
                  >
                    Password Protection
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require a password to access the form.
                  </p>
                </div>
                <Switch
                  id="password-protection"
                  checked={passwordEnabled}
                  onCheckedChange={setPasswordEnabled}
                />
              </div>

              {passwordEnabled && (
                <div className="pl-6 border-l-2 border-muted">
                  <Label htmlFor="form-password">Form Password</Label>
                  <Input
                    id="form-password"
                    type="password"
                    placeholder="Enter password"
                    className="mt-1"
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="email-notification"
                    className="text-sm font-medium"
                  >
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive an email when someone submits a response.
                  </p>
                </div>
                <Switch id="email-notification" defaultChecked />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col w-full gap-4">
          {publishError && (
            <div className="w-full p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
              <strong>Error:</strong> {publishError}
            </div>
          )}

          {isTemplate && shareableLink && (
            <div className="w-full p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">
                  Your form is now published!
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-green-700"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white border border-green-200 rounded">
                <Link className="h-4 w-4 text-green-600 flex-shrink-0" />
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="w-full bg-transparent border-none text-sm focus:outline-none focus:ring-0 text-green-700"
                  onClick={(e) => e.currentTarget.select()}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between sm:justify-between w-full">
            <div className="flex items-center">
              <Link className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{formTitle}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                {isTemplate ? "Close" : "Cancel"}
              </Button>
              {!isTemplate && (
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  variant="default"
                >
                  {isPublishing ? "Publishing..." : "Publish Form"}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
