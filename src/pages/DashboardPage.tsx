import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import BookCard from '../components/BookCard'
import { Link } from 'react-router-dom'

const tabs = [
    { key: 'wishlist', label: '❤️ উইশলিস্ট' },
    { key: 'reading_list', label: '📚 পড়ার তালিকা' },
    { key: 'quran_bookmarks', label: '🔖 কুরআন বুকমার্ক' },
    { key: 'writers', label: '✍️ পছন্দের লেখক' },
    { key: 'profile', label: '👤 প্রোফাইল' },
    { key: 'settings', label: '⚙️ নোটিফিকেশন' },
]

/* ===== Tab: Wishlist ===== */
const WishlistTab: React.FC<{ userId: string }> = ({ userId }) => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    const { data: books, isLoading } = useQuery({
        queryKey: ['user-wishlist', userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('wishlists')
                .select('id, book_id, books:book_id(*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*))')
                .eq('user_id', userId)
            return data || []
        },
    })

    const removeWishlist = useMutation({
        mutationFn: async (wishlistId: string) => {
            await supabase.from('wishlists').delete().eq('id', wishlistId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-wishlist', userId] })
            showToast('বই উইশলিস্ট থেকে সরানো হয়েছে')
        },
    })

    if (isLoading) return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-xl" />)}</div>

    if (!books?.length) return <p className="text-[#8899bb] text-center py-12">আপনার উইশলিস্ট খালি</p>

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {books.map((item: any) => (
                <div key={item.id} className="relative group">
                    <BookCard book={item.books} />
                    <button
                        onClick={() => removeWishlist.mutate(item.id)}
                        className="absolute top-2 right-2 z-10 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >✕</button>
                </div>
            ))}
        </div>
    )
}

/* ===== Tab: Reading List ===== */
const ReadingListTab: React.FC<{ userId: string }> = ({ userId }) => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()
    const [subTab, setSubTab] = useState<'want_to_read' | 'reading' | 'finished'>('reading')

    const { data: items, isLoading } = useQuery({
        queryKey: ['reading-progress', userId, subTab],
        queryFn: async () => {
            const { data } = await supabase
                .from('reading_progress')
                .select('id, status, books:book_id(*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*))')
                .eq('user_id', userId)
                .eq('status', subTab)
            return data || []
        },
    })

    const removeItem = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from('reading_progress').delete().eq('id', id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reading-progress', userId] })
            showToast('তালিকা থেকে সরানো হয়েছে')
        },
    })

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                {(['want_to_read', 'reading', 'finished'] as const).map((key) => {
                    const labels = { want_to_read: '📖 পড়তে চাই', reading: '📗 পড়ছি', finished: '✅ পড়া শেষ' }
                    return (
                        <button
                            key={key}
                            onClick={() => setSubTab(key)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${subTab === key ? 'bg-[#c9a84c] text-[#0a0f1e]' : 'bg-[#111a33] text-[#8899bb] border border-blue-800/30'}`}
                        >
                            {labels[key]}
                        </button>
                    )
                })}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-xl" />)}
                </div>
            ) : !items?.length ? (
                <p className="text-[#8899bb] text-center py-12">এই তালিকায় কোনো বই নেই</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items.map((item: any) => (
                        <div key={item.id} className="relative group">
                            <BookCard book={item.books} />
                            <button
                                onClick={() => removeItem.mutate(item.id)}
                                className="absolute top-2 right-2 z-10 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >✕</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ===== Tab: Quran Bookmarks ===== */
const QuranBookmarksTab: React.FC<{ userId: string }> = ({ userId }) => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    const { data: quranData } = useQuery({
        queryKey: ['surah-list'],
        queryFn: async () => {
            const res = await fetch('https://api.alquran.cloud/v1/surah')
            const json = await res.json()
            return json.data || []
        },
        staleTime: 24 * 60 * 60 * 1000,
    })

    const { data: bookmarks, isLoading } = useQuery({
        queryKey: ['user-quran-bookmarks', userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('quran_bookmarks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
            return data || []
        },
    })

    const removeBookmark = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from('quran_bookmarks').delete().eq('id', id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-quran-bookmarks', userId] })
            showToast('বুকমার্ক সরানো হয়েছে')
        },
    })

    if (isLoading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>

    if (!bookmarks?.length) return <p className="text-[#8899bb] text-center py-12">আপনার কোনো কুরআন বুকমার্ক নেই</p>

    const getSurahName = (num: number) => {
        const surah = quranData?.find((s: any) => s.number === num)
        return surah ? `${surah.name} (${surah.englishName})` : `সূরা ${num}`
    }

    return (
        <div className="space-y-4">
            {bookmarks.map((b: any) => (
                <div key={b.id} className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-5 group relative">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-[#f0c040] font-bold text-sm">{getSurahName(b.surah_number)} — আয়াত {b.ayah_number}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                to={`/quran/${b.surah_number}#ayah-${b.ayah_number}`}
                                className="px-3 py-1 bg-[#1a3a8f] text-white text-xs rounded-lg hover:bg-[#2952cc] transition-all"
                            >
                                দেখুন →
                            </Link>
                            <button
                                onClick={() => removeBookmark.mutate(b.id)}
                                className="w-7 h-7 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center text-xs transition-all"
                            >✕</button>
                        </div>
                    </div>
                    <p className="font-arabic text-xl text-white text-right leading-relaxed" dir="rtl">{b.ayah_arabic}</p>
                </div>
            ))}
        </div>
    )
}

/* ===== Tab: Favourite Writers ===== */
const FavWritersTab: React.FC<{ userId: string }> = ({ userId }) => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    const { data: writers, isLoading } = useQuery({
        queryKey: ['fav-writers', userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('favourite_writers')
                .select('id, writer_id, authors:writer_id(*)')
                .eq('user_id', userId)
            return data || []
        },
    })

    const removeFav = useMutation({
        mutationFn: async (favId: string) => {
            await supabase.from('favourite_writers').delete().eq('id', favId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fav-writers', userId] })
            showToast('লেখক পছন্দ তালিকা থেকে সরানো হয়েছে')
        },
    })

    if (isLoading) return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-xl" />)}</div>

    if (!writers?.length) return <p className="text-[#8899bb] text-center py-12">আপনার পছন্দের লেখক তালিকা খালি</p>

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {writers.map((item: any) => (
                <div key={item.id} className="bg-[#111a33] rounded-xl border border-blue-800/40 p-5 text-center relative group">
                    <Link to={`/writers/${item.writer_id}`}>
                        <div className="w-16 h-16 rounded-full bg-[#1a3a8f] flex items-center justify-center text-2xl text-white mx-auto mb-3 overflow-hidden">
                            {item.authors?.avatar ? (
                                <img src={item.authors.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (item.authors?.name?.charAt(0) || '✍')}
                        </div>
                        <p className="text-white font-semibold text-sm">{item.authors?.name}</p>
                    </Link>
                    <button
                        onClick={() => removeFav.mutate(item.id)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >✕</button>
                </div>
            ))}
        </div>
    )
}

/* ===== Tab: Profile ===== */
const ProfileTab: React.FC<{ userId: string; userEmail: string }> = ({ userId, userEmail }) => {
    const { showToast } = useToast()
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)

    useQuery({
        queryKey: ['profile', userId],
        queryFn: async () => {
            const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
            if (data) setName(data.full_name || '')
            return data
        },
    })

    const handleSave = async () => {
        setSaving(true)
        try {
            // 1. Update Database
            const { error: dbError } = await supabase.from('profiles').update({ full_name: name }).eq('id', userId)
            if (dbError) throw dbError

            // 2. Update Auth Metadata (so navbar reflects change immediately)
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: name }
            })
            if (authError) throw authError

            showToast('প্রোফাইল আপডেট হয়েছে!')
        } catch (err: any) {
            showToast(err.message || 'আপডেট ব্যর্থ', 'error')
        }
        setSaving(false)
    }

    return (
        <div className="max-w-md space-y-5">
            <div>
                <label className="text-[#8899bb] text-sm block mb-1.5">নাম</label>
                <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#111a33] border border-blue-800/40 text-white focus:border-[#f0c040] focus:outline-none transition-all"
                />
            </div>
            <div>
                <label className="text-[#8899bb] text-sm block mb-1.5">ইমেইল</label>
                <input value={userEmail} disabled className="w-full px-4 py-3 rounded-xl bg-[#111a33] border border-blue-800/20 text-[#556688] cursor-not-allowed" />
            </div>
            <button
                onClick={handleSave} disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-[#1a3a8f] to-[#2952cc] text-white rounded-xl font-semibold disabled:opacity-50 transition-all"
            >
                {saving ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল আপডেট করুন'}
            </button>
        </div>
    )
}

/* ===== Tab: Notification Preferences ===== */
const NotifPrefTab: React.FC<{ userId: string }> = ({ userId }) => {
    const { showToast } = useToast()
    const queryClient = useQueryClient()

    const { data: pref } = useQuery({
        queryKey: ['notif-pref', userId],
        queryFn: async () => {
            const { data } = await supabase.from('notification_preferences').select('*').eq('user_id', userId).single()
            return data
        },
    })

    const toggleNotif = useMutation({
        mutationFn: async () => {
            const newVal = !(pref?.new_book_notify ?? false)
            if (pref) {
                await supabase.from('notification_preferences').update({ new_book_notify: newVal }).eq('user_id', userId)
            } else {
                await supabase.from('notification_preferences').insert({ user_id: userId, new_book_notify: newVal })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notif-pref', userId] })
            showToast('নোটিফিকেশন সেটিং আপডেট হয়েছে')
        },
    })

    return (
        <div className="max-w-md space-y-6">
            <div className="flex items-center justify-between bg-[#111a33] rounded-xl border border-blue-800/40 p-4">
                <div>
                    <p className="text-white font-semibold text-sm">নতুন বই আসলে নোটিফিকেশন পাই</p>
                    <p className="text-[#8899bb] text-xs mt-1">নতুন বই যোগ হলে আপনাকে জানানো হবে</p>
                </div>
                <button
                    onClick={() => toggleNotif.mutate()}
                    className={`w-12 h-6 rounded-full relative transition-colors ${pref?.new_book_notify ? 'bg-[#f0c040]' : 'bg-[#2a3555]'}`}
                >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${pref?.new_book_notify ? 'left-6' : 'left-0.5'}`} />
                </button>
            </div>

            <div className="border-t border-blue-800/20 pt-6">
                <h3 className="text-white font-semibold mb-3">📬 বই সাজেস্ট করুন</h3>
                <p className="text-[#8899bb] text-sm mb-4">আপনি যে বইটি চান সেটি আমাদের জানান</p>
                <a
                    href="mailto:kitabsalafibd@gmail.com?subject=বই সাজেস্ট&body=বইয়ের নাম:%0Aলেখক:%0Aপ্রকাশনী:%0Aলিংক:%0A"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#c9a84c] to-[#f0c040] text-[#0a0f1e] font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-900/20">
                        ✉️ বই সাজেস্ট করুন
                    </button>
                </a>
            </div>
        </div>
    )
}

/* ===== Main Dashboard ===== */
const DashboardPage: React.FC = () => {
    const { user, signOut } = useAuth()
    const [activeTab, setActiveTab] = useState('wishlist')

    if (!user) return null

    return (
        <>
            <Helmet><title>ড্যাশবোর্ড — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-[#0d1428] to-[#111a33] rounded-2xl border border-blue-800/40 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a3a8f] to-[#3d6bff] flex items-center justify-center text-3xl text-white font-bold shadow-lg shadow-blue-900/30">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-xl font-bold text-white">{user.user_metadata?.full_name || 'ব্যবহারকারী'}</h1>
                        <p className="text-[#8899bb] text-sm">{user.email}</p>
                    </div>
                    <button onClick={signOut} className="px-5 py-2 border border-red-500/50 text-red-400 rounded-xl text-sm hover:bg-red-500 hover:text-white transition-all">
                        🚪 লগআউট
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.key
                                ? 'bg-[#1a3a8f] text-white shadow-lg shadow-blue-900/30'
                                : 'bg-[#111a33] text-[#8899bb] hover:text-white border border-blue-800/30'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'wishlist' && <WishlistTab userId={user.id} />}
                {activeTab === 'reading_list' && <ReadingListTab userId={user.id} />}
                {activeTab === 'quran_bookmarks' && <QuranBookmarksTab userId={user.id} />}
                {activeTab === 'writers' && <FavWritersTab userId={user.id} />}
                {activeTab === 'profile' && <ProfileTab userId={user.id} userEmail={user.email || ''} />}
                {activeTab === 'settings' && <NotifPrefTab userId={user.id} />}
            </div>
        </>
    )
}

export default DashboardPage
