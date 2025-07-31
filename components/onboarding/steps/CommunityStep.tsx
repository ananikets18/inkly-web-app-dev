"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Users, BookOpen, Trophy, Sparkles, Plus, CheckCircle, Crown, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OnboardingData } from "@/hooks/use-onboarding"

interface CommunityStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
}

const officialAccounts = [
  {
    id: "inkly_official",
    username: "inkly",
    fullName: "Inkly Official",
    avatar: "/placeholder-logo.png",
    bio: "The official Inkly account. Stay updated with platform news, features, and community highlights.",
    followers: 15420,
    isFollowing: true,
    isOfficial: true,
    badge: "Official"
  },
  {
    id: "aniket_founder",
    username: "aniket",
    fullName: "Aniket",
    avatar: "/placeholder-user.jpg",
    bio: "Founder of Inkly. Building a platform where creativity meets community.",
    followers: 8920,
    isFollowing: true,
    isFounder: true,
    badge: "Founder"
  }
]

const communityFeatures = [
  {
    icon: Users,
    title: "Connect with Creators",
    description: "Follow writers, poets, and storytellers who inspire you"
  },
  {
    icon: BookOpen,
    title: "Discover Collections",
    description: "Explore curated collections of amazing content"
  },
  {
    icon: Trophy,
    title: "Earn Achievements",
    description: "Unlock badges and rewards for your contributions"
  },
  {
    icon: Sparkles,
    title: "Join Challenges",
    description: "Participate in writing challenges and contests"
  }
]

export default function CommunityStep({ data, onUpdate }: CommunityStepProps) {
  const [suggestedFollows, setSuggestedFollows] = useState<string[]>(data.community?.followingSuggestions || ["inkly_official", "aniket_founder"])
  const [collectionsExplained, setCollectionsExplained] = useState(false)
  const [xpSystemExplained, setXpSystemExplained] = useState(false)
  const isMounted = useRef(true)

  // Update parent data when fields change (without onUpdate dependency)
  useEffect(() => {
    if (isMounted.current) {
      onUpdate({ 
        community: {
          ...data.community,
          followingSuggestions: suggestedFollows
        }
      })
    }
  }, [suggestedFollows]) // Removed onUpdate from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const toggleFollow = (userId: string) => {
    setSuggestedFollows(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-4 w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center"
        >
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Join the Community
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Connect with the Inkly team and stay updated with platform news
        </motion.p>
      </div>

      {/* Community Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {communityFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <feature.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Official Accounts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Follow Official Accounts
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stay connected with the Inkly team for updates and insights
        </p>
        
        <div className="space-y-3">
          {officialAccounts.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                    {user.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.fullName}
                    </p>
                    {user.badge && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.isOfficial 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {user.isOfficial ? <Shield className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                        {user.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{user.username} • {user.followers.toLocaleString()} followers
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.bio}
                  </p>
                </div>
              </div>
              
              <Button
                variant={suggestedFollows.includes(user.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFollow(user.id)}
                className="flex items-center gap-1"
                disabled={user.isOfficial || user.isFounder} // Disable unfollowing for official accounts
              >
                {suggestedFollows.includes(user.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Following
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Follow
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
      >
        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
          💡 Quick Tips
        </h4>
        <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
          <li>• Follow the official accounts to stay updated with platform news</li>
          <li>• Engage with posts by liking and commenting</li>
          <li>• Share your own thoughts and experiences</li>
          <li>• Join writing challenges to improve your skills</li>
        </ul>
      </motion.div>
    </motion.div>
  )
} 