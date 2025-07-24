import Header from "../../components/Header"
import SideNav from "../../components/SideNav"
import BottomNav from "../../components/BottomNav"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <Header />
      <div className="flex sm:flex-row flex-col">
        <SideNav />
        <main className="flex-1 sm:px-4 py-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header Skeleton */}
            <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 dark:border-gray-800 shadow-xl p-6 sm:p-8">
              <div className="animate-pulse">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-24 h-24 bg-gray-200/60 dark:bg-gray-800/60 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200/60 dark:bg-gray-800/60 rounded-lg w-48" />
                    <div className="h-4 bg-gray-200/60 dark:bg-gray-800/60 rounded w-32" />
                    <div className="h-4 bg-gray-200/60 dark:bg-gray-800/60 rounded w-full max-w-md" />
                  </div>
                  <div className="w-32 h-10 bg-gray-200/60 dark:bg-gray-800/60 rounded-full" />
                </div>
              </div>
            </div>

            {/* Pinned Inks Skeleton */}
            <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 dark:border-gray-800 shadow-xl p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200/60 dark:bg-gray-800/60 rounded w-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-32 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl" />
                  <div className="h-32 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Content Tabs Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 dark:border-gray-800 shadow-xl">
                  <div className="animate-pulse p-6 space-y-6">
                    <div className="flex space-x-4 border-b border-gray-200/60 dark:border-gray-800/60 pb-4">
                      <div className="h-8 bg-gray-200/60 dark:bg-gray-800/60 rounded w-24" />
                      <div className="h-8 bg-gray-200/60 dark:bg-gray-800/60 rounded w-24" />
                      <div className="h-8 bg-gray-200/60 dark:bg-gray-800/60 rounded w-24" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-24 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl" />
                      <div className="h-24 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl" />
                      <div className="h-24 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 dark:border-gray-800 shadow-xl p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200/60 dark:bg-gray-800/60 rounded w-32" />
                    <div className="h-20 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl" />
                    <div className="h-6 bg-gray-200/60 dark:bg-gray-800/60 rounded w-24" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-12 bg-gray-200/60 dark:bg-gray-800/60 rounded-lg" />
                      <div className="h-12 bg-gray-200/60 dark:bg-gray-800/60 rounded-lg" />
                      <div className="h-12 bg-gray-200/60 dark:bg-gray-800/60 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
