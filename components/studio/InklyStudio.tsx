"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Plus,
  Filter,
  Download,
} from "lucide-react"
import InksOverview from "./InksOverview"
import DraftsQueue from "./DraftsQueue"

export default function InklyStudio() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-1.5">
          <TabsList
            role="tablist"
            className="flex w-full p-1 
                      dark:from-purple-800 dark:to-purple-900
                      border border-gray-200 dark:border-gray-700
                      rounded overflow-hidden text-sm font-medium"
          >
            <TabsTrigger
              role="tab"
              aria-selected="true"
              value="overview"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md
                        transition-all duration-200
                        hover:bg-purple-100 dark:hover:bg-purple-800
                        focus:outline-none 
                        data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900
                        data-[state=active]:text-purple-700 dark:text-purple-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              role="tab"
              aria-selected="false"
              value="drafts"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md
                        transition-all duration-200
                        hover:bg-purple-100 dark:hover:bg-purple-800
                        focus:outline-none 
                        data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900
                        data-[state=active]:text-purple-700 dark:text-purple-300"
            >
              <Plus className="w-4 h-4" />
              <span>Drafts</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <InksOverview />
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          <DraftsQueue />
        </TabsContent>
      </Tabs>
    </div>
  )
}
