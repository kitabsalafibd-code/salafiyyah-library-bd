import React, { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import ReadingProgressButton from './ReadingProgressButton'
import ShareButton from './ShareButton'
import { getFullSizeImage } from '../lib/utils'
import PlaceholderBook from './PlaceholderBook'

interface Book {
    id: string
    title: string
    cover_image_url?: string
    price?: number
    writers?: { id: string; name: string } | null
    publishers?: { id: string; name: string } | null
    categories?: { id: string; name: string; slug: string } | null
}

interface BookCardProps {
    book: Book
    onCompareToggle?: (bookId: string, book: Book) => void
    isCompareSelected?: boolean
}

const BookCard: React.FC<BookCardProps> = ({ book, onCompareToggle, isCompareSelected }) => {
    const { user } = useAuth()
    const [wishlisted, setWishlisted] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)

    const toggleWishlist = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!user) return

        if (wishlisted) {
            await supabase.from('wishlists').delete().eq('user_id', user.id).eq('book_id', book.id)
            setWishlisted(false)
        } else {
            await supabase.from('wishlists').insert({ user_id: user.id, book_id: book.id })
            setWishlisted(true)
        }
    }, [user, wishlisted, book.id])

    const handleCompare = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onCompareToggle?.(book.id, book)
    }, [book, onCompareToggle])

    const authorName = useMemo(() => book.writers?.name || 'অজানা লেখক', [book.writers])
    const publisherName = useMemo(() => book.publishers?.name || '', [book.publishers])

    return (
        <Link
            to={`/books/${book.id}`}
            className="group block bg-[#0d1428] rounded-xl border border-blue-800/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 gold-glow card"
        >
            {/* Cover Image */}
            <div className="relative aspect-[3/4] bg-[#111a33] overflow-hidden">
                {!imageLoaded && !imgError && (
                    <div className="absolute inset-0 skeleton" />
                )}
                {book.cover_image_url && !imgError ? (
                    <img
                        src={getFullSizeImage(book.cover_image_url)}
                        alt={book.title}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImgError(true)}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                ) : (
                    <PlaceholderBook />
                )}

                {/* Category badge */}
                {book.categories && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] bg-[#1a3a8f] text-white rounded-full">
                        {book.categories.name}
                    </span>
                )}

                {/* Compare icon */}
                {onCompareToggle && (
                    <button
                        onClick={handleCompare}
                        className={`absolute top-2 left-2 mt-6 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors ${isCompareSelected ? 'bg-[#f0c040] text-[#0a0f1e]' : 'bg-black/50 text-white hover:bg-[#f0c040] hover:text-[#0a0f1e]'
                            }`}
                        title="তুলনা করুন"
                    >
                        ⚖️
                    </button>
                )}

                {/* Wishlist icon */}
                {user && (
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                        <button
                            onClick={toggleWishlist}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${wishlisted ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'
                                }`}
                            title="উইশলিস্ট"
                        >
                            {wishlisted ? '❤️' : '🤍'}
                        </button>
                        <ShareButton title={book.title} author={authorName} />
                    </div>
                )}
                {!user && (
                    <div className="absolute top-2 right-2">
                        <ShareButton title={book.title} author={authorName} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-1.5 flex-1 flex flex-col card-content">
                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#f0c040] transition-colors card-title">
                    {book.title}
                </h3>
                <p className="text-[#c9a84c] text-xs author-name">{authorName}</p>
                {publisherName && <p className="text-[#8899bb] text-xs pb-1 publisher-name">{publisherName}</p>}

                <div className="mt-auto pt-2">
                    <ReadingProgressButton bookId={book.id} />
                </div>

                <div className="flex items-center justify-between pt-2">
                    {book.price ? (
                        <span className="text-[#f0c040] font-bold text-sm price-tag">৳ {book.price}</span>
                    ) : (
                        <span className="text-[#8899bb] text-xs">মূল্য নেই</span>
                    )}
                    <span className="text-xs px-3 py-1 rounded-lg border border-[#2952cc] text-[#3d6bff] group-hover:bg-[#2952cc] group-hover:text-white transition-all details-button">
                        বিস্তারিত দেখুন
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default React.memo(BookCard)
