"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Repeat, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import FloatingToast from "@/components/FloatingToast";
import PROFANITY_LIST from "@/utils/profanityList";
import { containsProfanity, sanitizeInput, isEmojiSpam, isRepeatedCharSpam, isOnlyPunctuationOrWhitespace, containsLink } from "@/utils/textFilters";
import useCooldown from "../hooks/useCooldown";
import { useSoundEffects } from "../hooks/useSoundEffects";


interface ReflectModalProps {
  open: boolean;
  onClose: () => void;
  onRepost: () => void;
  onUndoRepost: () => void;
  onSubmit: (text: string) => void;
  originalInk: {
    content: string;
    author: string;
    timestamp: string;
  };
  hasReflected: boolean;
  hasInkified: boolean;
}

export default function ReflectModal({
  open,
  onClose,
  onRepost,
  onUndoRepost,
  onSubmit,
  originalInk,
  hasReflected,
  hasInkified,
}: ReflectModalProps) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"menu" | "reflect">("menu");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [inputWarning, setInputWarning] = useState("");
  const MAX_CHARS = 140;
  const MIN_CHARS = 15;
  const charCount = text.length;
  const overCharLimit = charCount > MAX_CHARS;
  const underCharLimit = charCount < MIN_CHARS;
  const { isCoolingDown, trigger } = useCooldown(1200);
  const { playSound } = useSoundEffects();

  // Play modal open sound when modal opens
  useEffect(() => {
    if (open) {
      playSound("modalOpen");
    }
  }, [open, playSound]);

  // Escape key closes modal
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  const handleReflectSubmit = () => {
    if (isCoolingDown) {
      playSound("error");
      setToastMsg("Too fast! Hold on a sec.");
      return;
    }
    if (!trigger()) return;
    if (overCharLimit || underCharLimit) {
      playSound("error");
      return;
    }
    if (containsProfanity(text)) {
      playSound("error");
      setInputWarning("Please remove inappropriate language.");
      return;
    }
    if (isEmojiSpam(text)) {
      playSound("error");
      setInputWarning("Too many emojis detected. Please write a clear reflection.");
      return;
    }
    if (isRepeatedCharSpam(text)) {
      playSound("error");
      setInputWarning("Please avoid repeated character spam.");
      return;
    }
    if (isOnlyPunctuationOrWhitespace(text)) {
      playSound("error");
      setInputWarning("Reflection cannot be only punctuation or whitespace.");
      return;
    }
    if (containsLink(text)) {
      playSound("error");
      setInputWarning("Links are not allowed in reflections.");
      return;
    }
    setInputWarning("");
    if (text.trim().length > 0) {
      playSound("reflection");
      onSubmit(sanitizeInput(text));
      setToastMsg("Your reflection is now part of the story ✨");
      setText("");
      setMode("menu");
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleRepost = () => {
    if (isCoolingDown) {
      playSound("error");
      setToastMsg("Too fast! Hold on a sec.");
      return;
    }
    if (!trigger()) return;
    playSound("inkify");
    onRepost?.();
    setToastMsg("Reposted! This Ink now echoes through your feed 🌀");
    setMode("menu");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const handleClose = () => {
    playSound("modalClose");
    setText("");
    setMode("menu");
    onClose();
  };

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Reflect on this Ink</DialogTitle>
        </DialogHeader>

        {/* Original Ink MiniCard */}
            <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="border rounded-md bg-gray-50 p-3 mb-4 text-sm shadow-sm"
            >
            <div className="flex items-center justify-between mb-1 text-xs text-gray-500">
                <span className="font-medium">{originalInk.author}</span>
                <span>{formatTimeAgo(originalInk.timestamp)}</span>
            </div>
            <div className="text-gray-700 whitespace-pre-wrap leading-snug">
                {originalInk.content.length > 240
                ? originalInk.content.slice(0, 240) + "…"
                : originalInk.content}
            </div>
            </motion.div>


        {/* Action: Menu or Reflection Input */}
        {mode === "menu" ? (
          <div className="grid gap-3">
          <Button
            onClick={hasInkified ? onUndoRepost : handleRepost}
            className="w-full justify-start gap-2 text-purple-700 bg-purple-50 hover:bg-purple-100"
          >
            <Repeat className="w-4 h-4" />
            {hasInkified ? "Undo Inkify" : "Inkify this Ink"}
          </Button>

            <Button
              onClick={() => setMode("reflect")}
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={hasReflected}
            >
              <Pencil className="w-4 h-4" />
              Add your own reflection
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onPaste={handlePaste}
              rows={5}
              placeholder="Write your reflection..."
              maxLength={MAX_CHARS + 10}
            />
            <div className="flex items-center justify-between text-xs mt-1">
              <span className={
                overCharLimit ? "text-red-600 font-semibold" : !underCharLimit && charCount > 0 ? "text-green-600" : "text-gray-400"
              }>
                {charCount} / {MAX_CHARS} characters
              </span>
              {overCharLimit && <span className="text-red-600 ml-2">Character limit exceeded!</span>}
              {underCharLimit && charCount > 0 && <span className="text-yellow-600 ml-2">Add at least {MIN_CHARS} characters</span>}
            </div>
            {inputWarning && (
              <div className="mt-1 text-xs text-red-600 font-semibold animate-pulse">{inputWarning}</div>
            )}
            <DialogFooter className="gap-2 justify-end">
              <Button variant="ghost" onClick={() => setMode("menu")}>
                Back
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 active:bg-purple-700" onClick={handleReflectSubmit} disabled={text.trim().length === 0 || overCharLimit || underCharLimit}>
                Post Reflection
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>

      {toastMsg && (
        <FloatingToast key={toastMsg} message={toastMsg} />
      )}


    </>
  );
}
