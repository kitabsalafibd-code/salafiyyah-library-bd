import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'এইমাত্র'
    if (mins < 60) return `${mins} মিনিট আগে`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} ঘণ্টা আগে`
    const days = Math.floor(hours / 24)
    return `${days} দিন আগে`
}

const NotificationBell: React.FC = () => {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()

    const { data: notifications } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: async () => {
            if (!user) return []
            const { data } = await supabase
                .from('notifications')
                .select('*, books:book_id(id, title, cover_image)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10)
            return data || []
        },
        enabled: !!user,
        refetchInterval: 30000,
    })

    const unreadCount = notifications?.filter((n: any) => !n.is_read).length || 0

    const markAllRead = useMutation({
        mutationFn: async () => {
            if (!user) return
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] }),
    })

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    if (!user) return null

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="relative text-[#8899bb] hover:text-[#f0c040] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-10 w-80 bg-[#0d1428] border border-blue-800/40 rounded-xl shadow-2xl max-h-[400px] overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-blue-800/30">
                        <span className="text-white font-semibold text-sm">🔔 নোটিফিকেশন</span>
                        {unreadCount > 0 && (
                            <button onClick={() => markAllRead.mutate()} className="text-xs text-[#3d6bff] hover:underline">
                                সব পড়া হয়েছে
                            </button>
                        )}
                    </div>
                    <div className="overflow-y-auto max-h-[340px]">
                        {(!notifications || notifications.length === 0) ? (
                            <p className="text-[#8899bb] text-sm text-center py-8">কোনো নোটিফিকেশন নেই</p>
                        ) : (
                            notifications.map((n: any) => (
                                <Link
                                    key={n.id}
                                    to={`/books/${n.book_id}`}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 hover:bg-[#1a3a8f]/20 transition-colors border-b border-blue-800/10 ${!n.is_read ? 'bg-[#1a3a8f]/10' : ''}`}
                                >
                                    <div className="w-10 h-12 rounded bg-[#111a33] overflow-hidden shrink-0">
                                        {n.books?.cover_image ? (
                                            <img src={n.books.cover_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-sm">📖</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-xs leading-snug line-clamp-2">
                                            নতুন বই যোগ হয়েছে: <span className="text-[#f0c040]">{n.books?.title || 'বই'}</span>
                                        </p>
                                        <p className="text-[#8899bb] text-[10px] mt-1">{timeAgo(n.created_at)}</p>
                                    </div>
                                    {!n.is_read && <span className="w-2 h-2 bg-[#3d6bff] rounded-full shrink-0" />}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default React.memo(NotificationBell)
