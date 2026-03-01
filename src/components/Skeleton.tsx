import React from 'react'

interface SkeletonProps {
    className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
    <div className={`skeleton ${className}`} />
)

export const BookCardSkeleton: React.FC = () => (
    <div className="bg-[#0d1428] rounded-xl border border-blue-800/40 overflow-hidden">
        <div className="aspect-[3/4] skeleton" />
        <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-full mt-2" />
        </div>
    </div>
)

export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
    <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
        ))}
    </div>
)

export default Skeleton
