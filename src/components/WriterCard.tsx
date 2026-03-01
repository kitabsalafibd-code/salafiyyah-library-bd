import React from 'react'
import { Link } from 'react-router-dom'

interface Writer {
    id: string
    name: string
    avatar?: string
}

interface WriterCardProps {
    writer: Writer
}

const WriterCard: React.FC<WriterCardProps> = ({ writer }) => {
    return (
        <Link to={`/writers/${writer.id}`} className="group flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-[#1a3a8f] flex items-center justify-center text-3xl text-white border-2 border-blue-800/40 group-hover:border-[#f0c040] transition-colors overflow-hidden">
                {writer.avatar ? (
                    <img src={writer.avatar} alt={writer.name} loading="lazy" className="w-full h-full object-cover" />
                ) : writer.name?.charAt(0) || '✍'}
            </div>
            <span className="text-white text-sm text-center group-hover:text-[#f0c040] transition-colors font-medium">
                {writer.name}
            </span>
        </Link>
    )
}

export default React.memo(WriterCard)
