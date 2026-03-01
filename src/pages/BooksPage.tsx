import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import BookCard from '../components/BookCard'
import { BookCardSkeleton } from '../components/Skeleton'
import { useCompare } from '../hooks/useCompare'

const BooksPage: React.FC = () => {
    const [searchParams] = useSearchParams()
    const activeCatSlug = searchParams.get('category')
    const [page, setPage] = useState(0)
    const perPage = 20
    const { compareIds, toggleCompare } = useCompare()

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await supabase.from('categories').select('*').order('name')
            return data || []
        },
        staleTime: 30 * 60 * 1000,
    })

    const { data: bookData, isLoading } = useQuery({
        queryKey: ['books', activeCatSlug, page],
        queryFn: async () => {
            let query = supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)', { count: 'exact' })

            if (activeCatSlug) {
                const cat = categories?.find((c: any) => c.slug === activeCatSlug)
                if (cat) query = query.eq('category_id', cat.id)
            }

            const { data, count } = await query
                .range(page * perPage, (page + 1) * perPage - 1)
                .order('created_at', { ascending: false })

            return { books: data || [], total: count || 0 }
        },
        enabled: !!categories, // Wait for categories to be ready if filtering
    })

    const totalPages = Math.ceil((bookData?.total || 0) / perPage)
    const activeCat = categories?.find((c: any) => c.slug === activeCatSlug)

    return (
        <>
            <Helmet>
                <title>{activeCat ? `${activeCat.name} — ` : ''}বইসমূহ — Salafiyyah Library BD</title>
                <meta name="description" content="সালাফিয়্যাহ লাইব্রেরি বিডির সকল বইয়ের তালিকা।" />
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">
                    📚 {activeCat ? activeCat.name : 'সকল বই'}
                </h1>

                {/* Category filters */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-2">
                    <a
                        href="/books"
                        className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${!activeCatSlug ? 'bg-[#1a3a8f] text-white' : 'bg-[#0d1428] text-[#8899bb] border border-blue-800/40 hover:text-white'
                            }`}
                    >
                        সব
                    </a>
                    {categories?.map((cat: any) => (
                        <a
                            key={cat.id}
                            href={`/books?category=${cat.slug}`}
                            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${activeCatSlug === cat.slug ? 'bg-[#1a3a8f] text-white' : 'bg-[#0d1428] text-[#8899bb] border border-blue-800/40 hover:text-white'
                                }`}
                        >
                            {cat.name}
                        </a>
                    ))}
                </div>

                {/* Book grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {isLoading
                        ? Array.from({ length: 15 }).map((_, i) => <BookCardSkeleton key={i} />)
                        : bookData?.books.map((book: any) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onCompareToggle={toggleCompare}
                                isCompareSelected={compareIds.includes(book.id)}
                            />
                        ))
                    }
                </div>

                {bookData?.books.length === 0 && !isLoading && (
                    <p className="text-center text-[#8899bb] py-12">কোনো বই পাওয়া যায়নি</p>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                            className="px-4 py-2 bg-[#1a3a8f] text-white rounded-lg disabled:opacity-40 hover:bg-[#2952cc] transition-colors"
                        >
                            পূর্ববর্তী
                        </button>
                        <span className="text-[#8899bb] text-sm px-4">পৃষ্ঠা {page + 1} / {totalPages}</span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                            className="px-4 py-2 bg-[#1a3a8f] text-white rounded-lg disabled:opacity-40 hover:bg-[#2952cc] transition-colors"
                        >
                            পরবর্তী
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default BooksPage
