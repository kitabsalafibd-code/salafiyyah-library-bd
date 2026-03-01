import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

// const _COLORS = ['#f0c040', '#3d6bff', '#c9a84c', '#2952cc', '#1a3a8f', '#8899bb']

const AdminAnalyticsPanel: React.FC = () => {
    const { data: stats } = useQuery({
        queryKey: ['analytics-stats'],
        queryFn: async () => {
            const [books, authors, users, wishlists, reviews] = await Promise.all([
                supabase.from('books').select('id', { count: 'exact', head: true }),
                supabase.from('authors').select('id', { count: 'exact', head: true }),
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('wishlists').select('id', { count: 'exact', head: true }),
                supabase.from('reviews').select('id', { count: 'exact', head: true }),
            ])
            // Today's new users
            const today = new Date().toISOString().split('T')[0]
            const { count: todayUsers } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', today)
            return {
                books: books.count || 0, authors: authors.count || 0, users: users.count || 0,
                wishlists: wishlists.count || 0, reviews: reviews.count || 0, todayUsers: todayUsers || 0,
            }
        },
    })

    // Top wishlisted books
    useQuery({
        queryKey: ['analytics-top-books'],
        queryFn: async () => {
            try {
                const { data } = await supabase.rpc('get_top_wishlisted_books', { limit_count: 5 })
                return data?.map((b: any) => ({ name: b.title?.substring(0, 15), count: b.wishlist_count || 0 })) || []
            } catch { return [] }
        },
    })

    // Books by category
    useQuery({
        queryKey: ['analytics-categories'],
        queryFn: async () => {
            const { data } = await supabase.from('books').select('categories:category_id(name)')
            const map = new Map<string, number>()
            data?.forEach((b: any) => {
                const name = b.categories?.name || 'অন্যান্য'
                map.set(name, (map.get(name) || 0) + 1)
            })
            return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
        },
    })

    // New users last 7 days
    useQuery({
        queryKey: ['analytics-new-users'],
        queryFn: async () => {
            const days = []
            for (let i = 6; i >= 0; i--) {
                const d = new Date(); d.setDate(d.getDate() - i)
                const dateStr = d.toISOString().split('T')[0]
                const nextDay = new Date(d); nextDay.setDate(nextDay.getDate() + 1)
                const { count } = await supabase.from('profiles').select('id', { count: 'exact', head: true })
                    .gte('created_at', dateStr).lt('created_at', nextDay.toISOString().split('T')[0])
                days.push({ date: d.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }), users: count || 0 })
            }
            return days
        },
    })

    // Recent reviews
    const { data: recentReviews } = useQuery({
        queryKey: ['analytics-reviews'],
        queryFn: async () => {
            const { data } = await supabase.from('reviews').select('*, books:book_id(title), profiles:user_id(full_name)').order('created_at', { ascending: false }).limit(5)
            return data || []
        },
    })

    // Recent users
    const { data: recentUsers } = useQuery({
        queryKey: ['analytics-recent-users'],
        queryFn: async () => {
            const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
            return data || []
        },
    })

    const statCards = [
        { label: 'মোট বই', value: stats?.books, icon: '📚', color: 'from-blue-600 to-blue-800' },
        { label: 'মোট লেখক', value: stats?.authors, icon: '✍️', color: 'from-purple-600 to-purple-800' },
        { label: 'মোট ব্যবহারকারী', value: stats?.users, icon: '👥', color: 'from-green-600 to-green-800' },
        { label: 'মোট উইশলিস্ট', value: stats?.wishlists, icon: '❤️', color: 'from-red-600 to-red-800' },
        { label: 'মোট রিভিউ', value: stats?.reviews, icon: '📝', color: 'from-yellow-600 to-yellow-800' },
        { label: 'আজকের নতুন ব্যবহারকারী', value: stats?.todayUsers, icon: '🆕', color: 'from-teal-600 to-teal-800' },
    ]

    return (
        <div className="admin-analytics-panel">
            <h2 className="text-lg font-bold text-white mb-4 admin-header">📊 অ্যানালিটিক্স</h2>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8 stats-grid">
                {statCards.map(s => (
                    <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-center stat-card`}>
                        <p className="text-2xl mb-1">{s.icon}</p>
                        <p className="text-2xl font-bold text-white">{s.value ?? '-'}</p>
                        <p className="text-white/70 text-xs">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 charts-grid">
                {/* Charts Placeholder */}
                <div className="bg-[#0d1428] rounded-xl border border-blue-800/30 p-4 chart-card">
                    <div style={{ background: '#0d1428', border: '1px solid #1a3a8f', borderRadius: '12px', padding: '20px', color: '#8899bb', textAlign: 'center', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        📊 চার্ট লোড হচ্ছে...
                    </div>
                </div>
                <div className="bg-[#0d1428] rounded-xl border border-blue-800/30 p-4 chart-card">
                    <div style={{ background: '#0d1428', border: '1px solid #1a3a8f', borderRadius: '12px', padding: '20px', color: '#8899bb', textAlign: 'center', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        📊 চার্ট লোড হচ্ছে...
                    </div>
                </div>
                <div className="bg-[#0d1428] rounded-xl border border-blue-800/30 p-4 md:col-span-2 chart-card">
                    <div style={{ background: '#0d1428', border: '1px solid #1a3a8f', borderRadius: '12px', padding: '20px', color: '#8899bb', textAlign: 'center', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        📊 চার্ট লোড হচ্ছে...
                    </div>
                </div>
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 activity-grid">
                <div className="bg-[#0d1428] rounded-xl border border-blue-800/30 p-4 review-card">
                    <h3 className="text-sm font-semibold text-white mb-3">📝 সাম্প্রতিক রিভিউ</h3>
                    <div className="space-y-2 activity-list">
                        {recentReviews?.map((r: any) => (
                            <div key={r.id} className="py-2 border-b border-blue-800/10 last:border-0 activity-item">
                                <p className="text-white text-xs">{r.profiles?.full_name || 'অজানা'} — <span className="text-[#c9a84c]">{r.books?.title}</span></p>
                                <p className="text-[#8899bb] text-[10px] truncate">{r.text}</p>
                            </div>
                        ))}
                    </div>
                    {(!recentReviews || recentReviews.length === 0) && <p className="text-[#8899bb] text-xs">কোনো রিভিউ নেই</p>}
                </div>
                <div className="bg-[#0d1428] rounded-xl border border-blue-800/30 p-4 user-card">
                    <h3 className="text-sm font-semibold text-white mb-3">🆕 সাম্প্রতিক ব্যবহারকারী</h3>
                    <div className="space-y-2 activity-list">
                        {recentUsers?.map((u: any) => (
                            <div key={u.id} className="py-2 border-b border-blue-800/10 last:border-0 flex items-center justify-between activity-item">
                                <p className="text-white text-xs">{u.full_name || u.email || '-'}</p>
                                <p className="text-[#8899bb] text-[10px]">{u.created_at ? new Date(u.created_at).toLocaleDateString('bn-BD') : ''}</p>
                            </div>
                        ))}
                    </div>
                    {(!recentUsers || recentUsers.length === 0) && <p className="text-[#8899bb] text-xs">কোনো ব্যবহারকারী নেই</p>}
                </div>
            </div>
        </div>
    )
}

export default AdminAnalyticsPanel
