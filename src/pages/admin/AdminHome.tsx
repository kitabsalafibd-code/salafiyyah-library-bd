import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
// import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const AdminHome: React.FC = () => {
    // Fetch stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const [books, writers, publishers, users, duas] = await Promise.all([
                supabase.from('books').select('id', { count: 'exact', head: true }),
                supabase.from('authors').select('id', { count: 'exact', head: true }),
                supabase.from('publishers').select('id', { count: 'exact', head: true }),
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('duas').select('id', { count: 'exact', head: true }),
            ])
            return {
                books: books.count || 0,
                authors: writers.count || 0,
                publishers: publishers.count || 0,
                users: users.count || 0,
                duas: duas.count || 0,
            }
        }
    })

    // Fetch recent activity
    const { data: recentBooks } = useQuery({
        queryKey: ['admin-recent-activity'],
        queryFn: async () => {
            const { data } = await supabase
                .from('books')
                .select('id, title, created_at, cover_image_url')
                .order('created_at', { ascending: false })
                .limit(5)
            return data || []
        }
    })

    /*
    const chartData = [
        { name: 'শনিবার', views: 400 },
        { name: 'রবিবার', views: 300 },
        { name: 'সোমবার', views: 600 },
        { name: 'মঙ্গলবার', views: 800 },
        { name: 'বুধবার', views: 500 },
        { name: 'বৃহস্পতিবার', views: 900 },
        { name: 'শুক্রবার', views: 1100 },
    ]
    */

    const StatCard = ({ label, value, icon, color }: any) => (
        <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 p-6 flex items-center gap-4 hover:border-blue-700 transition-all stat-card">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl`}>{icon}</div>
            <div>
                <p className="text-[#8899bb] text-xs font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
        </div>
    )

    if (statsLoading) return <div className="p-10 text-center"><div className="skeleton h-12 w-48 mx-auto rounded-xl" /></div>

    return (
        <div className="space-y-8 animate-fadeIn admin-home-panel">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stats-grid">
                <StatCard label="মোট বই" value={stats?.books} icon="📚" color="bg-blue-500/10 text-blue-500" />
                <StatCard label="লেখক" value={stats?.authors} icon="✍️" color="bg-[#f0c040]/10 text-[#f0c040]" />
                <StatCard label="ইউজার" value={stats?.users} icon="👥" color="bg-green-500/10 text-green-500" />
                <StatCard label="প্রকাশনী" value={stats?.publishers} icon="🏢" color="bg-purple-500/10 text-purple-500" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 admin-main-grid">
                {/* Chart */}
                <div className="lg:col-span-2 bg-[#0d1428] rounded-2xl border border-blue-800/40 p-6 chart-container">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        📈 বই ভিউ (গত ৭ দিন)
                    </h3>
                    <div style={{
                        background: '#0d1428',
                        border: '1px solid #1a3a8f66',
                        borderRadius: '12px',
                        padding: '20px',
                        color: '#8899bb',
                        textAlign: 'center',
                        height: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        📊 চার্ট লোড হচ্ছে...
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 p-6 actions-container">
                        <h3 className="text-white font-bold mb-4">⚡ দ্রুত কাজ</h3>
                        <div className="grid grid-cols-1 gap-2 action-btns">
                            <button className="w-full py-3 bg-[#1a3a8f] text-white rounded-lg text-sm font-bold hover:bg-[#2952cc] transition-all flex items-center justify-center gap-2">
                                ➕ নতুন বই যোগ করুন
                            </button>
                            <button className="w-full py-3 bg-white/5 border border-blue-800/30 text-[#8899bb] rounded-lg text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                ✍️ নতুন লেখক যোগ করুন
                            </button>
                            <button className="w-full py-3 bg-white/5 border border-blue-800/30 text-[#8899bb] rounded-lg text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                📥 CSV আপলোড করুন
                            </button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 p-4 recent-books-card">
                        <h3 className="text-white font-bold mb-3 px-2">🕒 সাম্প্রতিক বই</h3>
                        <div className="space-y-2 recent-books-list">
                            {recentBooks?.map((b: any) => (
                                <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group book-item">
                                    <div className="w-10 h-12 bg-[#111a33] rounded shrink-0 overflow-hidden border border-blue-800/20">
                                        <img src={b.cover_image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-xs font-semibold truncate group-hover:text-[#f0c040]">{b.title}</p>
                                        <p className="text-[#8899bb] text-[10px] mt-1 italic">{new Date(b.created_at).toLocaleDateString('bn-BD')} এ যোগ করা হয়েছে</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHome
