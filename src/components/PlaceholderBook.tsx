import React from 'react'

interface PlaceholderBookProps {
    className?: string
}

const PlaceholderBook: React.FC<PlaceholderBookProps> = ({ className = "" }) => (
    <div
        className={`w-full h-full bg-[#0d1428] border border-blue-800/40 rounded-xl flex flex-col items-center justify-center text-[#c9a84c] ${className}`}
        style={{ aspectRatio: '3/4' }}
    >
        <span className="text-5xl mb-3">📚</span>
        <span className="text-xs text-[#8899bb] font-medium">প্রচ্ছদ নেই</span>
    </div>
)

export default PlaceholderBook
