import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import BookCard from '../components/BookCard'

const PublicProfilePage: React.FC = () => {
    const { id: userId } = useParams<{ id: string }>()

    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['public-profile', userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
            return data
        },
        enabled: !!userId
    })

    const { data: readingList, isLoading: readingLoading } = useQuery({
        queryKey: ['public-reading-list', userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('reading_progress')
                .select('*, books:book_id(*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*))')
                .eq('user_id', userId)
                .eq('status', 'reading')
                .limit(10)
            return data || []
        },
        enabled: !!userId
    })

    const { data: finishedList } = useQuery({
        queryKey: ['public-finished-list', userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('reading_progress')
                .select('*, books:book_id(*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*))')
                .eq('user_id', userId)
                .eq('status', 'finished')
                .limit(10)
            return data || []
        },
        enabled: !!userId
    })

    if (profileLoading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#8899bb]">লোড হচ্ছে...</div>

    if (!profile) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-400">ব্যবহারকারীকে পাওয়া যায়নি।</div>

    return (
        <>
            <Helmet><title>{profile.full_name} এর প্রোফাইল — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="bg-[#0d1428] rounded-3xl border border-blue-800/40 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 gold-glow">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1a3a8f] to-[#3d6bff] flex items-center justify-center text-5xl text-white font-bold shadow-2xl overflow-hidden border-4 border-[#f0c040]/20">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            profile.full_name?.charAt(0) || '👤'
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{profile.full_name}</h1>
                        {profile.bio ? (
                            <p className="text-[#8899bb] text-lg max-w-2xl italic leading-relaxed">
                                "{profile.bio}"
                            </p>
                        ) : (
                            <p className="text-[#556688] italic">সালাফিয়্যাহ লাইব্রেরি বিডি-র একনিষ্ঠ পাঠক।</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Currently Reading */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>📗</span> বর্তমানে পড়ছেন
                        </h2>
                        {readingLoading ? (
                            <div className="grid grid-cols-2 gap-4">
                                {Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton h-60 rounded-xl" />)}
                            </div>
                        ) : readingList?.length ? (
                            <div className="grid grid-cols-2 gap-4">
                                {readingList.map((item: any) => (
                                    <BookCard key={item.id} book={item.books} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#556688] py-8">বর্তমানে কোনো বই পড়ছেন না।</p>
                        )}
                    </section>

                    {/* Finished Reading */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>✅ পড়া শেষ হয়েছে</span>
                        </h2>
                        {finishedList?.length ? (
                            <div className="grid grid-cols-2 gap-4">
                                {finishedList.map((item: any) => (
                                    <BookCard key={item.id} book={item.books} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#556688] py-8">এখনো কোনো বই পড়া শেষ করেননি।</p>
                        )}
                    </section>
                </div>
            </div>
        </>
    )
}

export default PublicProfilePage
