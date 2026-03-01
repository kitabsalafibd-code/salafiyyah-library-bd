import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import BookCard from '../components/BookCard'
import { BookCardSkeleton } from '../components/Skeleton'

const PublisherDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    const { data: publisher } = useQuery({
        queryKey: ['publisher', id],
        queryFn: async () => {
            const { data } = await supabase.from('publishers').select('*').eq('id', id).single()
            return data
        },
        enabled: !!id,
    })

    const { data: books, isLoading } = useQuery({
        queryKey: ['publisher-books', id],
        queryFn: async () => {
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .eq('publisher_id', id)
            return data || []
        },
        enabled: !!id,
    })

    if (!publisher) return <div className="min-h-[60vh] flex items-center justify-center"><div className="skeleton h-12 w-48" /></div>

    return (
        <>
            <Helmet><title>{publisher.name} — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-xl bg-[#1a3a8f]/30 flex items-center justify-center text-4xl overflow-hidden">
                        {publisher.logo ? <img src={publisher.logo} alt={publisher.name} className="w-full h-full object-contain" /> : '🏢'}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-white mb-2">{publisher.name}</h1>
                        {publisher.description && <p className="text-[#8899bb] max-w-xl">{publisher.description}</p>}
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-4">📚 এই প্রকাশনীর বই ({books?.length || 0})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {isLoading ? Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />) : books?.map((b: any) => <BookCard key={b.id} book={b} />)}
                </div>
            </div>
        </>
    )
}

export default PublisherDetailPage
