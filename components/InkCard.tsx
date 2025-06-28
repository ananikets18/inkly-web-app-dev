"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, Eye } from "lucide-react";
import ReactionButton from "@/components/reaction-button";
import { truncate } from "@/utils/truncate";
import { formatCount } from "@/utils/formatCount";
import BookmarkToast from "../components/BookmarkToast";
import FollowToast from "../components/FollowToast";
import FollowButton from "./FollowButton";
import MoreOptionsDropdown from "./MoreOptionsDropdown";
import ReportModal from "./ReportModal";
import ReflectModal from "./ReflectModal";
import EchoPile from "./EchoPile";
import EchoBurst from "@/components/EchoBurst";
import { AnimatePresence, motion } from "framer-motion";
import { UserBadge, VerifiedTick, getUserBadgeType, shouldShowVerifiedTick, getDisplayName } from "./ui/user-badges";
import { AvatarBadge } from "./ui/user-badges";
import { useSoundEffects } from "../hooks/use-sound-effects";

interface InkCardProps {
  id: number;
  content: string;
  author: string;
  avatarColor: string;
  isLong?: boolean;
  reaction?: { reaction: string; count: number };
  bookmarkCount: number;
  baseEchoCount: number;
  onClick: () => void;
  onHover: () => void;
  onReact?: (reactionId: string | null) => void;
  onBookmark: () => void;
  onShare: () => void;
  onFollow: () => void;
  views: number;
  reactionCount: number;
  reflectionCount: number;
  readingTime: { text: string; minutes: number };
  shareCount?: number;
  shareUrl: string;
  animateBookmark: boolean;
  setAnimateBookmark: (value: boolean) => void;
  bookmarked: boolean;
  bookmarkLocked: boolean;
  setBookmarkLocked: (value: boolean) => void;
  bookmarkMessage: string | null;
  setBookmarkMessage: (value: string | null) => void;
  isFollowing: boolean;
  setIsFollowing: (value: boolean) => void;
  isFollowLoading: boolean;
  setIsFollowLoading: (value: boolean) => void;
  isFollowIntent: "follow" | "unfollow" | null;
  setIsFollowIntent: (value: "follow" | "unfollow" | null) => void;
  reportOpen: boolean;
  setReportOpen: (value: boolean) => void;
  reflectOpen: boolean;
  setReflectOpen: (value: boolean) => void;
  localReaction: { reaction: string | null };
  setLocalReaction: (value: { reaction: string | null }) => void;
  reactionCountLocal: number;
  setReactionCountLocal: (value: number) => void;
  reflectionCountLocal: number;
  setReflectionCountLocal: (value: number | ((prev: number) => number)) => void;
  bookmarkCountLocal: number;
  setBookmarkCountLocal: (value: number) => void;
  showEchoAnim: boolean;
  setShowEchoAnim: (value: boolean) => void;
  hasReflected: boolean;
  setHasReflected: (value: boolean) => void;
  hasInkified: boolean;
  setHasInkified: (value: boolean) => void;
  echoCount: number;
  setEchoCount: (value: number) => void;
  followMessage: string | null;
  setFollowMessage: (value: string | null) => void;
  echoUsers: { name: string; avatar: string }[];
  handleReaction: (reactionId: string | null) => void;
  handleBookmark: (e: React.MouseEvent) => void;
  handleFollowClick: (e: React.MouseEvent) => void;
}

// Helper to get hashtags and mood based on content
export function getTagsAndMood(content: string) {
  if (content.includes('poem') || content.match(/moonlight|fire|bloom|sea|soft/)) {
    return { tags: ['#poem', '#mindfulness'], mood: 'Dreamy' };
  }
  if (content.includes('"') || content.includes("'")) {
    return { tags: ['#dialogue', '#story'], mood: 'Witty' };
  }
  if (content.toLowerCase().includes('affirmation') || content.toLowerCase().includes('intention')) {
    return { tags: ['#affirmation', '#selfcare'], mood: 'Inspiring' };
  }
  if (content.toLowerCase().includes('meme') || content.toLowerCase().includes('cat') || content.toLowerCase().includes('frog')) {
    return { tags: ['#danktale', '#funny'], mood: 'Witty' };
  }
  if (content.toLowerCase().includes('confession')) {
    return { tags: ['#confession', '#truth'], mood: 'Honest' };
  }
  if (content.toLowerCase().includes('did you know') || content.toLowerCase().includes('octopus') || content.toLowerCase().includes('honey')) {
    return { tags: ['#fact', '#curious'], mood: 'Curious' };
  }
  if (content.toLowerCase().includes('quote') || content.length < 80) {
    return { tags: ['#quote', '#inspiration'], mood: 'Inspiring' };
  }
  return { tags: ['#story', '#mindfulness'], mood: 'Reflective' };
}

const InkCardComponent = (props: InkCardProps) => {
  const {
    id,
    content,
    author,
    avatarColor,
    isLong,
    reaction,
    readingTime,
    onClick,
    onHover,
    onReact,
    onBookmark,
    onShare,
    onFollow,
    views,
    reactionCount,
    reflectionCount,
    bookmarkCount,
    shareCount = 0,
    animateBookmark,
    setAnimateBookmark,
    bookmarked,
    bookmarkLocked,
    setBookmarkLocked,
    bookmarkMessage,
    setBookmarkMessage,
    isFollowing,
    setIsFollowing,
    isFollowLoading,
    setIsFollowLoading,
    isFollowIntent,
    setIsFollowIntent,
    reportOpen,
    setReportOpen,
    reflectOpen,
    setReflectOpen,
    localReaction,
    setLocalReaction,
    reactionCountLocal,
    setReactionCountLocal,
    reflectionCountLocal,
    setReflectionCountLocal,
    bookmarkCountLocal,
    setBookmarkCountLocal,
    showEchoAnim,
    setShowEchoAnim,
    hasReflected,
    setHasReflected,
    hasInkified,
    setHasInkified,
    echoCount,
    setEchoCount,
    followMessage,
    setFollowMessage,
    echoUsers,
    handleReaction,
    handleBookmark,
    handleFollowClick,
    ...rest
  } = props;

  const hasReacted = localReaction.reaction !== null;
  const shareUrl = `https://inkly.app/?share=${id}`;

  const { tags, mood } = getTagsAndMood(content);

  const handleReportClick = useCallback(() => setReportOpen(true), [setReportOpen]);

  const [expanded, setExpanded] = useState(false);

  const { playSound } = useSoundEffects();

  // Determine truncation length
  const TRUNCATE_LENGTH = isLong ? 280 : 120;
  const isTruncatable = content.length > TRUNCATE_LENGTH;
  const displayContent = expanded || !isTruncatable ? content : truncate(content, TRUNCATE_LENGTH);

  useEffect(() => {
    if (followMessage) {
      const timeout = setTimeout(() => setFollowMessage(null), 2500);
      return () => clearTimeout(timeout);
    }
  }, [followMessage]);

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-sm px-4 py-5 mb-4 sm:border sm:border-purple-100" onClick={onClick}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className={`relative ${getUserBadgeType(author) ? 'p-0.5 rounded-full' : ''} ${
              getUserBadgeType(author) === 'creator' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
              getUserBadgeType(author) === 'admin' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
              getUserBadgeType(author) === 'moderator' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
              getUserBadgeType(author) === 'contributor' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
              getUserBadgeType(author) === 'writer' ? 'bg-gradient-to-r from-orange-400 to-amber-400' :
              getUserBadgeType(author) === 'author' ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : ''
            }`}>
              <Avatar className="w-8 h-8">
                <AvatarFallback className={`bg-gradient-to-br ${avatarColor} text-white text-base font-medium`}>
                  {getDisplayName(author).split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {getUserBadgeType(author) && (
                <AvatarBadge type={getUserBadgeType(author)!} />
              )}
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                {getDisplayName(author)}
                {/* Only show verified tick for contributors (not special users) */}
                {!getUserBadgeType(author) && shouldShowVerifiedTick(author) && (
                  <VerifiedTick />
                )}
              </span>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
          </div>
          <div className="flex items-center gap-0">
            <FollowButton onFollow={handleFollowClick} isFollowing={isFollowing} isLoading={isFollowLoading}  followIntent={isFollowIntent} />
            <MoreOptionsDropdown url={shareUrl} onShared={onShare} onReportClick={handleReportClick} />
          </div>
        </div>

        <div className="mb-4 text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-semibold text-gray-900 leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed whitespace-pre-line sm:px-3 sm:py-2">
          {displayContent}
          {isTruncatable && !expanded && (
            <button
              className="ml-2 text-xs text-purple-600 underline hover:text-purple-800 transition-colors font-medium"
              onClick={e => { e.stopPropagation(); setExpanded(true); }}
            >
              Read more
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-2 text-sm">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="hover:text-purple-800 hover:underline cursor-pointer text-purple-700 text-xs transition-all duration-200"
            >
              {tag}
            </span>
          ))}
          <span className="bg-purple-50 border border-purple-50 text-purple-600 font-medium px-2 py-1 rounded-full ml-auto text-xs">{mood}</span>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <ReactionButton
              onReaction={handleReaction}
              selectedReaction={localReaction.reaction}
              onSoundPlay={onHover}
              size="sm"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setReflectOpen(true);
              }}
              onMouseEnter={onHover}
              className="relative text-gray-500 hover:text-blue-600 w-8 h-8"
              disabled={hasReflected && hasInkified}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582a10.054 10.054 0 0115.775-1.317M20 20v-5h-.582a10.054 10.054 0 01-15.775 1.317" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`relative text-gray-500 hover:text-purple-600 w-8 h-8 transition-transform ${animateBookmark ? "scale-110" : ""}`}
              onMouseEnter={onHover}
              onClick={props.handleBookmark}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "text-purple-600 fill-purple-100" : ""}`} />
            </Button>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{readingTime.text}</span></div>
            <span>•</span>
            <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{formatCount(views)}</span></div>
          </div>
        </div>

       {echoCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-1 pl-1">
          <motion.div
            className="flex"
            key={echoCount}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <EchoPile users={echoUsers} total={echoCount} />
          </motion.div>
          <EchoBurst show={showEchoAnim} />
        </div>
      )}

      </div>

      <ReflectModal
        open={reflectOpen}
        onClose={() => setReflectOpen(false)}
        onRepost={() => {
          playSound("modalOpen");
          setHasInkified(true);
          setReflectOpen(false);
        }}
        onSubmit={(text) => {
          setReflectionCountLocal((prev: number) => prev + 1);
          setHasReflected(true);
          console.log("Reflection text:", text);
        }}
        originalInk={{ content, author, timestamp: "2h ago" }}
        hasReflected={hasReflected}
        hasInkified={hasInkified}
      />

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} inkId={id} content={content} />
      {bookmarkMessage && <BookmarkToast message={bookmarkMessage} />}
      {followMessage && <FollowToast key={followMessage} message={followMessage} />}


    </>
  );
}

export default React.memo(InkCardComponent);
