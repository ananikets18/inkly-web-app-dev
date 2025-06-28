"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, Eye } from "lucide-react";
import ReactionButton from "@/components/reaction-button";
import FollowButton from "./FollowButton";
import MoreOptionsDropdown from "./MoreOptionsDropdown";
import EchoPile from "./EchoPile";
import EchoBurst from "@/components/EchoBurst";
import ReflectModal from "./ReflectModal";
import ReportModal from "./ReportModal";
import BookmarkToast from "../components/BookmarkToast";
import { formatCount } from "@/utils/formatCount";
import { AnimatePresence, motion } from "framer-motion";
import { truncate } from "@/utils/truncate";
import FollowToast from "./FollowToast";
import { getTagsAndMood } from "./InkCard";
import { UserBadge, VerifiedTick, getUserBadgeType, shouldShowVerifiedTick, getDisplayName } from "./ui/user-badges";
import { AvatarBadge } from "./ui/user-badges";
import { useSoundEffects } from "../hooks/use-sound-effects";

interface InkCardMobileProps {
  id: number;
  content: string;
  author: string;
  avatarColor: string;
  isLong?: boolean;
  readingTime: { text: string; minutes: number };
  views: number;
  reaction?: { reaction: string; count: number };
  reactionCount: number;
  reflectionCount: number;
  bookmarkCount: number;
  onFollow: () => void;
  onBookmark: () => void;
  onReact?: (reactionId: string | null) => void;
  onShare: () => void;
  animateBookmark: boolean;
  setAnimateBookmark: (value: boolean) => void;
  bookmarked: boolean;
  setBookmarked: (value: boolean) => void;
  bookmarkLocked: boolean;
  setBookmarkLocked: (value: boolean) => void;
  bookmarkMessage: string | null;
  setBookmarkMessage: (value: string | null) => void;
  isFollowing: boolean;
  setIsFollowing: (value: boolean) => void;
  isFollowLoading: boolean;
  setIsFollowLoading: (value: boolean) => void;
  isFollowIntent: boolean | null;
  setIsFollowIntent: (value: boolean | null) => void;
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
  followMessage: string;
  setFollowMessage: (value: string) => void;
  echoUsers: any[];
  handleReaction: (reactionId: string | null) => void;
  handleBookmark: () => void;
  handleFollowClick: () => void;
}

const InkCardMobileComponent = (props: InkCardMobileProps) => {
  const {
    animateBookmark, setAnimateBookmark,
    bookmarked, setBookmarked,
    bookmarkLocked, setBookmarkLocked,
    bookmarkMessage, setBookmarkMessage,
    isFollowing, setIsFollowing,
    isFollowLoading, setIsFollowLoading,
    isFollowIntent, setIsFollowIntent,
    reportOpen, setReportOpen,
    reflectOpen, setReflectOpen,
    localReaction, setLocalReaction,
    reactionCountLocal, setReactionCountLocal,
    reflectionCountLocal, setReflectionCountLocal,
    bookmarkCountLocal, setBookmarkCountLocal,
    showEchoAnim, setShowEchoAnim,
    hasReflected, setHasReflected,
    hasInkified, setHasInkified,
    echoCount, setEchoCount,
    followMessage, setFollowMessage,
    echoUsers,
    handleReaction,
    handleBookmark,
    handleFollowClick,
    id,
    content,
    author,
    avatarColor,
    isLong,
    readingTime,
    views,
    reaction,
    reactionCount,
    reflectionCount,
    bookmarkCount,
    onFollow,
    onBookmark,
    onReact,
    onShare,
  } = props;

  const hasReacted = localReaction.reaction !== null;
  const hasBookmarked = bookmarked;
  const totalEchoes = formatCount(echoCount);
  const shareUrl = `https://inkly.app/?share=${id}`;

  const { tags, mood } = getTagsAndMood(content);
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE_LENGTH = isLong ? 280 : 120;
  const isTruncatable = content.length > TRUNCATE_LENGTH;
  const displayContent = expanded || !isTruncatable ? content : truncate(content, TRUNCATE_LENGTH);

  const { playSound } = useSoundEffects();

  const triggerEchoAnim = () => {
    setShowEchoAnim(true);
    setTimeout(() => setShowEchoAnim(false), 800);
  };

  const handleReportClick = useCallback(() => setReportOpen(true), [setReportOpen]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm px-4 py-5 mb-4">
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
            <span className="text-xs text-gray-500">3h ago</span>
          </div>
        </div>
        <div className="flex items-center gap-0">
          <FollowButton onFollow={handleFollowClick} isFollowing={isFollowing} isLoading={isFollowLoading} followIntent={null} />
          <MoreOptionsDropdown url={shareUrl} onShared={onShare} onReportClick={handleReportClick} />
        </div>
      </div>

      <div className="mb-4 text-[16px] sm:text-[17px] md:text-[18px] font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
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
        {tags.map((tag: string) => (
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
            onSoundPlay={triggerEchoAnim}
            size="sm"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setReflectOpen(true);
            }}
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
            onMouseEnter={triggerEchoAnim}
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
          setReflectOpen(false);
        }}
        originalInk={{ content, author, timestamp: "3h ago" }}
        hasReflected={hasReflected}
        hasInkified={hasInkified}
      />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} inkId={id} content={content} />
      {bookmarkMessage && <BookmarkToast message={bookmarkMessage} />}
      {followMessage && <FollowToast key={followMessage} message={followMessage} />}
    </div>
  );
};

export default React.memo(InkCardMobileComponent);
