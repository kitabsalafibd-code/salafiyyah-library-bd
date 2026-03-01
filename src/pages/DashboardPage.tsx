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
    { key: 'goals', label: '🎯 লক্ষ্য' },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 books-grid">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 books-grid">
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

/* ===== Tab: Reading Goals ===== */
const ReadingGoalsTab: React.FC<{ userId: string }> = ({ userId }) => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()
    const currentYear = new Date().getFullYear()

    const { data: goal, isLoading: goalLoading } = useQuery({
        queryKey: ['reading-goal', userId, currentYear],
        queryFn: async () => {
            const { data } = await supabase
                .from('reading_goals')
                .select('*')
                .eq('user_id', userId)
                .eq('year', currentYear)
                .maybeSingle()
            return data
        }
    })

    const { data: finishedCount = 0 } = useQuery({
        queryKey: ['finished-count', userId, currentYear],
        queryFn: async () => {
            const { count } = await supabase
                .from('reading_progress')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('status', 'finished')
            // Ideally filter by finish date, but we'll use total finished for now
            return count || 0
        }
    })

    const [target, setTarget] = useState('')
    const [saving, setSaving] = useState(false)

    const handleSetGoal = async () => {
        if (!target) return
        setSaving(true)
        const t = parseInt(target)
        try {
            if (goal) {
                await supabase.from('reading_goals').update({ target_books: t }).eq('id', goal.id)
            } else {
                await supabase.from('reading_goals').insert({ user_id: userId, year: currentYear, target_books: t })
            }
            queryClient.invalidateQueries({ queryKey: ['reading-goal', userId] })
            showToast('পড়ার লক্ষ্য সেট করা হয়েছে!')
        } catch (err: any) {
            showToast('লক্ষ্য সেট করতে সমস্যা হয়েছে', 'error')
        }
        setSaving(false)
    }

    if (goalLoading) return <div className="skeleton h-48 rounded-2xl" />

    const progress = goal ? Math.min(100, Math.round((finishedCount / goal.target_books) * 100)) : 0

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 p-8 text-center gold-glow">
                <h3 className="text-xl font-bold text-white mb-6">🎯 {currentYear} এর পড়ার লক্ষ্য</h3>

                {goal ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-bold text-[#f0c040]">{finishedCount} / {goal.target_books}</span>
                            <span className="text-[#8899bb] text-sm">বই শেষ করেছেন</span>
                        </div>
                        <div className="h-4 bg-[#111a33] rounded-full overflow-hidden border border-blue-800/20">
                            <div
                                className="h-full bg-gradient-to-r from-[#c9a84c] to-[#f0c040] transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[#8899bb] text-sm italic">
                            {progress >= 100 ? 'অভিনন্দন! আপনি আপনার লক্ষ্য পূরণ করেছেন! 🎉' : `আপনি আপনার লক্ষ্যের ${progress}% পৌঁছেছেন।`}
                        </p>

                        <div className="pt-6 border-t border-blue-800/20">
                            <button
                                onClick={() => { setTarget(goal.target_books.toString()); /* Switch to edit mode? No, just simplify. */ }}
                                className="text-[#8899bb] hover:text-white text-xs underline"
                            >
                                লক্ষ্য পরিবর্তন করুন
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-[#8899bb]">আপনি কি এই বছর কতগুলো বই পড়ার লক্ষ্য নিয়েছেন?</p>
                        <div className="flex gap-3 max-w-xs mx-auto">
                            <input
                                type="number"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                placeholder="বই সংখ্যা"
                                className="w-full px-4 py-2 bg-[#111a33] border border-blue-800/40 rounded-xl text-white text-center focus:border-[#f0c040] outline-none"
                            />
                            <button
                                onClick={handleSetGoal}
                                disabled={saving}
                                className="px-6 py-2 bg-[#f0c040] text-[#0a0f1e] rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50"
                            >
                                সেট করুন
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-[#111a33]/50 rounded-xl p-6 border border-blue-800/20">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span>💡</span> টিপস
                </h4>
                <p className="text-[#8899bb] text-sm leading-relaxed">
                    পড়ার অভ্যাস গড়ে তুলতে প্রতিদিন অন্তত ১৫-২০ মিনিট সময় দিন। আপনার পড়া শেষ হওয়ামাত্রই পড়ার তালিকায় 'পড়া শেষ' হিসেবে মার্ক করুন, তাহলে এখানে প্রগ্রেস দেখতে পাবেন।
                </p>
            </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 writers-grid">
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
    const queryClient = useQueryClient()
    const [isEditingName, setIsEditingName] = useState(false)
    const [editNameValue, setEditNameValue] = useState('')

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile', userId],
        queryFn: async () => {
            const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
            return data
        },
    })

    const { data: stats } = useQuery({
        queryKey: ['profile-stats', userId],
        queryFn: async () => {
            const [
                { count: wishlistCount },
                { count: writersCount },
                { count: reviewsCount },
                { count: finishedCount }
            ] = await Promise.all([
                supabase.from('wishlists').select('*', { count: 'exact', head: true }).eq('user_id', userId),
                supabase.from('favourite_writers').select('*', { count: 'exact', head: true }).eq('user_id', userId),
                supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('user_id', userId).then(res => res.error ? { count: 0 } : res),
                supabase.from('reading_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'finished')
            ])
            return {
                wishlist: wishlistCount || 0,
                writers: writersCount || 0,
                reviews: reviewsCount || 0,
                finished: finishedCount || 0
            }
        }
    })

    const saveName = useMutation({
        mutationFn: async (newName: string) => {
            const { error: dbError } = await supabase.from('profiles').update({ full_name: newName }).eq('id', userId)
            if (dbError) throw dbError
            const { error: authError } = await supabase.auth.updateUser({ data: { full_name: newName } })
            if (authError) throw authError
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', userId] })
            setIsEditingName(false)
            showToast('নাম আপডেট হয়েছে ✅')
        },
        onError: () => {
            showToast('নাম আপডেট করতে সমস্যা হয়েছে', 'error')
        }
    })

    if (isLoading) return <div className="skeleton h-64 rounded-2xl" />

    const memberSince = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'অজানা'
    const isAdmin = profile?.role === 'admin'
    const fullName = profile?.full_name || userEmail.split('@')[0]
    const initial = fullName.charAt(0).toUpperCase()
    const { signOut } = useAuth()

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-[#0d1428] rounded-2xl border border-[#c9a84c] p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden gold-glow profile-card">

                {/* Avatar */}
                <div className="w-32 h-32 shrink-0 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#f0c040] flex items-center justify-center text-6xl text-[#0a0f1e] font-bold shadow-lg shadow-yellow-900/30">
                    {initial}
                </div>

                <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    value={editNameValue}
                                    onChange={e => setEditNameValue(e.target.value)}
                                    className="px-3 py-1.5 rounded-lg bg-[#111a33] border border-[#f0c040] text-white focus:outline-none"
                                    autoFocus
                                />
                                <button onClick={() => saveName.mutate(editNameValue)} disabled={saveName.isPending} className="px-3 py-1.5 bg-[#1a3a8f] text-white rounded-lg hover:bg-[#2952cc] text-sm">
                                    {saveName.isPending ? '...' : 'সেভ'}
                                </button>
                                <button onClick={() => setIsEditingName(false)} className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20">
                                    বাতিল
                                </button>
                            </div>
                        ) : (
                            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                                {fullName}
                                <button
                                    onClick={() => { setEditNameValue(fullName); setIsEditingName(true) }}
                                    className="text-sm p-1.5 hover:bg-[#111a33] rounded-full text-[#8899bb] hover:text-[#f0c040] transition-colors"
                                    title="নাম পরিবর্তন করুন"
                                >
                                    ✏️
                                </button>
                            </h2>
                        )}
                        {isAdmin && <span className="px-3 py-1 bg-gradient-to-r from-[#c9a84c] to-[#f0c040] text-[#0a0f1e] text-xs font-bold rounded-full">অ্যাডমিন</span>}
                    </div>

                    <p className="text-[#8899bb] flex items-center justify-center sm:justify-start gap-2">
                        <span>📧</span> <span className="opacity-70">{userEmail}</span>
                    </p>

                    <p className="text-[#8899bb] text-sm flex items-center justify-center sm:justify-start gap-2">
                        <span>🗓️</span> <span>সদস্য হয়েছেন: {memberSince}</span>
                    </p>
                </div>
            </div>

            <div className="bg-[#111a33] rounded-2xl border border-blue-800/30 p-8">
                <h3 className="text-xl font-bold text-white mb-6">📊 আপনার পরিসংখ্যান</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stats-grid">
                    <div className="bg-[#0d1428] rounded-xl p-4 text-center border border-blue-800/20 hover:border-[#c9a84c]/50 transition-colors stat-card">
                        <div className="text-3xl mb-2">📚</div>
                        <div className="text-2xl font-bold text-white">{stats?.wishlist || 0}</div>
                        <div className="text-[#8899bb] text-sm mt-1">উইশলিস্টে বই</div>
                    </div>
                    <div className="bg-[#0d1428] rounded-xl p-4 text-center border border-blue-800/20 hover:border-[#c9a84c]/50 transition-colors stat-card">
                        <div className="text-3xl mb-2">✍️</div>
                        <div className="text-2xl font-bold text-white">{stats?.writers || 0}</div>
                        <div className="text-[#8899bb] text-sm mt-1">পছন্দের লেখক</div>
                    </div>
                    <div className="bg-[#0d1428] rounded-xl p-4 text-center border border-blue-800/20 hover:border-[#c9a84c]/50 transition-colors stat-card">
                        <div className="text-3xl mb-2">⭐</div>
                        <div className="text-2xl font-bold text-white">{stats?.reviews || 0}</div>
                        <div className="text-[#8899bb] text-sm mt-1">রিভিউ দিয়েছেন</div>
                    </div>
                    <div className="bg-[#0d1428] rounded-xl p-4 text-center border border-blue-800/20 hover:border-[#c9a84c]/50 transition-colors">
                        <div className="text-3xl mb-2">📖</div>
                        <div className="text-2xl font-bold text-[#f0c040]">{stats?.finished || 0}</div>
                        <div className="text-[#8899bb] text-sm mt-1">পড়া শেষ করেছেন</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <div className="flex-1 p-4 bg-blue-900/10 border border-blue-800/20 rounded-xl text-center sm:text-left">
                    <Link to={`/u/${userId}`} className="text-[#f0c040] text-sm font-bold inline-flex items-center gap-2 hover:underline">
                        আপনার পাবলিক প্রোফাইল দেখুন <span>→</span>
                    </Link>
                </div>
                <button
                    onClick={signOut}
                    className="px-6 py-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                    🚪 লগআউট করুন
                </button>
            </div>
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
            <div className="max-w-7xl mx-auto px-4 py-8 container page-content" style={{ overflowX: 'hidden' }}>
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2 dashboard-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all tab-btn ${activeTab === tab.key
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
                {activeTab === 'goals' && <ReadingGoalsTab userId={user.id} />}
                {activeTab === 'quran_bookmarks' && <QuranBookmarksTab userId={user.id} />}
                {activeTab === 'writers' && <FavWritersTab userId={user.id} />}
                {activeTab === 'profile' && <ProfileTab userId={user.id} userEmail={user.email || ''} />}
                {activeTab === 'settings' && <NotifPrefTab userId={user.id} />}

                {/* Simple Logout button for other tabs */}
                {activeTab !== 'profile' && (
                    <div className="mt-12 pt-8 border-t border-blue-800/20 text-center">
                        <button onClick={signOut} className="text-red-400 text-sm hover:underline">
                            🚪 লগআউট করুন
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default DashboardPage
