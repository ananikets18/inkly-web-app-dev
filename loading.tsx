import Header from "./components/Header"
import SideNav from "./components/SideNav"
import BottomNav from "./components/BottomNav"
import SkeletonCard from "@/components/SkeletonCard"
import Masonry from "react-masonry-css"
import { Skeleton } from "@/components/ui/skeleton"

// Masonry breakpoints for responsive layout
const masonryBreakpoints = {
  default: 5, // ≥1536px
  1536: 4, // ≥1280px and <1536px
  1280: 3, // ≥1024px and <1280px
  1024: 2, // ≥768px and <1024px
  768: 1, // <768px (mobile only)
}

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex sm:flex-row flex-col">
        <SideNav />
        <main className="flex-1 sm:px-2 sm:px-4 py-3" role="main">
          {/* Skeleton Header */}
          <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md border-b pb-4 mb-6 px-4">
            <div className="flex flex-col space-y-4 max-w-7xl mx-auto pt-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full max-w-md ml-4" />
              </div>

              {/* Skeleton Categories */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
                ))}
              </div>

              {/* Skeleton Results count */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* Skeleton Content */}
          <div className="px-4">
            <Masonry
              breakpointCols={masonryBreakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {Array.from({ length: 12 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </Masonry>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
