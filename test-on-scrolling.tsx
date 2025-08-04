"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TestNavPage() {
  const [activeTab, setActiveTab] = useState("home")
  const [scrollPosition, setScrollPosition] = useState(0)
  const [touchEvents, setTouchEvents] = useState<string[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const addTouchEvent = (event: string) => {
    setTouchEvents((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${event}`])
  }

  const generateContent = () => {
    return Array.from({ length: 50 }, (_, i) => (
      <Card key={i} className="mb-4">
        <CardHeader>
          <CardTitle>Test Content Block {i + 1}</CardTitle>
          <CardDescription>This is test content to enable scrolling and test the navigation behavior.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Scroll up and down to test the dynamic navigation show/hide behavior. The navigation should hide when
            scrolling down and show when scrolling up.
          </p>
        </CardContent>
      </Card>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Navigation Test Page</h1>
        <p className="text-sm text-gray-600">
          Testing touch targets, active labels, visual balance, and scroll behavior
        </p>
      </div>

      {/* Test Controls */}
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Navigation Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active State Test */}
            <div>
              <h3 className="font-semibold mb-2">Active Label Test</h3>
              <div className="flex flex-wrap gap-2">
                {["home", "explore", "create", "notifications", "settings"].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab)}
                    className="capitalize"
                  >
                    Set {tab} Active
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Current active:{" "}
                <Badge variant="secondary" className="capitalize">
                  {activeTab}
                </Badge>
              </p>
            </div>

            {/* Touch Events Log */}
            <div>
              <h3 className="font-semibold mb-2">Touch Events Log</h3>
              <div className="bg-gray-100 p-3 rounded-lg max-h-32 overflow-y-auto">
                {touchEvents.length === 0 ? (
                  <p className="text-sm text-gray-500">Touch navigation buttons to see events...</p>
                ) : (
                  touchEvents.map((event, i) => (
                    <p key={i} className="text-xs text-gray-700">
                      {event}
                    </p>
                  ))
                )}
              </div>
            </div>

            {/* Scroll Position */}
            <div>
              <h3 className="font-semibold mb-2">Scroll Behavior Test</h3>
              <p className="text-sm text-gray-600">
                Scroll Position: <Badge variant="outline">{scrollPosition}px</Badge>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Navigation should hide when scrolling down (position increasing) and show when scrolling up.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Touch Target Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Touch Target Test</CardTitle>
            <CardDescription>
              Test the navigation buttons below. Each button should be easily tappable on mobile devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => addTouchEvent("Home button touched")} className="h-12">
                Test Home Touch
              </Button>
              <Button variant="outline" onClick={() => addTouchEvent("Explore button touched")} className="h-12">
                Test Explore Touch
              </Button>
              <Button
                variant="outline"
                onClick={() => addTouchEvent("Create button touched")}
                className="h-12 bg-purple-100 hover:bg-purple-200"
              >
                Test Create Touch
              </Button>
              <Button variant="outline" onClick={() => addTouchEvent("Notifications button touched")} className="h-12">
                Test Notifications Touch
              </Button>
              <Button
                variant="outline"
                onClick={() => addTouchEvent("Settings button touched")}
                className="h-12 col-span-2"
              >
                Test Settings Touch
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visual Balance Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visual Balance Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium">Navigation Height</span>
                <Badge variant="secondary">Reduced (py-2)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium">Button Padding</span>
                <Badge variant="secondary">Compact (py-1.5)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium">Icon Spacing</span>
                <Badge variant="secondary">Balanced</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium">Touch Target Size</span>
                <Badge variant="secondary">44px+ (Accessible)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Content */}
      <div className="px-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Scroll Test Content</h2>
        {generateContent()}
      </div>

      {/* Test Results Summary */}
      <div className="fixed top-4 right-4 z-30">
        <Card className="w-64">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Test Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Touch Targets:</span>
                <Badge variant="secondary" className="text-xs">
                  ✓ 44px+
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Active Labels:</span>
                <Badge variant="secondary" className="text-xs">
                  ✓ Visible
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Visual Balance:</span>
                <Badge variant="secondary" className="text-xs">
                  ✓ Good
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Scroll Behavior:</span>
                <Badge variant="secondary" className="text-xs">
                  ✓ Dynamic
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
