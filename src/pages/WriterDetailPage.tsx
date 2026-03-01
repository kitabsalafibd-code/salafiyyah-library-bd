import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import BookCard from '../components/BookCard'
import { BookCardSkeleton } from '../components/Skeleton'
import { useCompare } from '../hooks/useCompare'

const WriterDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuth()
    const [isFav, setIsFav] = useState(false)
    const { compareIds, toggleCompare } = useCompare()

    const { data: writer } = useQuery({
        queryKey: ['writer', id],
        queryFn: async () => {
            const { data } = await supabase.from('authors').select('*').eq('id', id).single()
            return data
        },
        enabled: !!id,
    })

    const { data: books, isLoading } = useQuery({
        queryKey: ['writer-books', id],
        queryFn: async () => {
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .eq('author_id', id)
            return data || []
        },
        enabled: !!id,
    })

    // Check favourite status
    React.useEffect(() => {
        if (user && id) {
            supabase.from('favourite_writers').select('id').eq('user_id', user.id).eq('author_id', id).single()
                .then(({ data }) => setIsFav(!!data))
        }
    }, [user, id])

    const toggleFav = useCallback(async () => {
        if (!user || !id) return
        if (isFav) {
            await supabase.from('favourite_writers').delete().eq('user_id', user.id).eq('author_id', id)
        } else {
            await supabase.from('favourite_writers').insert({ user_id: user.id, author_id: id })
        }
        setIsFav(!isFav)
    }, [user, id, isFav])

    if (!writer) return <div className="min-h-[60vh] flex items-center justify-center"><div className="skeleton h-12 w-48" /></div>

    return (
        <>
            <Helmet><title>{writer.name} — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8 container page-content" style={{ overflowX: 'hidden' }}>
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 writer-header">
                    <div className="w-32 h-32 rounded-full min-w-[128px] min-h-[128px] bg-[#1a3a8f] flex items-center justify-center text-5xl text-white border-4 border-blue-800/40 overflow-hidden writer-avatar">
                        {writer.avatar ? <img src={writer.avatar} alt={writer.name} className="w-full h-full object-cover" /> : writer.name?.charAt(0)}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-white mb-2 section-title">{writer.name}</h1>
                        {writer.bio && <p className="text-[#8899bb] max-w-xl writer-bio">{writer.bio}</p>}
                        {user && (
                            <button onClick={toggleFav} className={`mt-3 px-4 py-2 rounded-lg text-sm transition-colors ${isFav ? 'bg-[#f0c040] text-[#0a0f1e]' : 'border border-[#f0c040] text-[#f0c040] hover:bg-[#f0c040] hover:text-[#0a0f1e]'}`}>
                                {isFav ? '⭐ প্রিয় লেখক' : '☆ প্রিয় লেখক হিসেবে যোগ করুন'}
                            </button>
                        )}
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-4 section-title">📚 এই লেখকের বই ({books?.length || 0})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 books-grid">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />)
                        : books?.map((b: any) => (
                            <BookCard
                                key={b.id}
                                book={b}
                                onCompareToggle={toggleCompare}
                                isCompareSelected={compareIds.includes(b.id)}
                            />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default WriterDetailPage
