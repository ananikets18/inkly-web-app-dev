import React from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserBadge, VerifiedTick, getUserBadgeType, shouldShowVerifiedTick, getDisplayName, badgeConfig } from "@/components/ui/user-badges";
import { Button } from "@/components/ui/button";
import FollowButton from "./FollowButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserHoverCardProps {
  author: string;
  avatarColor: string;
  isFollowing: boolean;
  isFollowLoading: boolean;
  onFollow: (e: React.MouseEvent) => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
  followIntent: "follow" | "unfollow" | null;
  className?: string;
}

const UserHoverCard: React.FC<React.PropsWithChildren<UserHoverCardProps>> = ({
  author,
  avatarColor,
  isFollowing,
  isFollowLoading,
  onFollow,
  onMessage,
  onViewProfile,
  followIntent,
  className = "",
  children,
}) => {
  const isMobile = useIsMobile();
  const displayName = getDisplayName(author);
  const badgeType = getUserBadgeType(author);
  const verified = shouldShowVerifiedTick(author);
  const username = `@${author.toLowerCase().replace(/\s+/g, "_")}`;

  // On mobile, just render children (no hover card)
  if (isMobile) return <>{children}</>;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className={`z-[9999] shadow-xl p-4 w-60 ${className}`}
        side="right"
        align="center"
        sideOffset={10}
        style={{ marginTop: 18 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="relative flex items-center justify-center">
            <Avatar className="w-12 h-12">
              <AvatarFallback className={`bg-gradient-to-br ${avatarColor} text-white text-lg font-medium`}>
                {displayName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            {badgeType && (
              <span className="absolute -bottom-1 -right-1">
                {/* Only the icon, no text */}
                {React.cloneElement(
                  badgeConfig[badgeType].icon,
                  { className: "w-5 h-5 rounded-full bg-white border-2 border-white shadow" }
                )}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-semibold text-gray-900 flex items-center gap-1 text-base">
              {displayName}
              {!badgeType && verified && <VerifiedTick />}
            </span>
            <span className="text-xs text-gray-500">{username}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3 items-center justify-start">
          <FollowButton
            onFollow={onFollow}
            isFollowing={isFollowing}
            isLoading={isFollowLoading}
            followIntent={followIntent}
          />
          <Button variant="ghost" size="sm" onClick={onViewProfile} className="text-xs">
            View
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;
