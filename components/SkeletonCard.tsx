// components/SkeletonCard.tsx
export default function SkeletonCard() {
    return (
      <div className="skeleton-card rounded-xl border border-gray-200 bg-white p-4 shadow-sm h-64">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full skeleton-pulse"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1 skeleton-pulse"></div>
            <div className="h-2 bg-gray-200 rounded w-1/3 skeleton-pulse"></div>
          </div>
        </div>
        <div className="h-24 bg-gray-100 rounded mb-3 skeleton-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-1 skeleton-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 skeleton-pulse"></div>
      </div>
    );
  }
