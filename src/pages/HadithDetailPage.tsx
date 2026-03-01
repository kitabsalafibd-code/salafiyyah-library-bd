import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { hadithBooks } from './HadithPage'

const HADITH_API_KEY = '$2y$10$9X4P33bfUxhxtprbvYtTue4oQ1nNORCtHuaDwbAfywmWPcqzYay'

const statusColors: Record<string, string> = {
    'সহীহ': 'bg-green-500/10 text-green-400 border-green-500/30',
    'Sahih': 'bg-green-500/10 text-green-400 border-green-500/30',
    'হাসান': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'Hasan': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'যঈফ': 'bg-red-500/10 text-red-400 border-red-500/30',
    "Da'if": 'bg-red-500/10 text-red-400 border-red-500/30',
}

const HadithDetailPage: React.FC = () => {
    const { bookSlug, chapterNumber } = useParams<{ bookSlug: string; chapterNumber: string }>()
    const book = hadithBooks.find(b => b.slug === bookSlug)
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['hadiths', bookSlug, chapterNumber, page],
        queryFn: async () => {
            const res = await fetch(`https://hadithapi.com/api/hadiths?apiKey=${HADITH_API_KEY}&book=${bookSlug}&chapter=${chapterNumber}&paginate=20&page=${page}`)
            const json = await res.json()
            return json.hadiths || { data: [], last_page: 1 }
        },
        staleTime: 24 * 60 * 60 * 1000,
        enabled: !!bookSlug && !!chapterNumber,
    })

    const hadiths = data?.data || []
    const lastPage = data?.last_page || 1

    return (
        <>
            <Helmet><title>{book?.name} — অধ্যায় {chapterNumber} — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link to={`/hadith/${bookSlug}`} className="text-[#3d6bff] text-sm hover:underline mb-4 block">← অধ্যায়সমূহ</Link>
                <h1 className="text-2xl font-bold text-white mb-6">{book?.name} — অধ্যায় {chapterNumber}</h1>

                <div className="space-y-4">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-xl" />)
                        : hadiths.map((h: any, i: number) => (
                            <div key={i} className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-5 hover:border-[#c9a84c]/20 transition-colors">
                                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                    <span className="text-xs bg-[#1a3a8f]/30 text-[#f0c040] px-3 py-1 rounded-full font-bold">
                                        হাদীস #{h.hadithNumber || i + 1}
                                    </span>
                                    {h.status && (
                                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${statusColors[h.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                                            {h.status}
                                        </span>
                                    )}
                                </div>
                                {h.hadithArabic && (
                                    <p className="font-arabic text-lg text-white text-right mb-4 leading-loose" dir="rtl">
                                        {h.hadithArabic}
                                    </p>
                                )}
                                <p className="text-[#8899bb] leading-relaxed mb-3">
                                    {h.hadithBengali || 'বাংলা অনুবাদ উপলব্ধ নেই'}
                                </p>
                                {h.englishNarrator && (
                                    <p className="text-[#c9a84c] text-sm italic mb-2">{h.englishNarrator}</p>
                                )}
                                <p className="text-[#556688] text-xs">
                                    {book?.name} • অধ্যায় {chapterNumber}
                                </p>
                            </div>
                        ))
                    }
                </div>

                {/* Pagination */}
                {lastPage > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-2.5 bg-[#1a3a8f] text-white rounded-xl text-sm disabled:opacity-40 hover:bg-[#2952cc] transition-colors">পূর্ববর্তী</button>
                        <span className="text-[#8899bb] text-sm px-4">পৃষ্ঠা {page} / {lastPage}</span>
                        <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page >= lastPage} className="px-5 py-2.5 bg-[#1a3a8f] text-white rounded-xl text-sm disabled:opacity-40 hover:bg-[#2952cc] transition-colors">পরবর্তী</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default HadithDetailPage
