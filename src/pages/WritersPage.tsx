import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import WriterCard from '../components/WriterCard'

const WritersPage: React.FC = () => {
    const { data: writers, isLoading } = useQuery({
        queryKey: ['writers'],
        queryFn: async () => {
            const { data } = await supabase.from('authors').select('*').order('name')
            return data || []
        },
    })

    return (
        <>
            <Helmet>
                <title>লেখকগণ — Salafiyyah Library BD</title>
                <meta name="description" content="সালাফিয়্যাহ লাইব্রেরি বিডির সম্মানিত লেখকগণ ও তাদের জীবনী।" />
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8 container page-content" style={{ overflowX: 'hidden' }}>
                <h1 className="text-2xl font-bold text-white mb-6 section-title">✍️ লেখকগণ</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 writers-grid">
                    {isLoading
                        ? Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                <div className="w-24 h-24 rounded-full bg-[#111a33]" />
                                <div className="h-4 w-20 bg-[#111a33] rounded" />
                            </div>
                        ))
                        : writers?.map((w: any) => (
                            <WriterCard key={w.id} writer={w} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default WritersPage
