import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from './Toast'

interface ReadingProgressButtonProps {
    bookId: string
    showLabel?: boolean
}

type Status = 'want_to_read' | 'reading' | 'finished' | null

const statusMap = {
    'want_to_read': { label: 'পড়তে চাই', icon: '📖', color: 'text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-400/10' },
    'reading': { label: 'পড়ছি', icon: '📗', color: 'text-[#f0c040]', border: 'border-[#f0c040]/30', bg: 'bg-[#f0c040]/10' },
    'finished': { label: 'পড়া শেষ', icon: '✅', color: 'text-green-400', border: 'border-green-400/30', bg: 'bg-green-400/10' },
}

const ReadingProgressButton: React.FC<ReadingProgressButtonProps> = ({ bookId, showLabel = false }) => {
    const { user } = useAuth()
    const { showToast } = useToast()
    const [status, setStatus] = useState<Status>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const fetchStatus = useCallback(async () => {
        if (!user) return
        const { data } = await supabase
            .from('reading_progress')
            .select('status')
            .eq('user_id', user.id)
            .eq('book_id', bookId)
            .maybeSingle()

        if (data) setStatus(data.status as Status)
    }, [user, bookId])

    useEffect(() => {
        fetchStatus()
    }, [fetchStatus])

    const updateStatus = async (newStatus: Status) => {
        if (!user) return
        setIsLoading(true)
        setShowMenu(false)

        try {
            if (newStatus === null) {
                // Remove if possible (though prompt says UPSERT, deleting usually makes sense if deselected)
                await supabase.from('reading_progress').delete().eq('user_id', user.id).eq('book_id', bookId)
                setStatus(null)
                showToast('পড়ার তালিকা থেকে সরানো হয়েছে')
            } else {
                const { error } = await supabase
                    .from('reading_progress')
                    .upsert({
                        user_id: user.id,
                        book_id: bookId,
                        status: newStatus,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id, book_id' })

                if (error) throw error
                setStatus(newStatus)
                showToast(`${statusMap[newStatus].label} তালিকায় যোগ করা হয়েছে`)
            }
        } catch (err: any) {
            showToast(err.message || 'ব্যর্থ হয়েছে', 'error')
        }
        setIsLoading(false)
    }

    if (!user) return null

    const current = status ? statusMap[status] : { label: 'পড়ার তালিকা', icon: '📚', color: 'text-[#8899bb]', border: 'border-blue-800/30', bg: 'bg-transparent' }

    return (
        <div className="relative inline-block">
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu) }}
                disabled={isLoading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:bg-white/5 ${current.bg} ${current.border} ${current.color} text-xs font-semibold`}
            >
                <span>{current.icon}</span>
                {showLabel && <span>{current.label}</span>}
                {isLoading && <span className="animate-spin text-[10px]">⌛</span>}
            </button>

            {showMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute left-0 mt-2 w-40 z-50 bg-[#111a33] border border-blue-800/40 rounded-xl shadow-2xl py-2 overflow-hidden animate-fadeIn">
                        {(Object.entries(statusMap) as [Status, typeof statusMap[keyof typeof statusMap]][]).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateStatus(key === status ? null : key) }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-all hover:bg-white/5 ${status === key ? config.color + ' bg-white/5 font-bold' : 'text-[#8899bb]'}`}
                            >
                                <span className="text-base">{config.icon}</span>
                                <span>{config.label}</span>
                                {status === key && <span className="ml-auto">✓</span>}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default React.memo(ReadingProgressButton)
