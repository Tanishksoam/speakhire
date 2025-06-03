"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface PublishModalProps {
  formId: string;
  formToken: string;
  onClose: () => void;
  onPublish: (emails: string[]) => void;
  formTitle: string;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PublishFormDialog({ formId, formToken, onClose, onPublish, open, onOpenChange }: PublishModalProps) {
  const [emailInput, setEmailInput] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [invalidEmailsMessage, setInvalidEmailsMessage] = useState("")

  const handleAddEmail = () => {
    if (!emailInput) return

    // Split by commas to support multiple emails at once
    const emailsToAdd = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "")

    if (emailsToAdd.length === 0) return

    // Check for invalid emails
    const invalidEmails = emailsToAdd.filter((email) => !isValidEmail(email))
    if (invalidEmails.length > 0) {
      setInvalidEmailsMessage(`Invalid email(s): ${invalidEmails.join(", ")}`)
      return
    }

    // Filter out emails that are already in the list
    const newValidEmails = emailsToAdd.filter((email) => !emails.includes(email))

    if (newValidEmails.length > 0) {
      setEmails([...emails, ...newValidEmails])
      setEmailInput("")
      setInvalidEmailsMessage("")
    } else if (emailsToAdd.every((email) => emails.includes(email))) {
      setInvalidEmailsMessage("All emails already added")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const handlePublish = () => {
    onPublish(emails)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    onClose()
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish Form</DialogTitle>
          <DialogDescription>Your form is ready to be published. Share it with recipients via email.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Form ID</Label>
            <div className="flex">
              <Input value={formId} readOnly className="font-mono" />
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => navigator.clipboard.writeText(formId)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-copy"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Form Token</Label>
            <div className="flex">
              <Input value={formToken} readOnly className="font-mono" />
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => navigator.clipboard.writeText(formToken)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-copy"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients</Label>
            <div className="flex">
              <Input
                id="recipients"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value)
                  setInvalidEmailsMessage("")
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter email addresses separated by commas"
                type="email"
                className={invalidEmailsMessage ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="secondary"
                className="ml-2"
                onClick={handleAddEmail}
                disabled={!emailInput}
              >
                Add
              </Button>
            </div>

            {invalidEmailsMessage && <p className="text-sm text-red-500">{invalidEmailsMessage}</p>}

            <p className="text-sm text-muted-foreground">
              Enter multiple email addresses separated by commas. Recipients will receive a link and can only submit
              once.
            </p>

            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {emails.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                    {email}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeEmail(email)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handlePublish} disabled={emails.length === 0}>
            {emails.length === 0
              ? "Add recipients to publish"
              : `Publish to ${emails.length} recipient${emails.length !== 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
