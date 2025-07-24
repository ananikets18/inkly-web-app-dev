"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Edit2, MoreHorizontal, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { formatCount } from "@/utils/formatCount"
import FollowButton from "@/components/FollowButton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  UserBadge,
  VerifiedTick,
  getUserBadgeType,
  shouldShowVerifiedTick,
  getDisplayName,
} from "@/components/ui/user-badges"
import EditProfileModal from "./EditProfileModal"
import ShareProfileModal from "@/components/ShareProfileModal"
import ReportModal from "../ReportModal"

// Social media icons mapping
const socialIcons = {
  twitter: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  github: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  website: <ExternalLink className="w-4 h-4" />,
}

// Helper function to get social platform from URL
const getSocialPlatform = (url: string): keyof typeof socialIcons => {
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter"
  if (url.includes("instagram.com")) return "instagram"
  if (url.includes("linkedin.com")) return "linkedin"
  if (url.includes("github.com")) return "github"
  return "website"
}

// Helper function to get text color based on background
const getTextColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hex = backgroundColor.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

interface UserIdentityPanelProps {
  userData: {
    id: string
    name: string
    username: string
    bio: string
    location: string
    joinedDate: string
    avatar: string
    avatarColor?: string
    pronouns?: string
    level: number
    xp: number
    xpToNext: number
    externalLinks?: Array<{
      url: string
      label: string
    }>
    stats: {
      echoes: number
      followers: number
      following: number
      totalInks: number
    }
  }
  isOwnProfile: boolean
  isFollowing: boolean
  isFollowLoading: boolean
  followIntent: "follow" | "unfollow" | null
  onFollow: (e: React.MouseEvent) => void
  onProfileUpdate: (updatedData: any) => void
  onFollowersClick?: () => void
  onFollowingClick?: () => void
}

export default function UserIdentityPanel({
  userData,
  isOwnProfile,
  isFollowing,
  isFollowLoading,
  followIntent,
  onFollow,
  onProfileUpdate,
  onFollowersClick,
  onFollowingClick,
}: UserIdentityPanelProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  const badgeType = getUserBadgeType(userData.name)
  const isVerified = shouldShowVerifiedTick(userData.name)
  const displayName = getDisplayName(userData.name)

  // Use avatarColor or fallback to default
  const avatarBgColor = userData.avatarColor || "#9333ea"
  const textColor = getTextColor(avatarBgColor)

  return (
    <div className="relative">
      {/* Clean Profile Header - No gradient background */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Action Buttons - Top Right */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setEditModalOpen(true)}
              className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-purple-600 dark:text-purple-300 shadow-md border border-purple-200 dark:border-purple-800"
              aria-label="Edit profile"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md border border-gray-200 dark:border-gray-700"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuItem onClick={() => setShareModalOpen(true)}>Share Profile</DropdownMenuItem>
              {!isOwnProfile && (
                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => setReportModalOpen(true)}>Report Profile</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Mobile Layout */}
          <div className="flex flex-col sm:hidden">
            {/* Avatar and Level */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                  <Avatar className="w-20 h-20 ring-4 ring-white dark:ring-gray-900 shadow-lg">
                    <AvatarFallback
                      className="text-xl font-bold"
                      style={{
                        backgroundColor: avatarBgColor,
                        color: textColor,
                      }}
                    >
                      {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>

              {/* Action Button */}
              <div className="ml-auto">
                {isOwnProfile ? (
                  <Button
                    onClick={() => setEditModalOpen(true)}
                    className="bg-[#9333ea] hover:bg-[#7e22ce] text-white px-6 py-2 rounded-full"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <FollowButton
                    onFollow={onFollow}
                    isFollowing={isFollowing}
                    isLoading={isFollowLoading}
                    followIntent={followIntent}
                  />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{displayName}</h1>
                {badgeType && <UserBadge type={badgeType} />}
                {!badgeType && isVerified && <VerifiedTick />}
              </div>
              <p className="text-purple-600 dark:text-purple-300 font-medium text-sm mb-1">{userData.username}</p>
              {userData.pronouns && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{userData.pronouns}</p>
              )}
              <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-3">{userData.bio}</p>

              {/* External Links */}
              {userData.externalLinks && userData.externalLinks.length > 0 && (
                <div className="flex gap-3 mb-3">
                  {userData.externalLinks.slice(0, 2).map((link, index) => {
                    const platform = getSocialPlatform(link.url)
                    return (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Visit ${link.label || platform}`}
                      >
                        {socialIcons[platform]}
                        <span className="max-w-[100px] truncate">{link.label || platform}</span>
                      </motion.a>
                    )
                  })}
                </div>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {userData.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                  <Avatar className="w-32 h-32 ring-6 ring-white dark:ring-gray-900 shadow-lg">
                    <AvatarFallback
                      className="text-3xl font-bold"
                      style={{
                        backgroundColor: avatarBgColor,
                        color: textColor,
                      }}
                    >
                      {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{displayName}</h1>
                      {badgeType && <UserBadge type={badgeType} />}
                      {!badgeType && isVerified && <VerifiedTick />}
                    </div>
                    <p className="text-purple-600 dark:text-purple-300 font-medium text-lg mb-1">{userData.username}</p>
                    {userData.pronouns && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{userData.pronouns}</p>
                    )}
                    <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed mb-4 max-w-2xl">
                      {userData.bio}
                    </p>

                    {/* External Links */}
                    {userData.externalLinks && userData.externalLinks.length > 0 && (
                      <div className="flex gap-4 mb-4">
                        {userData.externalLinks.slice(0, 2).map((link, index) => {
                          const platform = getSocialPlatform(link.url)
                          return (
                            <motion.a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label={`Visit ${link.label || platform}`}
                            >
                              {socialIcons[platform]}
                              <span className="max-w-[120px] truncate">{link.label || platform}</span>
                            </motion.a>
                          )
                        })}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{userData.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {userData.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {isOwnProfile ? (
                      <Button
                        onClick={() => setEditModalOpen(true)}
                        className="bg-[#9333ea] hover:bg-[#7e22ce] text-white px-8 py-3 rounded-full text-lg"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <FollowButton
                        onFollow={onFollow}
                        isFollowing={isFollowing}
                        isLoading={isFollowLoading}
                        followIntent={followIntent}
                        className="px-8 py-3 text-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
          >
            {[
              {
                label: "Echoes",
                value: formatCount(userData.stats.echoes),
                color: "text-purple-600",
                onClick: undefined,
              },
              {
                label: "Followers",
                value: formatCount(userData.stats.followers),
                color: "text-blue-600",
                onClick: onFollowersClick,
              },
              {
                label: "Following",
                value: formatCount(userData.stats.following),
                color: "text-green-600",
                onClick: onFollowingClick,
              },
              {
                label: "Inks",
                value: userData.stats.totalInks,
                color: "text-orange-600",
                onClick: undefined,
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className={`text-center sm:text-left group ${stat.onClick ? "cursor-pointer" : ""}`}
                onClick={stat.onClick}
              >
                <div className={`text-2xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-500 dark:text-gray-400 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userData={userData}
        onSave={onProfileUpdate}
      />

      <ShareProfileModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={`https://inkly.app/profile/${userData.id}`}
        title={`Check out ${displayName}'s profile on Inkly`}
      />

      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        inkId={userData.id}
        content={userData.name}
      />
    </div>
  )
}
