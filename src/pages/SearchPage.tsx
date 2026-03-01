import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import BookCard from '../components/BookCard'
import { BookCardSkeleton } from '../components/Skeleton'
import { useCompare } from '../hooks/useCompare'
import { trackEvent } from '../lib/analytics'

const SearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const q = searchParams.get('q') || ''
    const [query, setQuery] = useState(q)
    const [categoryFilter, setCategoryFilter] = useState('')
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Track search
    useEffect(() => {
        if (q.trim()) {
            trackEvent('search', {
                search_term: q
            })
        }
    }, [q])

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await supabase.from('categories').select('*').order('name')
            return data || []
        },
        staleTime: 30 * 60 * 1000,
    })

    const handleQueryChange = useCallback((value: string) => {
        setQuery(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setSearchParams({ q: value })
        }, 400)
    }, [setSearchParams])

    const { data: results, isLoading } = useQuery({
        queryKey: ['search', q, categoryFilter],
        queryFn: async () => {
            if (!q.trim()) return []
            let query = supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .ilike('title', `%${q}%`)

            if (categoryFilter) query = query.eq('category_id', categoryFilter)

            const { data } = await query.limit(50)
            return data || []
        },
        enabled: q.trim().length > 0,
    })

    const { compareIds, toggleCompare } = useCompare()

    return (
        <>
            <Helmet><title>খুঁজুন — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">🔍 অনুসন্ধান</h1>
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text" value={query} onChange={(e) => handleQueryChange(e.target.value)}
                        placeholder="বই, লেখক বা প্রকাশনী খুঁজুন..."
                        className="flex-1 px-4 py-3 rounded-lg bg-[#0d1428] border border-[#c9a84c]/40 text-white placeholder-[#8899bb] focus:border-[#f0c040] focus:outline-none"
                    />
                    <select
                        value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-3 rounded-lg bg-[#0d1428] border border-blue-800/40 text-white focus:border-[#f0c040] focus:outline-none"
                    >
                        <option value="">সকল ক্যাটাগরি</option>
                        {categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {q && <p className="text-[#8899bb] mb-4">"{q}" — {results?.length || 0} ফলাফল</p>}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {isLoading
                        ? Array.from({ length: 10 }).map((_, i) => <BookCardSkeleton key={i} />)
                        : results?.map((book: any) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onCompareToggle={toggleCompare}
                                isCompareSelected={compareIds.includes(book.id)}
                            />
                        ))
                    }
                </div>

                {q && results?.length === 0 && !isLoading && (
                    <p className="text-center text-[#8899bb] py-12">কোনো ফলাফল পাওয়া যায়নি</p>
                )}
            </div>
        </>
    )
}

export default SearchPage
