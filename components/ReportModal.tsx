"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import ToastPortal from "./ToastPortal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DOMPurify from 'dompurify';
import PROFANITY_LIST from "@/utils/profanityList";
import { containsProfanity, sanitizeInput, isEmojiSpam, isRepeatedCharSpam, isOnlyPunctuationOrWhitespace, containsLink } from "@/utils/textFilters";

const reportReasons = [
  "Spam or misleading",
  "Hate speech or symbols",
  "Harassment or bullying",
  "Explicit or adult content",
  "False information",
  "Other",
];

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  inkId: string;
  content: string;
}

export default function ReportModal({
  open,
  onClose,
  inkId,
  content, // currently unused but included for future expansion
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customText, setCustomText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [inputWarning, setInputWarning] = useState("");

  const MAX_CHARS = 350;
  const isOther = selectedReason === "Other";
  const isOverLimit = customText.length > MAX_CHARS;

  const handleSubmit = async () => {
    if (!selectedReason) return;

    if (isOther && isOverLimit) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }

    if (isOther && !customText.trim()) return;

    // Sanitize input before submission
    const safeText = isOther ? sanitizeInput(customText) : '';
    if (isOther && containsProfanity(safeText)) {
      setInputWarning("Please remove inappropriate language.");
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    if (isOther && isEmojiSpam(safeText)) {
      setInputWarning("Too many emojis detected. Please write a clear description.");
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    if (isOther && isRepeatedCharSpam(safeText)) {
      setInputWarning("Please avoid repeated character spam.");
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    if (isOther && isOnlyPunctuationOrWhitespace(safeText)) {
      setInputWarning("Description cannot be only punctuation or whitespace.");
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    if (isOther && containsLink(safeText)) {
      setInputWarning("Links are not allowed in reports.");
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    setInputWarning("");

    setShowToast(true);
    setToastVisible(true);
    setIsSubmitting(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 2500);

    setTimeout(() => {
      setShowToast(false);
    }, 2500);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      setSelectedReason("");
      setCustomText("");
    }, 800);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showToast]);

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="w-[92%] sm:max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-7 shadow-2xl z-[100]"
        >
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-center text-zinc-900 dark:text-white mb-4">
            Report this Ink
          </DialogTitle>
          <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 mb-6">
            Help us keep Inkly safe. Why are you reporting this?
          </p>

          <RadioGroup
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="space-y-3"
          >
            {reportReasons.map((reason) => (
              <div key={reason} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={reason}
                  id={reason}
                  className="border-zinc-300 dark:border-zinc-600"
                />
                <Label
                  htmlFor={reason}
                  className="text-sm text-zinc-700 dark:text-zinc-300"
                >
                  {reason}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {isOther && (
            <div className="mt-4">
              <Label
                htmlFor="customReason"
                className="block mb-2 text-sm text-zinc-700 dark:text-zinc-300"
              >
                Please describe the issue
              </Label>

              <Textarea
                id="customReason"
                placeholder="Describe your concern..."
                value={customText}
                onChange={(e) => {
                  // Prevent HTML/script pasting
                  let val = e.target.value;
                  val = val.replace(/<[^>]*>?/gm, "");
                  if (val.length <= MAX_CHARS + 10) {
                    setCustomText(val);
                  }
                }}
                onPaste={e => {
                  e.preventDefault();
                  // Optionally, paste only plain text
                  const text = e.clipboardData.getData('text/plain').replace(/<[^>]*>?/gm, "");
                  document.execCommand('insertText', false, text);
                }}
                className={`min-h-[100px] resize-none outline-none text-sm transition-all duration-200 bg-zinc-50 dark:bg-zinc-800 ${
                  isOverLimit
                    ? "border-red-500 ring-1 ring-red-500 animate-border-pulse"
                    : "border-zinc-300 dark:border-zinc-600 focus-visible:ring-zinc-500"
                } ${shouldShake ? "animate-shake" : ""}`}
              />

              <div
                className={`mt-1 text-right text-xs transition ${
                  isOverLimit
                    ? "text-red-500"
                    : customText.length > MAX_CHARS * 0.9
                    ? "text-yellow-500"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
                aria-live="polite"
              >
                {customText.length} / {MAX_CHARS} characters
              </div>
              {inputWarning && (
                <div className="mt-1 text-xs text-red-600 font-semibold animate-pulse">{inputWarning}</div>
              )}
            </div>
          )}

          <Button
            onClick={e => { e.stopPropagation(); handleSubmit() }}
            disabled={
              !selectedReason ||
              (isOther && (!customText.trim() || isOverLimit)) ||
              isSubmitting
            }
            className="mt-6 w-full"
            title={!selectedReason ? "Please select a reason" : (isOther && (!customText.trim() || isOverLimit)) ? "Please provide a valid description" : "Submit your report"}
          >
            {isSubmitting ? "Reporting..." : "Submit Report"}
          </Button>
        </DialogContent>
      </Dialog>

      {showToast && (
        <ToastPortal>
          <div
            className={`fixed bottom-6 right-6 z-[9999] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 transition-opacity duration-500 ${
              toastVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs md:text-sm text-zinc-800 dark:text-zinc-200">
              Thanks for reporting. We'll review this Ink.
            </span>
          </div>
        </ToastPortal>
      )}
    </>
  );
}
