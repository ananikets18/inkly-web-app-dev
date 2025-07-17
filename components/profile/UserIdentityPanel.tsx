"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Edit2, Camera, MoreHorizontal } from "lucide-react"
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

interface UserIdentityPanelProps {
  userData: {
    id: string
    name: string
    username: string
    bio: string
    location: string
    joinedDate: string
    avatar: string
    coverGradient?: string
    pronouns?: string
    level: number
    xp: number
    xpToNext: number
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
}

export default function UserIdentityPanel({
  userData,
  isOwnProfile,
  isFollowing,
  isFollowLoading,
  followIntent,
  onFollow,
  onProfileUpdate,
}: UserIdentityPanelProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [avatarHover, setAvatarHover] = useState(false)

  const badgeType = getUserBadgeType(userData.name)
  const isVerified = shouldShowVerifiedTick(userData.name)
  const displayName = getDisplayName(userData.name)

  return (
    <div className="relative">
      {/* Cover Gradient Background */}
      <div
        className="absolute inset-0 h-48 sm:h-56 lg:h-64 rounded-t-3xl"
        style={{
          background: userData.coverGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          opacity: 0.1,
        }}
      />

      {/* Main Content */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-800 shadow-xl overflow-hidden">
        {/* Action Buttons - Top Right */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setEditModalOpen(true)}
              className="bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 text-purple-600 dark:text-purple-300 shadow-md border border-purple-200 dark:border-purple-800"
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
                className="bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 shadow-md border border-gray-200 dark:border-gray-700"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <DropdownMenuItem onClick={() => setShareModalOpen(true)}>Share Profile</DropdownMenuItem>
              {!isOwnProfile && <DropdownMenuItem className="text-red-600 dark:text-red-400">Report Profile</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Mobile Layout */}
          <div className="flex flex-col sm:hidden">
            {/* Avatar and Level */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => setAvatarHover(true)}
                  onHoverEnd={() => setAvatarHover(false)}
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-20" />
                  <Avatar className="w-20 h-20 ring-4 ring-white dark:ring-gray-900 shadow-xl relative z-10">
                    <AvatarFallback className={`bg-gradient-to-br ${userData.avatar} text-white text-xl font-bold`}>
                      {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <motion.div
                      className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: avatarHover ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                {/*
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Lv.{userData.level}
                  </div>
                */}
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
              {userData.pronouns && <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{userData.pronouns}</p>}
              <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-3">{userData.bio}</p>

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
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => setAvatarHover(true)}
                  onHoverEnd={() => setAvatarHover(false)}
                >
                  <div className="absolute -inset-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-20" />
                  <Avatar className="w-32 h-32 ring-6 ring-white dark:ring-gray-900 shadow-xl relative z-10">
                    <AvatarFallback className={`bg-gradient-to-br ${userData.avatar} text-white text-3xl font-bold`}>
                      {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <motion.div
                      className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: avatarHover ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                {/*
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg">
                    Lv.{userData.level}
                  </div>
                */}
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
                    {userData.pronouns && <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{userData.pronouns}</p>}
                    <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed mb-4 max-w-2xl">{userData.bio}</p>

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
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200/50"
          >
            {[
              { label: "Echoes", value: formatCount(userData.stats.echoes), color: "text-purple-600" },
              { label: "Followers", value: formatCount(userData.stats.followers), color: "text-blue-600" },
              { label: "Following", value: formatCount(userData.stats.following), color: "text-green-600" },
              { label: "Inks", value: userData.stats.totalInks, color: "text-orange-600" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="text-center sm:text-left cursor-pointer group"
              >
                <div className={`text-2xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-500 dark:text-gray-400 transition-colors">{stat.label}</div>
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
    </div>
  )
}
