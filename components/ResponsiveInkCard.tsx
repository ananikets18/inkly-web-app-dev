"use client";

import { useEffect, useState } from "react";
import InkCard from "./InkCard"; // existing desktop/tablet version
import InkCardMobile from "./InkCardMobile"; // new mobile version
import useCooldown from "../hooks/useCooldown";
import { useSoundEffects } from "../hooks/useSoundEffects";

interface ResponsiveInkCardProps {
  // Match the full props of InkCard for now
  id: number;
  inkId?: string; // add optional inkId for navigation
  content: string;
  author: string;
  avatarColor: string;
  isLong?: boolean;
  readingTime: { text: string; minutes: number };
  views?: number; // make optional
  echoCount: number;
  reaction?: { reaction: string; count: number };
  bookmarkCount: number;
  hasReflected?: boolean;
  hasInkified?: boolean;
  reactionCount: number;
  reflectionCount: number;
  shareCount?: number;
  shareUrl: string;
  onClick: () => void;
  onHover: () => void;
  onReact?: (reactionId: string | null) => void;
  onBookmark: () => void;
  onShare: () => void;
  onFollow: () => void;
  small?: boolean;
}

function getRandomViews(id: number) {
  // Deterministic pseudo-random based on id for demo
  const min = 120;
  const max = 12000;
  let seed = id * 9301 + 49297;
  seed = (seed % 233280) / 233280;
  return Math.floor(min + seed * (max - min));
}

export default function ResponsiveInkCard(props: ResponsiveInkCardProps) {
  const { small = false, ...rest } = props;
  const [isMobile, setIsMobile] = useState(false);
  const { playSound } = useSoundEffects();

  // LIFTED STATE
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLocked, setBookmarkLocked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isFollowIntent, setIsFollowIntent] = useState<"follow" | "unfollow" | null>(null);
  const [localReaction, setLocalReaction] = useState<{ reaction: string | null }>({
    reaction: props.reaction?.reaction || null,
  });
  const [reactionCountLocal, setReactionCountLocal] = useState(props.reactionCount);
  const [reflectionCountLocal, setReflectionCountLocal] = useState(props.reflectionCount);
  const [bookmarkCountLocal, setBookmarkCountLocal] = useState(props.bookmarkCount);
  const [hasReflected, setHasReflected] = useState(false);
  const [hasInkified, setHasInkified] = useState(false);
  const [echoCount, setEchoCount] = useState(0);
  const [showEchoAnim, setShowEchoAnim] = useState(false);
  const [bookmarkMessage, setBookmarkMessage] = useState<string | null>(null);
  const [followMessage, setFollowMessage] = useState<string | null>(null);
  const [reflectOpen, setReflectOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [animateBookmark, setAnimateBookmark] = useState(false);

  const { isCoolingDown: isBookmarkCoolingDown, trigger: triggerBookmarkCooldown } = useCooldown(1000);
  const { isCoolingDown: isFollowCoolingDown, trigger: triggerFollowCooldown } = useCooldown(1000);
  const { isCoolingDown: isShareCoolingDown, trigger: triggerShareCooldown } = useCooldown(1000);
  const { isCoolingDown: isReportCoolingDown, trigger: triggerReportCooldown } = useCooldown(1000);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 786);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const total = reactionCountLocal + bookmarkCountLocal + reflectionCountLocal + (hasInkified ? 1 : 0);
    setEchoCount(total);
  }, [reactionCountLocal, bookmarkCountLocal, reflectionCountLocal, hasInkified]);

  // SHARED HANDLERS
  const handleReaction = (reactionId: string | null) => {
    // Play sound only when adding a reaction
    if (reactionId) playSound('like');
    const hadReaction = localReaction.reaction !== null;
    const willReact = reactionId !== null;
    setLocalReaction({ reaction: reactionId });
    setReactionCountLocal((prev) =>
      !hadReaction && willReact ? prev + 1 : hadReaction && !willReact ? Math.max(0, prev - 1) : prev
    );
    if (!hadReaction && willReact) setShowEchoAnim(true);
    props.onReact?.(reactionId);
  };

  const handleBookmark = () => {
    // Play sound immediately for bookmark
    if (bookmarkLocked || isBookmarkCoolingDown) {
      playSound("error");
      setBookmarkMessage("Too fast! Hold on a sec.");
      return;
    }
    if (!triggerBookmarkCooldown()) return;
    const next = !bookmarked;
    setBookmarkLocked(true);
    setBookmarked(next);
    setBookmarkCountLocal((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
    if (next) {
      setShowEchoAnim(true);
      playSound("success");
    }
    setBookmarkMessage(next ? "Saved to your inspirations ✨" : "Removed from bookmarks 🗂️");
    props.onBookmark?.();
    setTimeout(() => {
      setBookmarkLocked(false);
    }, 800);
    setTimeout(() => setBookmarkMessage(null), 1800);
  };

  const handleFollowClick = () => {
    // Play sound immediately for follow/unfollow
    playSound(isFollowing ? 'modalClose' : 'follow');
    if (isFollowLoading || isFollowCoolingDown) {
      playSound("error");
      setFollowMessage("Too fast! Hold on a sec.");
      return;
    }
    if (!triggerFollowCooldown()) return;
    setIsFollowIntent(isFollowing ? "unfollow" : "follow");
    setIsFollowLoading(true);
    setTimeout(() => {
      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      setIsFollowLoading(false);
      if (newFollowState) {
        setFollowMessage(`You followed ${props.author}`);
      } else {
        setFollowMessage(`You Unfollowed ${props.author} !`);
      }
      props.onFollow?.();
    }, 1000);
  };

  const handleShare = () => {
    // Play sound immediately for share
    playSound("share");
    if (isShareCoolingDown) {
      playSound("error");
      setBookmarkMessage("Too fast! Hold on a sec.");
      return;
    }
    if (!triggerShareCooldown()) return;
    props.onShare?.();
  };

  const handleReportClick = () => {
    // Play sound immediately for report
    playSound("modalOpen");
    if (isReportCoolingDown) {
      playSound("error");
      setBookmarkMessage("Too fast! Hold on a sec.");
      return;
    }
    if (!triggerReportCooldown()) return;
    setReportOpen(true);
  };

  // SHARED echoUsers
  const echoUsers = [];
  if (localReaction.reaction) echoUsers.push({ name: "You", avatar: "https://i.pravatar.cc/150?img=10" });
  if (bookmarked) echoUsers.push({ name: "Rakesh", avatar: "https://i.pravatar.cc/150?img=15" });
  if (hasReflected) echoUsers.push({ name: "Maya", avatar: "https://i.pravatar.cc/150?img=22" });
  if (hasInkified) echoUsers.push({ name: "Rahul", avatar: "https://i.pravatar.cc/150?img=32" });

  const sharedState = {
    animateBookmark, setAnimateBookmark,
    bookmarked, setBookmarked,
    bookmarkLocked, setBookmarkLocked,
    isFollowing, setIsFollowing,
    isFollowLoading, setIsFollowLoading,
    isFollowIntent, setIsFollowIntent,
    localReaction, setLocalReaction,
    reactionCountLocal, setReactionCountLocal,
    reflectionCountLocal, setReflectionCountLocal,
    bookmarkCountLocal, setBookmarkCountLocal,
    hasReflected, setHasReflected,
    hasInkified, setHasInkified,
    echoCount, setEchoCount,
    showEchoAnim, setShowEchoAnim,
    bookmarkMessage, setBookmarkMessage,
    followMessage, setFollowMessage,
    reflectOpen, setReflectOpen,
    reportOpen, setReportOpen,
    echoUsers,
    handleReaction,
    handleBookmark,
    handleFollowClick,
    handleShare,
    handleReportClick,
  };

  // Use random views count
  const randomViews = getRandomViews(props.id);

  console.log("ResponsiveInkCard rendered", { isMobile });

  if (isMobile) {
    return <InkCardMobile {...rest} views={randomViews} inkId={props.inkId} {...sharedState} isFollowIntent={isFollowIntent === "follow" ? true : isFollowIntent === "unfollow" ? false : null} setIsFollowIntent={(v) => setIsFollowIntent(v === true ? "follow" : v === false ? "unfollow" : null)} followMessage={followMessage || ""} />;
  }

  return <InkCard baseEchoCount={0} {...rest} views={randomViews} inkId={props.inkId} {...sharedState} small={small} />;
}
