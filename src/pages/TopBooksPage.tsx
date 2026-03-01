import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import BookCard from '../components/BookCard'
import { BookCardSkeleton } from '../components/Skeleton'
import { useCompare } from '../hooks/useCompare'

const TopBooksPage: React.FC = () => {
    const { compareIds, toggleCompare } = useCompare()
    const { data: books, isLoading } = useQuery({
        queryKey: ['top-wishlisted-enhanced'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('get_top_wishlisted_books', { limit_count: 10 })

            if (error || !data || data.length === 0) {
                const { data: fallbackData } = await supabase
                    .from('books')
                    .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                    .limit(10)
                return fallbackData || []
            }

            return data
        },
    })

    return (
        <>
            <Helmet>
                <title>শীর্ষ বই — Salafiyyah Library BD</title>
                <meta name="description" content="সালাফিয়্যাহ লাইব্রেরি বিডির সর্বাধিক জনপ্রিয় এবং পছন্দকৃত বইসমূহ।" />
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8 container page-content" style={{ overflowX: 'hidden' }}>
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🏆</span>
                    <h1 className="text-2xl font-bold text-white section-title">শীর্ষ সর্বাধিক উইশলিস্টকৃত বই</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 books-grid">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
                        : books?.map((book: any, i: number) => (
                            <div key={book.id} className="relative">
                                <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#f0c040] text-[#0a0f1e] flex items-center justify-center font-bold text-lg shadow-lg z-10 border-2 border-[#0d1428]">
                                    {i + 1}
                                </span>
                                <BookCard
                                    book={book}
                                    onCompareToggle={toggleCompare}
                                    isCompareSelected={compareIds.includes(book.id)}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default TopBooksPage
