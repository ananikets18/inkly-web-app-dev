# ReflectModal Implementation Documentation

## Overview
The ReflectModal was a feature that allowed users to reflect on and repost inks. It provided two main functionalities:
1. **Inkify (Repost)**: Share the original ink to your feed
2. **Reflection**: Add your own thoughts and commentary to the original ink

## Components Removed

### 1. ReflectModal Component (`components/ReflectModal.tsx`)

```tsx
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
import { useToast } from "@/hooks/use-toast";
import PROFANITY_LIST from "@/utils/profanityList";
import { containsProfanity, sanitizeInput, isEmojiSpam, isRepeatedCharSpam, isOnlyPunctuationOrWhitespace, containsLink } from "@/utils/textFilters";
import useCooldown from "../hooks/useCooldown";

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
  const [inputWarning, setInputWarning] = useState("");
  const MAX_CHARS = 140;
  const MIN_CHARS = 15;
  const charCount = text.length;
  const overCharLimit = charCount > MAX_CHARS;
  const underCharLimit = charCount < MIN_CHARS;
  const { isCoolingDown, trigger } = useCooldown(1200);

  const { toast } = useToast();

  // Modal open effect
  useEffect(() => {
    if (open) {
      // Modal opened
    }
  }, [open]);

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
      toast({
        title: "Too fast!",
        description: "Hold on a sec.",
        duration: 2000,
      });
      return;
    }
    if (!trigger()) return;
    if (overCharLimit || underCharLimit) {
      return;
    }
    if (containsProfanity(text)) {
      setInputWarning("Please remove inappropriate language.");
      return;
    }
    if (isEmojiSpam(text)) {
      setInputWarning("Too many emojis detected. Please write a clear reflection.");
      return;
    }
    if (isRepeatedCharSpam(text)) {
      setInputWarning("Please avoid repeated character spam.");
      return;
    }
    if (isOnlyPunctuationOrWhitespace(text)) {
      setInputWarning("Reflection cannot be only punctuation or whitespace.");
      return;
    }
    if (containsLink(text)) {
      setInputWarning("Links are not allowed in reflections.");
      return;
    }
    setInputWarning("");
    if (text.trim().length > 0) {
      onSubmit(sanitizeInput(text));
      toast({
        title: "Reflection posted!",
        description: "Your reflection is now part of the story ✨",
        duration: 3000,
      });
      setText("");
      setMode("menu");
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleRepost = () => {
    if (isCoolingDown) {
      toast({
        title: "Too fast!",
        description: "Hold on a sec.",
        duration: 2000,
      });
      return;
    }
    if (!trigger()) return;
    onRepost?.();
    toast({
      title: "Reposted!",
      description: "This Ink now echoes through your feed 🌀",
      duration: 3000,
    });
    setMode("menu");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const handleClose = () => {
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
    </>
  );
}
```

### 2. Hook Updates (`hooks/use-ink-actions.ts`)

The following state and functions were removed from the hook:

```tsx
// Reflect modal state
const [showReflectModal, setShowReflectModal] = useState(false);
const openReflectModal = () => setShowReflectModal(true);
const closeReflectModal = () => setShowReflectModal(false);

// Return values
showReflectModal,
openReflectModal,
closeReflectModal,
```

### 3. Component Integration

#### InkCard Component (`components/InkCard.tsx`)

**Props to remove:**
```tsx
reflectOpen: boolean
setReflectOpen: (value: boolean) => void
reflectionCountLocal: number
setReflectionCountLocal: (value: number) => void
hasReflected: boolean
setHasReflected: (value: boolean) => void
```

**Button to remove:**
```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={(e) => {
    e.stopPropagation()
    setReflectOpen(true)
  }}
  onMouseEnter={onHover}
  className="relative text-muted-foreground hover:text-blue-600 w-8 h-8"
  disabled={hasReflected && hasInkified}
  title="Add reflection or repost"
>
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h.582a10.054 10.054 0 0115.775-1.317M20 20v-5h-.582a10.054 10.054 0 01-15.775 1.317"
    />
  </svg>
</Button>
```

**Modal component to remove:**
```tsx
<ReflectModal
  open={reflectOpen}
  onClose={() => setReflectOpen(false)}
  onRepost={() => {
    setHasInkified(true)
    setReflectOpen(false)
  }}
  onUndoRepost={() => {
    setHasInkified(false)
    toast({
      title: "Inkify undone",
      description: "You can repost if you wish.",
      duration: 2500,
    })
    setReflectOpen(false)
  }}
  onSubmit={(text) => {
    setReflectionCountLocal(reflectionCountLocal + 1)
    setHasReflected(true)
    console.log("Reflection text:", text)
  }}
  originalInk={{ content, author, timestamp: "2h ago" }}
  hasReflected={hasReflected}
/>
```

#### InkCardMobile Component (`components/InkCardMobile.tsx`)

**Props to remove:**
```tsx
reflectOpen: boolean
setReflectOpen: (value: boolean) => void
reflectionCountLocal: number
setReflectionCountLocal: (value: number | ((prev: number) => number)) => void
hasReflected: boolean
setHasReflected: (value: boolean) => void
```

**Button to remove:**
```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={() => setReflectOpen(true)}
  className="text-gray-500 hover:text-blue-600"
  title="Add reflection or repost"
  aria-label="Add reflection or repost"
>
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h.582a10.054 10.054 0 0115.775-1.317M20 20v-5h-.582a10.054 10.054 0 01-15.775 1.317"
    />
  </svg>
</Button>
```

**Modal component to remove:**
```tsx
<ReflectModal
  open={reflectOpen}
  onClose={() => setReflectOpen(false)}
  onRepost={() => {
    setHasInkified(true)
    setReflectOpen(false)
  }}
  onSubmit={(text) => {
    setReflectionCountLocal((prev: number) => prev + 1)
    setHasReflected(true)
    setReflectOpen(false)
  }}
  originalInk={{ content, author, timestamp: "3h ago" }}
  hasReflected={hasReflected}
  hasInkified={hasInkified}
  onUndoRepost={() => {}}
/>
```

#### InkDetails Component (`components/InkDetails.tsx`)

**Button to remove:**
```tsx
{/* Reflect/Inkify Button */}
<div>
  <Button
    variant="ghost"
    size="lg"
    className="flex items-center gap-2 rounded-full px-4"
    onClick={() => setReflectOpen(true)}
  >
    <MessageCircle className="w-5 h-5" />
    <span className="font-medium">Reflect</span>
    {stats.comments > 0 && (
      <span className="text-sm text-muted-foreground">{formatCount(stats.comments)}</span>
    )}
  </Button>
  <ReflectModal
    open={reflectOpen}
    onClose={() => setReflectOpen(false)}
    onRepost={() => setReflectOpen(false)}
    onUndoRepost={() => {}}
    onSubmit={() => setReflectOpen(false)}
    originalInk={{ content: ink.content, author: ink.author, timestamp: ink.createdAt }}
    hasReflected={false}
    hasInkified={false}
  />
</div>
```

## Features and Functionality

### 1. Modal States
- **Menu Mode**: Shows options to Inkify or Add Reflection
- **Reflection Mode**: Text input for writing reflections

### 2. Validation Features
- **Character Limits**: 15-140 characters
- **Profanity Filter**: Blocks inappropriate content
- **Emoji Spam Detection**: Prevents excessive emoji use
- **Repeated Character Detection**: Prevents character spam
- **Link Detection**: Blocks URLs in reflections
- **Punctuation/Whitespace Check**: Ensures meaningful content

### 3. User Experience
- **Cooldown System**: Prevents rapid submissions (1.2s)
- **Toast Notifications**: Success/error feedback
- **Keyboard Support**: Escape key to close
- **Animation**: Smooth transitions with Framer Motion
- **Accessibility**: Proper ARIA labels and keyboard navigation

### 4. Visual Design
- **Purple Theme**: Consistent with app branding
- **Responsive**: Works on mobile and desktop
- **Clean UI**: Modern dialog with rounded corners
- **Icon Integration**: Lucide React icons

## Dependencies Required

```json
{
  "dependencies": {
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.263.0",
    "@radix-ui/react-dialog": "^1.0.0"
  }
}
```

## Utility Functions Needed

### Text Validation (`utils/textFilters.ts`)
```tsx
export const containsProfanity = (text: string): boolean => {
  // Implementation for profanity detection
}

export const sanitizeInput = (text: string): string => {
  // Implementation for input sanitization
}

export const isEmojiSpam = (text: string): boolean => {
  // Implementation for emoji spam detection
}

export const isRepeatedCharSpam = (text: string): boolean => {
  // Implementation for repeated character detection
}

export const isOnlyPunctuationOrWhitespace = (text: string): boolean => {
  // Implementation for punctuation/whitespace check
}

export const containsLink = (text: string): boolean => {
  // Implementation for link detection
}
```

### Cooldown Hook (`hooks/useCooldown.ts`)
```tsx
import { useState, useCallback } from 'react';

const useCooldown = (duration: number) => {
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  const trigger = useCallback(() => {
    if (isCoolingDown) return false;
    
    setIsCoolingDown(true);
    setTimeout(() => setIsCoolingDown(false), duration);
    return true;
  }, [isCoolingDown, duration]);

  return { isCoolingDown, trigger };
};

export default useCooldown;
```

## State Management

### Required State Variables
```tsx
// Modal state
const [reflectOpen, setReflectOpen] = useState(false);

// Reflection state
const [reflectionCountLocal, setReflectionCountLocal] = useState(0);
const [hasReflected, setHasReflected] = useState(false);
const [hasInkified, setHasInkified] = useState(false);
```

## API Integration Points

### Backend Endpoints Needed
```typescript
// POST /api/reflections
interface CreateReflectionRequest {
  inkId: string;
  content: string;
  authorId: string;
}

// POST /api/inks/{inkId}/repost
interface RepostRequest {
  userId: string;
}

// DELETE /api/inks/{inkId}/repost
interface UndoRepostRequest {
  userId: string;
}
```

## Future Implementation Considerations

1. **Real-time Updates**: WebSocket integration for live reflection counts
2. **Rich Text**: Markdown support for reflections
3. **Media Attachments**: Image/video support in reflections
4. **Threading**: Nested reflections and replies
5. **Moderation**: AI-powered content moderation
6. **Analytics**: Track reflection engagement metrics
7. **Notifications**: Alert users when their ink receives reflections
8. **Search**: Search through reflections
9. **Export**: Allow users to export their reflections
10. **Collaboration**: Multiple users can collaborate on reflections

## Testing Strategy

### Unit Tests
```tsx
describe('ReflectModal', () => {
  it('should validate character limits', () => {
    // Test minimum and maximum character validation
  });

  it('should detect profanity', () => {
    // Test profanity filter
  });

  it('should prevent emoji spam', () => {
    // Test emoji spam detection
  });

  it('should handle cooldown correctly', () => {
    // Test cooldown functionality
  });
});
```

### Integration Tests
```tsx
describe('ReflectModal Integration', () => {
  it('should open modal when reflect button is clicked', () => {
    // Test modal opening
  });

  it('should submit reflection successfully', () => {
    // Test reflection submission
  });

  it('should repost ink successfully', () => {
    // Test repost functionality
  });
});
```

## Performance Considerations

1. **Debounced Input**: Prevent excessive re-renders during typing
2. **Lazy Loading**: Load modal content only when needed
3. **Memoization**: Cache validation results
4. **Virtual Scrolling**: For long lists of reflections
5. **Image Optimization**: Compress and lazy load images

## Security Considerations

1. **Input Sanitization**: Prevent XSS attacks
2. **Rate Limiting**: Prevent spam submissions
3. **Content Moderation**: Filter inappropriate content
4. **User Authentication**: Ensure only authenticated users can reflect
5. **Data Validation**: Validate all inputs server-side

## Accessibility Features

1. **Keyboard Navigation**: Full keyboard support
2. **Screen Reader Support**: Proper ARIA labels
3. **Focus Management**: Proper focus trapping
4. **High Contrast**: Support for high contrast themes
5. **Reduced Motion**: Respect user motion preferences

This documentation provides a complete reference for reimplementing the ReflectModal feature in the future, including all necessary components, hooks, utilities, and considerations for a robust implementation. 