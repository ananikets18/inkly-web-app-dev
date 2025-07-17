"use client"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useNotifications } from "@/hooks/use-notifications"
import { Bell, Info, TestTube, Shield, Heart, TrendingUp, Users, Star, Lightbulb, Award } from "lucide-react"

export default function NotificationSettings() {
  const {
    permission,
    settings,
    isLoading,
    canUseNotifications,
    isEnabled,
    togglePushNotifications,
    toggleNotificationType,
    sendTestNotification,
  } = useNotifications()

  const getPermissionBadge = () => {
    switch (permission) {
      case "granted":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Granted
          </Badge>
        )
      case "denied":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            Blocked
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Not Set
          </Badge>
        )
    }
  }

  const notificationTypes = [
    {
      key: "newFollower" as const,
      icon: Users,
      title: "New Follower",
      description: "Get notified when someone follows you",
      enabled: settings.newFollower,
    },
    {
      key: "newReaction" as const,
      icon: Heart,
      title: "New Reaction",
      description: "Get notified when someone reacts to your Inks",
      enabled: settings.newReaction,
    },
    {
      key: "followedUserInks" as const,
      icon: Bell,
      title: "Followed User Inks",
      description: "New Inks from people you follow",
      enabled: settings.followedUserInks,
    },
    {
      key: "trendingInks" as const,
      icon: TrendingUp,
      title: "Trending Inks",
      description: "Popular Inks that are gaining traction",
      enabled: settings.trendingInks,
    },
    {
      key: "mostReacted" as const,
      icon: Star,
      title: "Most Reacted",
      description: "Inks with high engagement you might enjoy",
      enabled: settings.mostReacted,
    },
    {
      key: "suggestions" as const,
      icon: Lightbulb,
      title: "Suggestions",
      description: "Personalized recommendations based on your interests",
      enabled: settings.suggestions,
    },
    {
      key: "editorsPick" as const,
      icon: Award,
      title: "Editor's Pick",
      description: "Curated highlights from our editorial team",
      enabled: settings.editorsPick,
    },
  ]

  return (
    <TooltipProvider>
      <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col min-h-[500px]">
        <div className="flex items-center gap-3 mb-1">
          <Bell className="w-6 h-6 text-purple-600" />
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Notifications</h1>
          {getPermissionBadge()}
        </div>
        <p className="text-muted-foreground text-sm mb-6">Manage how and when you receive notifications</p>

        {/* Master Push Notifications Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${isEnabled ? "bg-purple-100 text-purple-600" : "bg-muted text-muted-foreground"}`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground flex items-center gap-2">
                  Push Notifications
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Master toggle for all browser notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-xs text-muted-foreground">
                  {permission === "granted"
                    ? "Browser notifications are enabled"
                    : permission === "denied"
                      ? "Browser notifications are blocked"
                      : "Enable browser push notifications"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={sendTestNotification}
                  className="flex items-center gap-2 text-xs bg-transparent"
                >
                  <TestTube className="w-4 h-4" />
                  Test
                </Button>
              )}
              <Switch
                checked={settings.pushEnabled}
                onCheckedChange={togglePushNotifications}
                disabled={isLoading}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>

          {/* Permission Helper */}
          {permission === "denied" && (
            <div className="mt-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 flex items-start gap-3">
              <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Notifications are blocked</p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                  To enable notifications, click the notification icon in your browser's address bar or check your
                  browser settings.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Individual Notification Types */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground mb-4">Notification Types</h2>

          <div className="grid gap-4">
            {notificationTypes.map((type) => {
              const Icon = type.icon
              const isDisabled = !isEnabled

              return (
                <div
                  key={type.key}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    isDisabled ? "bg-muted/50 border-border opacity-60" : "bg-card border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        type.enabled && !isDisabled ? "bg-purple-100 text-purple-600" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{type.title}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isDisabled && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enable push notifications first</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Switch
                      checked={type.enabled && !isDisabled}
                      onCheckedChange={(checked) => toggleNotificationType(type.key, checked)}
                      disabled={isDisabled}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer with additional info */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="bg-muted/50 rounded-lg px-4 py-3 flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">About Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                Notifications respect your browser's "Do Not Disturb" settings and won't interrupt during quiet hours.
                You can always adjust these settings or disable notifications entirely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
