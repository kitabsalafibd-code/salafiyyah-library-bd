import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { hadithBooks } from './HadithPage'

const HADITH_API_KEY = '$2y$10$9X4P33bfUxhxtprbvYtTue4oQ1nNORCtHuaDwbAfywmWPcqzYay'

const HadithChaptersPage: React.FC = () => {
    const { bookSlug } = useParams<{ bookSlug: string }>()
    const book = hadithBooks.find(b => b.slug === bookSlug)

    const { data: chapters, isLoading } = useQuery({
        queryKey: ['hadith-chapters', bookSlug],
        queryFn: async () => {
            const res = await fetch(`https://hadithapi.com/api/${bookSlug}/chapters?apiKey=${HADITH_API_KEY}`)
            const json = await res.json()
            return json.chapters || []
        },
        staleTime: 24 * 60 * 60 * 1000,
        enabled: !!bookSlug,
    })

    return (
        <>
            <Helmet><title>{book?.name || 'অধ্যায়'} — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/hadith" className="text-[#3d6bff] text-sm hover:underline mb-4 block">← সকল হাদীস গ্রন্থ</Link>
                <h1 className="text-2xl font-bold text-white mb-6">{book?.name || 'অধ্যায়সমূহ'}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {isLoading
                        ? Array.from({ length: 9 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)
                        : chapters?.map((ch: any) => (
                            <Link
                                key={ch.chapterNumber}
                                to={`/hadith/${bookSlug}/${ch.chapterNumber}`}
                                className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-4 flex items-center gap-4 hover:border-[#c9a84c]/50 transition-all group"
                            >
                                <span className="w-10 h-10 rounded-full bg-[#1a3a8f] flex items-center justify-center text-white text-sm font-bold shrink-0 group-hover:bg-[#2952cc] transition-colors">
                                    {ch.chapterNumber}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{ch.chapterBengali || ch.chapterEnglish || `অধ্যায় ${ch.chapterNumber}`}</p>
                                    {ch.chapterArabic && <p className="text-[#c9a84c] text-xs font-arabic truncate" dir="rtl">{ch.chapterArabic}</p>}
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default HadithChaptersPage
