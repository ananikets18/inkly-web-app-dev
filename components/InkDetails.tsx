import React, { useEffect } from "react";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { formatCount } from "@/utils/formatCount";
import { Badge } from "@/components/ui/badge";
import ShareButton from "@/components/ShareButton";
import ReactionButton from "@/components/reaction-button";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import ReflectModal from "@/components/ReflectModal";
import EchoedByModal from "@/components/EchoedByModal";
import BookmarkToast from "@/components/BookmarkToast";
import { Sparkles, Clock, Quote, BookOpen, MessageCircle, Info, PenLine, User, UserCheck, Star, Share2, Flag, Bookmark, Volume2, Pause, StopCircle } from "lucide-react";
import { detectInkType } from "@/utils/detectInkType";
import winkNLP from 'wink-nlp';
import winkModel from 'wink-eng-lite-web-model';
import { useInkActions } from "@/hooks/use-ink-actions";
import EchoPile from "@/components/EchoPile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FloatingToast from "@/components/FloatingToast";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { motion, AnimatePresence } from "framer-motion";
import EchoBurst from "@/components/EchoBurst";
import ReportModal from "@/components/ReportModal";
import ShareModal from "@/components/ShareModal";
import { clsx } from "clsx";
import VirtualizedMasonry from "@/components/VirtualizedMasonry";
import { reactions } from "./reaction-button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Settings } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import FeedLoader from "@/components/FeedLoader";
import { Switch } from "@/components/ui/switch";

// InkDetails.tsx
// This component displays the details of a single ink, including echo count, echo users, and interaction logic.
// Integrates with EchoedByModal for user list, and uses reactions from reaction-button for consistency.
// For future: Consider adding error boundaries for async data, and wire echo logic to real backend.

// --- Echo Logic ---
// For future: To support real backend, fetch echo users and their reactions from API. To support multi-user, merge current user actions with backend data.
// initialEchoUsers: array of users who have echoed this ink from the feed/backend
// echoUsers: stateful array of all users to display in avatars (initial + 'You' if user has echoed)
// echoCount: total echoes = initialEchoUsers.length + number of echo actions by current user
// The current user can add up to 4 echoes (reaction, bookmark, reflect, inkify), but only appears once in avatars
// +1 Echo animation triggers for each new action

interface InkDetailsProps {
  ink: {
    id: string;
    content: string;
    author: string;
    username: string;
    createdAt: string;
    readingTime: string;
    views: string;
    tags: string[];
    mood?: string;
    type?: string;
    editedAt?: string;
  };
  initialEchoUsers?: { name: string; avatar: string; reaction: string }[];
}

// Utility: consistent avatar color from name
const AVATAR_COLORS = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-yellow-500 to-orange-500",
  "from-emerald-500 to-green-500",
  "from-violet-500 to-purple-500",
  "from-sky-500 to-blue-500",
  "from-amber-500 to-yellow-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-pink-500"
];
function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
// Utility: format name (capitalize, remove underscores)
function formatName(name: string) {
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

// Dummy data for demo: 4 users who already echoed, each with a reaction
const DUMMY_ECHO_USERS = [
  { name: "Alice", avatar: "https://randomuser.me/api/portraits/women/1.jpg", reaction: "love" },
  { name: "Bob", avatar: "https://randomuser.me/api/portraits/men/2.jpg", reaction: "felt" },
  { name: "Carol", avatar: "https://randomuser.me/api/portraits/women/3.jpg", reaction: "relatable" },
  { name: "David", avatar: "https://randomuser.me/api/portraits/men/4.jpg", reaction: "wow" },
];

// Sample loading messages for loading state
const sampleMessages = [
  // Poems
  "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten.",
  "Hope was not a bird, but a fire quietly kept alive beneath her ribs.",
  // Dialogues
  '"Are you coming?" she asked. He smiled, "Always."',
  "'Promise me you'll stay.' 'Until the stars forget to shine.'",
  // Quotes
  "Whisper to the universe what you seek and it shall echo back tenfold.",
  "Every time your heart is broken, a doorway cracks open to a world full of new beginnings.",
  // Affirmations
  "A silent affirmation each morning shaped her every decision.",
  "Manifest with intention. Trust the magic in your breath.",
  // Dank tales
  "Once upon a meme, a frog ruled the internet.",
  "In a world of cats, be a keyboard warrior.",
  // Confessions
  "Confession: I still believe in magic.",
  "Sometimes I pretend to be busy just to avoid people.",
  // Facts
  "Did you know? Honey never spoils. Archaeologists have found edible honey in ancient tombs.",
  "Octopuses have three hearts and blue blood.",
  // Other
  "She wasn't soft because life was easy. She was soft like the sea—calm on the surface but carrying storms in the deep.",
  "Some stories aren't written. They're felt.",
];

export default function InkDetails({ ink, initialEchoUsers = DUMMY_ECHO_USERS }: InkDetailsProps) {
  const {
    isBookmarked,
    toggleBookmark,
    showBookmarkToast,
    selectedReaction,
    handleReaction,
    showReflectModal,
    openReflectModal,
    closeReflectModal,
  } = useInkActions(ink);

  const { playSound } = useSoundEffects();

  // Loading state if ink is not present
  if (!ink) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  // Memoize wink-nlp instance for performance
  const nlp = useMemo(() => winkNLP(winkModel), []);

  // Centralized type/mood logic
  const TYPE_CONFIG: Record<string, { color: string; icon: React.ReactElement; bgIcon: (key: React.Key) => React.ReactElement }> = {
    poem: {
      color: "bg-purple-50 text-purple-700",
      icon: <PenLine className="w-3.5 h-3.5 text-purple-400" />, bgIcon: (key: React.Key) => <PenLine key={key} className="absolute w-24 h-24 text-purple-100 opacity-60 z-0 pointer-events-none select-none" />
    },
    quote: {
      color: "bg-blue-50 text-blue-700",
      icon: <Quote className="w-3.5 h-3.5 text-blue-400" />, bgIcon: (key: React.Key) => <Quote key={key} className="absolute w-24 h-24 text-blue-100 opacity-60 z-0 pointer-events-none select-none" />
    },
    affirmation: {
      color: "bg-green-50 text-green-700",
      icon: <Sparkles className="w-3.5 h-3.5 text-yellow-400" />, bgIcon: (key: React.Key) => <Sparkles key={key} className="absolute w-24 h-24 text-yellow-100 opacity-60 z-0 pointer-events-none select-none" />
    },
    thought: {
      color: "bg-amber-50 text-amber-700",
      icon: <User className="w-3.5 h-3.5 text-gray-400" />, bgIcon: (key: React.Key) => <User key={key} className="absolute w-24 h-24 text-gray-100 opacity-60 z-0 pointer-events-none select-none" />
    },
    story: {
      color: "bg-amber-50 text-amber-700",
      icon: <BookOpen className="w-3.5 h-3.5 text-amber-400" />, bgIcon: (key: React.Key) => <BookOpen key={key} className="absolute w-24 h-24 text-amber-100 opacity-60 z-0 pointer-events-none select-none" />
    },
    fact: {
      color: "bg-green-50 text-green-700",
      icon: <Info className="w-3.5 h-3.5 text-green-400" />, bgIcon: (key: React.Key) => <Info key={key} className="absolute w-24 h-24 text-green-100 opacity-60 z-0 pointer-events-none select-none" />
    },
    dialogue: {
      color: "bg-pink-50 text-pink-700",
      icon: <MessageCircle className="w-3.5 h-3.5 text-pink-400" />, bgIcon: (key: React.Key) => <MessageCircle key={key} className="absolute w-24 h-24 text-pink-100 opacity-60 z-0 pointer-events-none select-none" />
    },
    default: {
      color: "bg-gray-50 text-gray-700",
      icon: <Sparkles className="w-3.5 h-3.5 text-yellow-400" />, bgIcon: (key: React.Key) => <Sparkles key={key} className="absolute w-24 h-24 text-yellow-100 opacity-60 z-0 pointer-events-none select-none" />
    }
  };

  // Helper to get type config
  const getTypeConfig = (type: string) => TYPE_CONFIG[type?.toLowerCase?.()] || TYPE_CONFIG["default"];

  // Helper to get mood color
  const getMoodBgColor = (mood: string | undefined) => {
    switch ((mood || '').toLowerCase()) {
      case "dreamy": return "bg-purple-50/80";
      case "inspiring": return "bg-green-50/80";
      case "witty": return "bg-yellow-50/80";
      case "curious": return "bg-blue-50/80";
      case "honest": return "bg-amber-100/80";
      case "reflective": return "bg-gray-100/80";
      default: return "bg-gray-50/80";
    }
  };

  // Alignment state: default center for poem, left for others
  const detectedType = ink.type || detectInkType(ink.content) || "default";
  const defaultAlignment = detectedType?.toLowerCase?.() === "poem" ? "center" : "left";
  const [alignment, setAlignment] = useState<string>(
    () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('inkly-alignment') || defaultAlignment;
      }
      return defaultAlignment;
    }
  );
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('inkly-alignment', alignment);
    }
  }, [alignment]);

  // Render content with word and sentence highlighting if TTS is active
  const renderContent = () => {
    const type = detectedType?.toLowerCase?.();
    const alignClass = alignment === "center" ? "text-center" : "text-left";
    if (type === "poem") {
      return (
        <div className={`prose prose-gray max-w-2xl mx-auto ${alignClass} text-lg sm:text-xl px-2 sm:px-8 md:px-16`}>
          <pre className="whitespace-pre-line break-words leading-relaxed" style={{fontFamily: 'inherit', background: 'none', padding: 0, margin: 0, border: 'none'}}>{ink.content}</pre>
        </div>
      );
    }
    if (["quote", "dialogue", "story", "thought", "affirmation", "fact", "default"].includes(type)) {
      return (
        <div className={`prose prose-gray max-w-2xl mx-auto ${alignClass} text-lg sm:text-xl px-2 sm:px-8 md:px-16`}>
          {sentences.map((sentence, sIdx) => (
            <span
              key={sIdx}
              className={
                currentSentenceIdx === sIdx && isSpeaking
                  ? "bg-yellow-200 rounded px-1 transition-colors duration-200"
                  : undefined
              }
            >
              {wordsBySentence[sIdx].map((word: string, wIdx: number) => (
                <span
                  key={wIdx}
                  className={
                    isSpeaking && currentSentenceIdx === sIdx && currentWordIdx === wIdx
                      ? "bg-green-300 rounded px-0.5 transition-colors duration-100"
                      : undefined
                  }
                >
                  {word + " "}
                </span>
              ))}
            </span>
          ))}
        </div>
      );
    }
    // fallback
    return (
      <div className={`prose prose-gray max-w-2xl mx-auto ${alignClass} text-lg sm:text-xl px-2 sm:px-8 md:px-16`}>
        <p className="break-words leading-relaxed">{ink.content}</p>
      </div>
    );
  };

  // Placeholder handlers for Share and Report
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isReactionDisabled, setIsReactionDisabled] = useState(false);
  const [isBookmarkDisabled, setIsBookmarkDisabled] = useState(false);
  const [isReflectDisabled, setIsReflectDisabled] = useState(false);
  const [isShareDisabled, setIsShareDisabled] = useState(false);
  const [isReportDisabled, setIsReportDisabled] = useState(false);
  const handleShare = () => {
    if (isShareDisabled) return;
    setIsShareDisabled(true);
    setTimeout(() => setIsShareDisabled(false), 500);
    setShowShareModal(true);
  };
  const handleReport = () => {
    if (isReportDisabled) return;
    setIsReportDisabled(true);
    setTimeout(() => setIsReportDisabled(false), 500);
    setShowReportModal(true);
  };

  // Error handling for views: fallback to '-' if not a number. For future: Add error boundaries for async/remote data.
  const views = Number(ink.views);
  const formattedViews = isNaN(views) ? "-" : views.toLocaleString();

  // --- FEED-LIKE REFLECT/INKIFY STATE ---
  const [hasReflected, setHasReflected] = useState(false);
  const [hasInkified, setHasInkified] = useState(false);
  const [reflectOpen, setReflectOpen] = useState(false);
  const [undoInkifyMsg, setUndoInkifyMsg] = useState<string | null>(null);
  const [reflectionCount, setReflectionCount] = useState(0); // Optionally show reflection count
  const [reactionCount, setReactionCount] = useState(0); // New: reaction count
  const [bookmarkCount, setBookmarkCount] = useState(0); // New: bookmark count
  const [reflectionToast, setReflectionToast] = useState<string | null>(null);

  // Follow button state and toast
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followToast, setFollowToast] = useState<string | null>(null);

  // --- Echo state for current user actions ---
  // Each boolean tracks if the user has performed that echo action
  const [hasReacted, setHasReacted] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [hasReflectedEcho, setHasReflectedEcho] = useState(false);
  const [hasInkifiedEcho, setHasInkifiedEcho] = useState(false);
  // Animation state for +1 Echo
  const [showEchoAnim, setShowEchoAnim] = useState(false);
  // Avatars: initialEchoUsers + 'You' if user has echoed
  const [echoUsers, setEchoUsers] = useState(initialEchoUsers);
  // Used to trigger animation when echo count increases
  const prevEchoCountRef = React.useRef(0);

  // Helper: Add 'You' to avatars if any echo action is active
  const addYouToEchoUsers = () => {
    if (!echoUsers.some(u => u.name === 'You')) {
      setEchoUsers([{ name: 'You', avatar: 'https://i.pravatar.cc/150?img=10', reaction: '' }, ...echoUsers]);
    }
  };
  // Helper: Remove 'You' from avatars if no echo actions are active
  const removeYouFromEchoUsers = () => {
    if (echoUsers.some(u => u.name === 'You')) {
      setEchoUsers(echoUsers.filter(u => u.name !== 'You'));
    }
  };

  // --- Echo count logic ---
  // Sum of initial echoes and all current user echo actions
  const echoCount = initialEchoUsers.length + (hasReacted ? 1 : 0) + (hasBookmarked ? 1 : 0) + (hasReflectedEcho ? 1 : 0) + (hasInkifiedEcho ? 1 : 0);

  // Keep 'You' in avatars if any action is active, remove if none
  React.useEffect(() => {
    if (hasReacted || hasBookmarked || hasReflectedEcho || hasInkifiedEcho) {
      addYouToEchoUsers();
    } else {
      removeYouFromEchoUsers();
    }
  }, [hasReacted, hasBookmarked, hasReflectedEcho, hasInkifiedEcho]);

  // Show +1 Echo animation for each new action
  React.useEffect(() => {
    if (echoCount > prevEchoCountRef.current) {
      setShowEchoAnim(true);
      setTimeout(() => setShowEchoAnim(false), 900);
    }
    prevEchoCountRef.current = echoCount;
  }, [echoCount]);

  // --- TTS (Text-to-Speech) State and Handlers ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number | null>(null);
  const [currentWordIdx, setCurrentWordIdx] = useState<number | null>(null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  // Remove TTS settings popover and related state
  // Remove: selectedLanguage, setSelectedLanguage, ttsSettingsOpen, languageLabels, handleReloadVoices, Popover, PopoverTrigger, PopoverContent, Settings import, and all dropdowns/buttons for TTS settings
  // Only keep the Listen button and TTS playback logic using the browser's default voice

  // Get sentences and words using wink-nlp
  const sentences = React.useMemo(() => {
    try {
      return nlp.readDoc(ink.content).sentences().out();
    } catch {
      return [ink.content];
    }
  }, [ink.content, nlp]);
  const wordsBySentence = React.useMemo(() => {
    try {
      const doc = nlp.readDoc(ink.content);
      const sents = doc.sentences();
      const arr: string[][] = [];
      sents.each((s: any) => {
        arr.push(s.tokens().out());
      });
      return arr;
    } catch {
      return [ink.content.split(/\s+/)];
    }
  }, [ink.content, nlp]);

  // Fetch voices on mount (all languages)
  React.useEffect(() => {
    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      if (!selectedVoice && allVoices.length > 0) {
        setSelectedVoice(allVoices[0].voiceURI);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  // Manual reload voices handler
  const handleReloadVoices = () => {
    window.speechSynthesis.getVoices();
    setTimeout(() => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('Reloaded voices:', allVoices);
      }
    }, 200);
  };

  // Play TTS
  const handleSpeak = () => {
    if (isSpeaking) return;
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text-to-speech.');
      return;
    }
    // Ensure voices are loaded
    if (voices.length === 0) {
      window.speechSynthesis.getVoices();
      setTimeout(() => {
        if (voices.length === 0) {
          alert('No speech synthesis voices available.');
        }
      }, 500);
      return;
    }
    setCurrentSentenceIdx(0);
    setCurrentWordIdx(0);
    const utterance = new window.SpeechSynthesisUtterance(ink.content);
    let voice = voices.find(v => v.voiceURI === selectedVoice);
    if (!voice) {
      // Fallback: try to match by name
      const selectedVoiceObj = voices.find(v => v.name === voices.find(vv => vv.voiceURI === selectedVoice)?.name);
      if (selectedVoiceObj) voice = selectedVoiceObj;
    }
    if (!voice && voices.length > 0) {
      // Fallback: first available
      voice = voices[0];
    }
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('TTS: Using voice', voice, 'selectedVoice', selectedVoice);
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('TTS: Selected voice not found, using browser default.', { selectedVoice, voices });
      }
    }
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIdx(null);
      setCurrentWordIdx(null);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIdx(null);
      setCurrentWordIdx(null);
      utteranceRef.current = null;
    };
    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name === 'word' && event.charIndex !== undefined) {
        // Find which sentence and word is being spoken
        let sentIdx = 0, wordIdx = 0, acc = 0;
        for (; sentIdx < sentences.length; sentIdx++) {
          const sent = sentences[sentIdx];
          if (event.charIndex < acc + sent.length + 1) {
            // Now find word
            let wordAcc = acc;
            for (let w = 0; w < wordsBySentence[sentIdx].length; w++) {
              wordAcc += wordsBySentence[sentIdx][w].length + 1;
              if (event.charIndex < wordAcc) {
                wordIdx = w;
                break;
              }
            }
            break;
          }
          acc += sent.length + 1;
        }
        setCurrentSentenceIdx(sentIdx);
        setCurrentWordIdx(wordIdx);
      } else if ((event.name === 'sentence' || event.charIndex !== undefined)) {
        // Fallback: highlight sentence only
        let idx = 0, acc = 0;
        for (; idx < sentences.length; idx++) {
          acc += sentences[idx].length + 1;
          if (event.charIndex < acc) break;
        }
        setCurrentSentenceIdx(idx);
        setCurrentWordIdx(null);
      }
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };
  // Pause TTS
  const handlePause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };
  // Resume TTS
  const handleResume = () => {
    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };
  // Stop TTS
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentenceIdx(null);
    setCurrentWordIdx(null);
    utteranceRef.current = null;
  };
  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Group voices by language for dropdown
  const voicesByLang = React.useMemo(() => {
    const map: { [lang: string]: SpeechSynthesisVoice[] } = {};
    voices.forEach(v => {
      if (!map[v.lang]) map[v.lang] = [];
      map[v.lang].push(v);
    });
    return map;
  }, [voices]);

  // Get language labels (e.g., 'en-US' -> 'English (United States)')
  const languageLabels = React.useMemo(() => {
    const labels: { [lang: string]: string } = {};
    Object.keys(voicesByLang).forEach(lang => {
      // Use built-in Intl.DisplayNames if available
      if ((window as any).Intl && (Intl as any).DisplayNames) {
        try {
          const dn = new (Intl as any).DisplayNames([lang], { type: 'language' });
          labels[lang] = dn.of(lang) || lang;
        } catch {
          labels[lang] = lang;
        }
      } else {
        labels[lang] = lang;
      }
    });
    return labels;
  }, [voicesByLang]);

  // Auto-detect language from ink content and available voices
  React.useEffect(() => {
    if (!ink.content || Object.keys(voicesByLang).length === 0) return;
    // Try to find a language code that matches the start of the text
    let detectedLang = '';
    for (const lang of Object.keys(voicesByLang)) {
      if (ink.content.match(/[\u0400-\u04FF]/) && lang.startsWith('ru')) { detectedLang = lang; break; }
      if (ink.content.match(/[\u4e00-\u9fff]/) && lang.startsWith('zh')) { detectedLang = lang; break; }
      if (ink.content.match(/[\u0600-\u06FF]/) && lang.startsWith('ar')) { detectedLang = lang; break; }
      if (ink.content.match(/[\u0900-\u097F]/) && lang.startsWith('hi')) { detectedLang = lang; break; }
      if (lang.startsWith('en')) { detectedLang = lang; break; }
    }
    if (!detectedLang) detectedLang = Object.keys(voicesByLang)[0] || '';
    // setSelectedLanguage(detectedLang); // This line is removed
  }, [ink.content, voicesByLang]);

  // When language changes, update selectedVoice to first available for that language
  React.useEffect(() => {
    const langKeys = Object.keys(voicesByLang);
    if (langKeys.length > 0 && voicesByLang[langKeys[0]].length > 0) {
      setSelectedVoice(voicesByLang[langKeys[0]][0].voiceURI);
    }
  }, [voicesByLang]);

  // Redesigned AuthorCard: avatar left, name/username center, follow button right (no full width button below)
  const AuthorCard = () => (
    <div className="w-full max-w-full mx-auto bg-white shadow-sm flex flex-row items-center gap-3 sm:gap-4 px-2 sm:px-4 pt-3 pb-2">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(ink.author)} text-white text-base font-medium`}>
            {getInitials(formatName(ink.author || "U"))}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* Name/meta info column */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex flex-row items-center justify-between min-w-0 w-full">
          <span className="font-semibold text-base md:text-lg text-gray-900 truncate max-w-[10rem] sm:max-w-[14rem]">{formatName(ink.author || "Unknown Author")}</span>
        </div>
        {/* Username below name */}
        <span className="text-gray-500 text-xs truncate">{formatName(ink.username || "unknown")}</span>
        {/* Meta info below on mobile */}
        <div className="flex sm:hidden flex-row items-center gap-2 text-gray-400 text-xs mt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-300" />
            {ink.readingTime || "-"} read
          </span>
          <span className="mx-2 text-gray-300">·</span>
          <span className="flex items-center gap-1">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline-block align-middle"><path d="M1.5 12s3.75-7.5 10.5-7.5S22.5 12 22.5 12 18.75 19.5 12 19.5 1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {formattedViews} views
          </span>
        </div>
      </div>
      {/* Follow button right-aligned */}
      <div className="flex-shrink-0 flex items-center">
        <button
          className="follow-btn bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full px-4 py-1.5 text-xs shadow-sm transition flex items-center justify-center"
          type="button"
          aria-label={isFollowing ? "Unfollow" : "Follow"}
          title={isFollowing ? "Unfollow" : "Follow"}
          disabled={isFollowLoading}
          onClick={async () => {
            if (!isLoggedIn) {
              setLoginToast({ open: true, message: "Create your Inkly profile to follow your favorite authors!" });
              return;
            }
            setIsFollowLoading(true);
            setTimeout(() => {
              setIsFollowing(f => {
                const next = !f;
                setFollowToast(next
                  ? "You are now following this author! Their future inks will appear in your feed. ✨"
                  : "You have unfollowed this author. Their inks will no longer appear in your feed.");
                setTimeout(() => setFollowToast(null), 3000);
                return next;
              });
              setIsFollowLoading(false);
            }, 900);
          }}
        >
          <span className="icon-follow" aria-hidden="true" />
          {isFollowLoading ? (
            <svg className="animate-spin h-4 w-4 text-white ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            <span className="follow-text">{isFollowing ? "Following" : "Follow"}</span>
          )}
        </button>
      </div>
    </div>
  );

  // Subcomponent: ActionRow
  const ActionRow = () => (
    <div className="flex flex-row items-center justify-between w-full px-1 sm:px-2 mb-1 sm:mb-2 gap-1 sm:gap-2">
      {/* Left: Reaction, Reflect, Bookmark, Listen (TTS) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Reaction */}
        <ReactionButton
          onReaction={onReactionHandler}
          selectedReaction={selectedReaction}
          onSoundPlay={() => {}}
          size="sm"
          aria-label="React to this ink"
          reactionCount={reactionCount}
        />
        {/* Reflect */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReflect}
          disabled={isReflectDisabled || (hasReflected && hasInkified)}
          className="relative text-gray-500 hover:text-blue-600 w-7 h-7 sm:w-8 sm:h-8"
          title={hasReflected && hasInkified ? "Already reflected and reposted" : "Add reflection or repost"}
          aria-label={hasReflected && hasInkified ? "Already reflected and reposted" : "Add reflection or repost"}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
            focusable="false"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582a10.054 10.054 0 0115.775-1.317M20 20v-5h-.582a10.054 10.054 0 01-15.775 1.317" />
          </svg>
        </Button>
        {/* Bookmark */}
        <Button
          variant="ghost"
          size="icon"
          className={`relative text-gray-500 hover:text-purple-600 w-7 h-7 sm:w-8 sm:h-8 transition-transform ${isBookmarked ? "scale-110" : ""}`}
          onClick={onBookmarkHandler}
          disabled={isBookmarkDisabled}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? "text-purple-600 fill-purple-100" : ""}`}
            aria-hidden="true"
            focusable="false"
          />
        </Button>
        {/* Listen (TTS) and Settings */}
        <div className="flex flex-row items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-500 hover:text-green-600 w-7 h-7 sm:w-8 sm:h-8"
            onClick={handleSpeak}
            aria-label="Listen to this ink"
            title="Listen to this ink"
            disabled={voices.length === 0}
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          {/* Play/Pause/Stop controls (shown inline, not in popover) */}
          {isSpeaking && !isPaused && (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-green-600 w-7 h-7 sm:w-8 sm:h-8 animate-pulse"
              onClick={handlePause}
              aria-label="Pause reading"
              title="Pause reading"
            >
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
          {isSpeaking && isPaused && (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-yellow-600 w-7 h-7 sm:w-8 sm:h-8"
              onClick={handleResume}
              aria-label="Resume reading"
              title="Resume reading"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
          {isSpeaking && (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-red-600 w-7 h-7 sm:w-8 sm:h-8"
              onClick={handleStop}
              aria-label="Stop reading"
              title="Stop reading"
            >
              <StopCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
        </div>
      </div>
      {/* Right: (share/report) */}
      <div className="flex items-center gap-1">
        <button
          className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
          title="Share"
          aria-label="Share"
          onClick={handleShare}
          disabled={isShareDisabled}
        >
          <Share2 className="w-4 h-4 sm:w-4 sm:h-4" />
        </button>
        <button
          className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
          title="Report"
          aria-label="Report"
          onClick={handleReport}
          disabled={isReportDisabled}
        >
          <Flag className="w-4 h-4 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );

  // Handler for reflecting (echoing) - now opens modal only
  const handleReflect = () => {
    if (!isLoggedIn) {
      setLoginToast({ open: true, message: "Log in to reflect or repost and share your thoughts!" });
      return;
    }
    if (isReflectDisabled) return;
    setIsReflectDisabled(true);
    setTimeout(() => setIsReflectDisabled(false), 500);
    setReflectOpen(true);
  };

  // --- ACTION HANDLERS ---
  // Reaction
  function onReactionHandler(id: string | null) {
    if (!isLoggedIn) {
      setLoginToast({ open: true, message: "Enjoying this ink? Log in to react and join the conversation!" });
      return;
    }
    if (isReactionDisabled) return;
    setIsReactionDisabled(true);
    setTimeout(() => setIsReactionDisabled(false), 500);
    handleReaction(id);
    if (id && !hasReacted) {
      setHasReacted(true);
    } else if (!id && hasReacted) {
      setHasReacted(false);
    }
  }
  // Bookmark
  function onBookmarkHandler() {
    if (!isLoggedIn) {
      setLoginToast({ open: true, message: "Like what you see? Log in to bookmark your favorite inks!" });
      return;
    }
    if (isBookmarkDisabled) return;
    setIsBookmarkDisabled(true);
    setTimeout(() => setIsBookmarkDisabled(false), 500);
    toggleBookmark();
    if (!isBookmarked && !hasBookmarked) {
      setHasBookmarked(true);
    } else if (isBookmarked && hasBookmarked) {
      setHasBookmarked(false);
    }
  }
  // Inkify (repost)
  function onInkifyHandler() {
    if (!hasInkifiedEcho) {
      setHasInkified(true);
      setHasInkifiedEcho(true);
    }
  }
  function onUndoInkifyHandler() {
    if (hasInkifiedEcho) {
      setHasInkified(false);
      setHasInkifiedEcho(false);
    }
  }
  // Reflection
  function onReflectionHandler() {
    if (!hasReflectedEcho) {
      setHasReflected(true);
      setHasReflectedEcho(true);
    }
  }
  function onUndoReflectionHandler() {
    if (hasReflectedEcho) {
      setHasReflected(false);
      setHasReflectedEcho(false);
    }
  }

  // Loading state
  const [loading, setLoading] = useState(false); // Set to true to demo loading, or wire to real logic
  const [randomMessage, setRandomMessage] = useState<string | null>(null);

  useEffect(() => {
    setRandomMessage(sampleMessages[Math.floor(Math.random() * sampleMessages.length)]);
  }, []);

  if (loading && !randomMessage) {
    // Optionally render a spinner or nothing until the client picks a message
    return <FeedLoader message="Loading..." />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FeedLoader message={randomMessage!} />
      </div>
    );
  }

  // State for EchoedByModal
  const [showEchoedByModal, setShowEchoedByModal] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(false);

  const typeConfig = getTypeConfig(detectedType);

  // Add at the top, after imports
  const isLoggedIn = false; // TODO: Replace with real auth check

  // Add login toast state
  const [loginToast, setLoginToast] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  // Update the AnimatedLoginToast component for white background, smaller font, and image-inspired layout
  const AnimatedLoginToast = ({ open, message, onLogin, onClose }: { open: boolean; message: React.ReactNode; onLogin: () => void; onClose: () => void }) => (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="fixed top-16 inset-x-0 mx-auto max-w-fit z-[1000] pointer-events-none px-2"
          role="status"
          aria-live="polite"
        >
          <div
            className="pointer-events-auto bg-white rounded-2xl px-4 py-3 flex flex-row items-center shadow-xl border border-gray-200"
          >
            <div className="flex-1 text-left text-gray-900 text-xs sm:text-sm leading-snug">
              {message}
            </div>
            <div className="flex flex-row items-center gap-2 ml-4">
              <Button className="px-4 py-1 text-xs sm:text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white" onClick={onLogin} style={{minWidth: '90px'}}>Join Inkly</Button>
              <button
                className="text-gray-400 hover:text-gray-600 text-lg px-1 transition"
                aria-label="Dismiss"
                onClick={onClose}
                style={{ lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Add state for copy notification toast
  const [showCopyToast, setShowCopyToast] = useState(false);

  return (
    <>
      <article className="px-0 py-3 max-w-3xl mx-auto">
        {/* Top Row: Consistent, single-row metadata layout */}
      
        {/* Author Card: Avatar left, info right, full-width follow button below */}
        <AuthorCard />
        {/* Main Content Box with decorative icons */}
        <div className="max-w-full sm:max-w-3xl md:max-w-4xl mx-auto relative px-0 sm:px-0">
          <div className={`relative shadow px-2 sm:px-10 md:px-20 lg:px-32 py-8 sm:py-14 md:py-20 w-full transition-colors duration-300 flex flex-col items-center justify-center ${typeConfig.color.split(' ')[0]}`} style={{overflow: 'hidden', minHeight: '340px', minWidth: '260px'}}>
            {/* Decorative icons in corners */}
            {typeConfig.bgIcon("tl")}
            {typeConfig.bgIcon("br")}
            <div className="w-full flex flex-col items-center justify-center z-10">
              {renderContent()}
              {/* Floating copy button at bottom-left */}
              <div className="absolute bottom-2 left-2 z-20">
                <button
                  className="p-1 sm:p-1.5 md:p-2 rounded-lg bg-white/80 hover:bg-purple-50 shadow border border-gray-200 transition flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
                  title="Copy content"
                  onClick={() => {
                    navigator.clipboard.writeText(ink.content);
                    setShowCopyToast(true);
                    setTimeout(() => setShowCopyToast(false), 2000);
                  }}
                >
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              {/* Floating alignment controls at bottom-right */}
              <div className="absolute bottom-2 right-2 z-20 flex flex-row items-center gap-0.5">
                <div className="bg-white/80 backdrop-blur rounded-lg shadow p-0.5 flex gap-0.5 items-center border border-gray-200 w-fit h-fit">
                  <button
                    className={`p-0.5 rounded flex items-center justify-center ${alignment === "left" ? "bg-purple-100" : ""}`}
                    style={{ minWidth: '1.75rem', minHeight: '1.75rem' }}
                    title="Align Left"
                    onClick={() => setAlignment("left")}
                  >
                    <svg width="0.95em" height="0.95em" viewBox="0 0 24 24" fill="none" className="text-purple-600 w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h12M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                  <button
                    className={`p-0.5 rounded flex items-center justify-center ${alignment === "center" ? "bg-purple-100" : ""}`}
                    style={{ minWidth: '1.75rem', minHeight: '1.75rem' }}
                    title="Align Center"
                    onClick={() => setAlignment("center")}
                  >
                    <svg width="0.95em" height="0.95em" viewBox="0 0 24 24" fill="none" className="text-purple-600 w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M6 12h12M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Hashtags and pills row above action bar fade line */}
          {(ink.tags && ink.tags.length > 0) || ink.mood || detectedType ? (
            <div className="flex flex-row items-center justify-between gap-x-2 flex-wrap min-w-0 w-full py-2 mt-3 px-1 overflow-x-auto scrollbar-thin">
              <div className="flex flex-row items-center gap-x-2 flex-wrap min-w-0">
                {ink.mood && (
                  <span className={`inline-flex items-center gap-1 ${getMoodBgColor(ink.mood)} text-purple-700 font-bold px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm`}>
                    {ink.mood}
                  </span>
                )}
                {detectedType && (
                  <span className={`inline-flex items-center gap-1 ${typeConfig.color} font-bold px-2 py-0.5 sm:px-2.5 rounded-full text-xs`}>
                    {typeConfig.icon}
                    {detectedType.charAt(0).toUpperCase() + detectedType.slice(1)}
                  </span>
                )}
              </div>
              <div className="flex flex-row items-center gap-x-2 flex-wrap min-w-0 justify-end">
                {ink.tags && ink.tags.length > 0 && ink.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs  font-medium whitespace-nowrap">{tag}</span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="w-full h-[1.5px] bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 opacity-70 my-0.5 sm:my-1 md:my-2 rounded-full" />
          {/* Action Row */}
          <ActionRow />
          {/* Echo count row (no avatars, just static text, but animated number) */}
          {echoCount > 0 ? (
            <div className="pl-2 md:pl-4 mt-1 mb-2">
              <div className="flex items-center gap-2">
                {/* Static Echoes text with animated number */}
                <span className="font-medium text-sm text-gray-700">
                  <motion.span
                    key={echoCount}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="inline-block"
                  >
                    {echoCount}
                  </motion.span>
                  {` Echo${echoCount === 1 ? '' : 'es'}`}
                </span>
              </div>
              {/* Echoed by ... (clickable) */}
              <div
                className="text-[10px] text-sm sm:text-sm text-gray-400 pl-0.5 pt-0.5 cursor-pointer hover:underline"
                onClick={() => setShowEchoedByModal(true)}
                tabIndex={0}
                role="button"
                aria-label="Show all echoes"
              >
                {(() => {
                  const displayed = echoUsers.slice(0, 2);
                  const remaining = echoUsers.length - displayed.length;
                  if (echoUsers.length === 1) return `Echoed by ${echoUsers[0].name}`;
                  if (echoUsers.length === 2) return `Echoed by ${echoUsers[0].name} and ${echoUsers[1].name}`;
                  return `Echoed by ${displayed.map(u => u.name).join(', ')} and ${remaining} other${remaining > 1 ? 's' : ''}`;
                })()}
              </div>
              {/* EchoedByModal integration */}
              <EchoedByModal
                open={showEchoedByModal}
                onClose={() => setShowEchoedByModal(false)}
                echoUsers={echoUsers.map(u => ({ ...u, reaction: u.reaction ?? '' }))}
                reactions={reactions}
              />
            </div>
          ) : (
            <div className="pl-1 mt-1 mb-2 text-xs sm:text-sm text-gray-400 italic">Be the first to echo this</div>
          )}
          {/* Fade line divider below interaction row */}
          <div className="w-full h-[1.5px] bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 opacity-70 my-0.5 sm:my-1 md:my-2 rounded-full" />
          {/* Tumblr-like total interaction count (Echoes) with animation */}
          <div className="relative mt-1 mb-0">
            {/* Echo count, avatars, and echoed by: only show if echoCount > 0; show animated loading if loading */}
            {loading ? (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
                <div className="flex -space-x-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
              </div>
            ) : (
              reactionCount > 0 ? (
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <motion.div
                      key={reactionCount}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="font-medium text-gray-700 text-sm"
                    >
                      {reactionCount} Reaction{reactionCount === 1 ? '' : 's'}
                    </motion.div>
                  </div>
                </div>
              ) : null
            )}
          </div>
          <div className="w-full flex flex-row items-center justify-between text-[10px] xs:text-xs sm:text-[11px] text-gray-400 pl-2 mb-2">
            <div className="flex items-center gap-1">
              <span>Posted on</span>
              <time dateTime={ink.createdAt} suppressHydrationWarning>{ink.createdAt ? new Date(ink.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '-'}</time>
              {ink.editedAt && (
                <>
                  <span className="mx-1">·</span>
                  <span>Edited</span>
                  <time dateTime={ink.editedAt} suppressHydrationWarning>{new Date(ink.editedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</time>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-300" />
                {ink.readingTime || "-"} read
              </span>
              <span className="mx-2 text-gray-300">·</span>
              <span className="flex items-center gap-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline-block align-middle"><path d="M1.5 12s3.75-7.5 10.5-7.5S22.5 12 22.5 12 18.75 19.5 12 19.5 1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {formattedViews} views
              </span>
            </div>
          </div>
        </div>
      </article>
    
      {/* Show BookmarkToast if needed */}
      {showBookmarkToast && <BookmarkToast message={isBookmarked ? "Bookmarked!" : "Bookmark removed"} />}
      {/* Show FloatingToast for undo inkify or reflection */}
      {undoInkifyMsg && <FloatingToast key={undoInkifyMsg} message={undoInkifyMsg} duration={3000} />}
      {reflectionToast && <FloatingToast key={reflectionToast} message={reflectionToast} duration={3000} />}
      {/* Show ReflectModal if needed */}
      {reflectOpen && (
        <ReflectModal
          open={reflectOpen}
          onClose={() => setReflectOpen(false)}
          onRepost={() => {
            playSound("modalOpen");
            playSound("like");
            onInkifyHandler();
            setReflectOpen(false);
            setUndoInkifyMsg("Reposted! This Ink now echoes through your feed 🌀");
            setTimeout(() => setUndoInkifyMsg(null), 3000);
          }}
          onUndoRepost={() => {
            onUndoInkifyHandler();
            setUndoInkifyMsg("Inkify undone. You can repost if you wish.");
            setReflectOpen(false);
            setTimeout(() => setUndoInkifyMsg(null), 3000);
          }}
          onSubmit={(text) => {
            onReflectionHandler();
            setReflectionToast("Your reflection is now part of the story ✨");
            setTimeout(() => setReflectionToast(null), 3000);
            setReflectOpen(false);
          }}
          originalInk={{
            content: ink.content,
            author: ink.author,
            timestamp: ink.createdAt,
          }}
          hasReflected={hasReflected}
          hasInkified={hasInkified}
        />
      )}
      {/* Report Modal (with options) */}
      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        inkId={ink.id}
        content={ink.content}
      />
      {/* Share Modal (with options) */}
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      {/* Follow toast */}
      {followToast && (
        <FloatingToast key={followToast} message={followToast} duration={3000} />
      )}

      {/* --- Simple Comment Box --- */}
      {/* View all comments button */}
      <div className="max-w-3xl mx-auto px-2 pb-4 flex justify-center">
        <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 px-2 py-1 text-xs sm:px-4 sm:py-3 sm:text-sm">
              View all comments
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg w-full p-0">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle>Comments</DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-4">
              <ScrollArea className="h-64 w-full pr-2">
                {comments.length === 0 ? (
                  <div className="text-gray-400 text-sm mb-2">No comments yet. Be the first to comment!</div>
                ) : (
                  <ul className="mb-2 space-y-2">
                    {comments.slice(-5).reverse().map((c, i) => (
                      <li key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-100">
                        <span className="font-medium text-gray-600 mr-2">User:</span>
                        <span className="text-gray-700">{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollArea>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!isLoggedIn) {
                    setLoginToast({ open: true, message: "Want to join the discussion? Log in to comment!" });
                    return;
                  }
                  if (commentInput.trim()) {
                    setComments([...comments, commentInput.trim()]);
                    setCommentInput("");
                  }
                }}
                className="flex gap-2 items-end mt-2"
              >
                <Textarea
                  className="flex-1 min-h-[40px] max-h-32 resize-none text-sm"
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  maxLength={300}
                  rows={1}
                />
                <Button type="submit" size="sm" disabled={!commentInput.trim()}>
                  Post
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Render the login toast */}
      <AnimatedLoginToast
        open={loginToast.open}
        message={loginToast.message}
        onLogin={() => {
          // TODO: Replace with real login logic or redirect
          window.location.href = "/login";
        }}
        onClose={() => setLoginToast({ ...loginToast, open: false })}
      />
      {/* Render the copy notification toast */}
      {showCopyToast && (
        <FloatingToast message="Copied to clipboard!" duration={2000} />
      )}
    </>

  );
} 