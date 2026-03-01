import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import BookCard from '../components/BookCard'
import ReadingProgressButton from '../components/ReadingProgressButton'
import ShareButton from '../components/ShareButton'
import { useCompare } from '../hooks/useCompare'
import { getFullSizeImage } from '../lib/utils'
import PlaceholderBook from '../components/PlaceholderBook'
import { trackEvent } from '../lib/analytics'

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { user, isAdmin } = useAuth()
    const queryClient = useQueryClient()
    const { compareIds, toggleCompare } = useCompare()
    const isCompareSelected = compareIds.includes(id || '')

    const [showPreview, setShowPreview] = useState(false)
    const [reviewText, setReviewText] = useState('')
    const [reviewRating, setReviewRating] = useState(5)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [wishlisted, setWishlisted] = useState(false)

    // Save to recently viewed
    useEffect(() => {
        if (!id) return
        const stored = JSON.parse(localStorage.getItem('recently-viewed') || '[]')
        const updated = [id, ...stored.filter((x: string) => x !== id)].slice(0, 10)
        localStorage.setItem('recently-viewed', JSON.stringify(updated))
    }, [id])

    const { data: book, isLoading } = useQuery({
        queryKey: ['book', id],
        queryFn: async () => {
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .eq('id', id)
                .single()
            return data
        },
        enabled: !!id,
    })

    // Track book view
    useEffect(() => {
        if (book) {
            trackEvent('book_view', {
                book_title: book.title,
                category: book.categories?.name
            })
        }
    }, [book])

    // Check wishlist status
    useEffect(() => {
        if (user && id) {
            supabase.from('wishlists').select('id').eq('user_id', user.id).eq('book_id', id).single()
                .then(({ data }) => setWishlisted(!!data))
        }
    }, [user, id])

    const toggleWishlist = useCallback(async () => {
        if (!user || !id) return
        if (wishlisted) {
            await supabase.from('wishlists').delete().eq('user_id', user.id).eq('book_id', id)
            setWishlisted(false)
        } else {
            await supabase.from('wishlists').insert({ user_id: user.id, book_id: id })
            setWishlisted(true)
            trackEvent('add_to_wishlist', {
                book_title: book?.title
            })
        }
    }, [user, id, wishlisted, book])

    // Reviews
    const { data: reviews } = useQuery({
        queryKey: ['reviews', id],
        queryFn: async () => {
            const { data } = await supabase
                .from('reviews')
                .select('*, profiles:user_id(full_name, avatar_url)')
                .eq('book_id', id)
                .order('created_at', { ascending: false })
            return data || []
        },
        enabled: !!id,
    })

    const avgRating = reviews?.length
        ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : null

    const userReview = reviews?.find((r: any) => r.user_id === user?.id)

    const submitReview = useMutation({
        mutationFn: async () => {
            if (userReview) {
                await supabase.from('reviews').update({ rating: reviewRating, text: reviewText }).eq('id', userReview.id)
            } else {
                await supabase.from('reviews').insert({ book_id: id, user_id: user!.id, rating: reviewRating, text: reviewText })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', id] })
            setShowReviewModal(false)
            setReviewText('')
        },
    })

    const deleteReview = useMutation({
        mutationFn: async (reviewId: string) => {
            await supabase.from('reviews').delete().eq('id', reviewId)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', id] }),
    })

    // Purchase links
    const { data: purchaseLinks } = useQuery({
        queryKey: ['purchase-links', id],
        queryFn: async () => {
            const { data } = await supabase.from('purchase_links').select('*').eq('book_id', id)
            return data || []
        },
        enabled: !!id,
    })

    // Related books (Same Category)
    const { data: relatedByCategory } = useQuery({
        queryKey: ['related-category', book?.category_id],
        queryFn: async () => {
            if (!book?.category_id) return []
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .eq('category_id', book.category_id)
                .neq('id', id)
                .limit(10)
            return data || []
        },
        enabled: !!book?.category_id,
    })

    // Related books (Same Author)
    const { data: relatedByAuthor } = useQuery({
        queryKey: ['related-author', book?.author_id],
        queryFn: async () => {
            if (!book?.author_id) return []
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .eq('author_id', book.author_id)
                .neq('id', id)
                .limit(10)
            return data || []
        },
        enabled: !!book?.author_id,
    })

    const handlePrint = () => {
        window.print()
    }

    const getLinkColor = (name: string) => {
        const lower = name.toLowerCase()
        if (lower.includes('rokomari')) return 'bg-green-600 hover:bg-green-700'
        if (lower.includes('wafilife')) return 'bg-blue-600 hover:bg-blue-700'
        if (lower.includes('facebook')) return 'bg-gray-700 hover:bg-gray-800'
        return 'bg-[#1a3a8f] hover:bg-[#2952cc]'
    }

    if (isLoading) return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
            <div className="skeleton aspect-[3/4] rounded-xl" />
            <div className="space-y-4">
                <div className="skeleton h-8 w-3/4" />
                <div className="skeleton h-5 w-1/2" />
                <div className="skeleton h-5 w-1/3" />
                <div className="skeleton h-32 w-full" />
            </div>
        </div>
    )

    if (!book) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-[#8899bb] text-lg">বই পাওয়া যায়নি</p>
        </div>
    )

    return (
        <>
            <Helmet>
                <title>{book.title} — Salafiyyah Library BD</title>
                <meta name="description" content={book.description?.substring(0, 160) || book.title} />
                {book.cover_image_url && <meta property="og:image" content={book.cover_image_url} />}
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 py-8 container page-content" style={{ overflowX: 'hidden' }}>
                {/* Book detail grid */}
                <div className="grid md:grid-cols-[350px_1fr] gap-8 book-detail">
                    {/* Cover */}
                    <div className="aspect-[3/4] bg-[#0d1428] rounded-xl border border-blue-800/40 overflow-hidden">
                        {book.cover_image_url ? (
                            <img
                                src={getFullSizeImage(book.cover_image_url)}
                                alt={book.title}
                                className="w-full h-full object-cover"
                                decoding="async"
                                loading="lazy"
                            />
                        ) : (
                            <PlaceholderBook />
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 section-title">{book.title}</h1>

                        {/* Rating */}
                        {avgRating && (
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex text-[#f0c040]">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <span key={s}>{s <= Math.round(Number(avgRating)) ? '⭐' : '☆'}</span>
                                    ))}
                                </div>
                                <span className="text-[#f0c040] font-semibold">{avgRating}</span>
                                <span className="text-[#8899bb] text-sm">({reviews?.length} রিভিউ)</span>
                            </div>
                        )}

                        {book.authors && (
                            <p className="text-[#c9a84c] mb-1">
                                লেখক: <Link to={`/writers/${book.authors.id}`} className="hover:underline">{book.authors.name}</Link>
                            </p>
                        )}
                        {book.publishers && (
                            <p className="text-[#8899bb] mb-1">
                                প্রকাশনী: <Link to={`/publishers/${book.publishers.id}`} className="hover:underline">{book.publishers.name}</Link>
                            </p>
                        )}
                        {book.categories && (
                            <span className="inline-block px-3 py-1 text-xs bg-[#1a3a8f] text-white rounded-full mb-3">
                                {book.categories.name}
                            </span>
                        )}

                        {book.price && (
                            <p className="text-2xl text-[#f0c040] font-bold mb-4">৳ {book.price}</p>
                        )}

                        {book.description && (
                            <p className="text-[#8899bb] leading-relaxed mb-6">{book.description}</p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 mb-8 items-center bg-[#111a33]/50 p-4 rounded-2xl border border-blue-800/20 btn-group">
                            <ReadingProgressButton bookId={id!} showLabel />

                            {book.pdf_preview_url && (
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="px-5 py-2.5 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-lg transition-colors"
                                >
                                    প্রিভিউ দেখুন 📄
                                </button>
                            )}
                            <div className="flex gap-4">
                                {user && (
                                    <button
                                        onClick={toggleWishlist}
                                        className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${wishlisted ? 'bg-red-500 text-white' : 'bg-[#111a33] text-white border border-red-500/30 hover:bg-red-500/10'
                                            }`}
                                    >
                                        {wishlisted ? '❤️ উইশলিস্টে আছে' : '🤍 উইশলিস্টে যুক্ত করুন'}
                                    </button>
                                )}
                                <ShareButton title={book.title} author={book.writers?.name || book.authors?.name} variant="large" />
                                <button
                                    onClick={() => toggleCompare(id || '', book)}
                                    className={`p-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 border ${isCompareSelected ? 'bg-[#f0c040] text-[#0a0f1e] border-[#f0c040]' : 'bg-[#111a33] text-white border-blue-800/30 hover:border-[#f0c040]/50'}`}
                                    title="তুলনা করুন"
                                >
                                    ⚖️ {isCompareSelected ? 'তুলনা থেকে সরান' : 'তুলনা করুন'}
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="p-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 border bg-[#111a33] text-[#8899bb] border-blue-800/30 hover:border-[#f0c040]/50"
                                    title="প্রিন্ট করুন / PDF হিসেবে সেভ করুন"
                                >
                                    🖨️ প্রিন্ট / PDF
                                </button>
                                <a
                                    href={`mailto:kitabsalafibd@gmail.com?subject=ভুল রিপোর্ট&body=পেজ: ${window.location.href}%0Aসমস্যা:%0A`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button
                                        className="p-3 rounded-xl font-medium transition-all text-red-400 border border-red-500/30 hover:bg-red-500/10 text-xs flex items-center gap-1.5"
                                        title="ভুল রিপোর্ট করুন"
                                    >
                                        ⚠️ ভুল রিপোর্ট করুন
                                    </button>
                                </a>
                            </div>
                        </div>

                        {/* Purchase Links */}
                        {purchaseLinks && purchaseLinks.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-white font-semibold mb-3">কেনার লিংক</h3>
                                <div className="flex flex-wrap gap-2">
                                    {purchaseLinks.map((link: any) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => trackEvent('purchase_click', { store: link.label || link.name, book_title: book.title })}
                                            className={`px-4 py-2 text-white rounded-lg text-sm transition-colors ${getLinkColor(link.label || link.name || '')}`}
                                        >
                                            {link.label || link.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">📝 রিভিউ</h2>
                        {user && !userReview && (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="px-4 py-2 bg-[#c9a84c] hover:bg-[#f0c040] text-[#0a0f1e] rounded-lg font-semibold text-sm transition-colors"
                            >
                                রিভিউ লিখুন
                            </button>
                        )}
                        {user && userReview && (
                            <button
                                onClick={() => { setReviewText(userReview.text || ''); setReviewRating(userReview.rating || 5); setShowReviewModal(true) }}
                                className="px-4 py-2 border border-[#c9a84c] text-[#c9a84c] rounded-lg text-sm hover:bg-[#c9a84c] hover:text-[#0a0f1e] transition-colors"
                            >
                                রিভিউ সম্পাদনা করুন
                            </button>
                        )}
                    </div>

                    {reviews?.length === 0 && (
                        <p className="text-[#8899bb] text-center py-8">এখনো কোনো রিভিউ নেই</p>
                    )}

                    <div className="space-y-4">
                        {reviews?.map((review: any) => (
                            <div key={review.id} className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#1a3a8f] flex items-center justify-center text-white text-sm font-bold">
                                            {review.profiles?.full_name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-semibold">{review.profiles?.full_name || 'ব্যবহারকারী'}</p>
                                            <div className="flex text-[#f0c040] text-xs">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <span key={s}>{s <= (review.rating || 0) ? '⭐' : '☆'}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#8899bb] text-xs">
                                            {new Date(review.created_at).toLocaleDateString('bn-BD')}
                                        </span>
                                        {(review.user_id === user?.id || isAdmin) && (
                                            <button
                                                onClick={() => deleteReview.mutate(review.id)}
                                                className="text-red-400 text-xs hover:text-red-300"
                                            >
                                                মুছুন
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[#8899bb] text-sm">{review.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Books: Author */}
                {relatedByAuthor && relatedByAuthor.length > 0 && (
                    <div className="mt-16 no-print">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">✍️</span>
                            <h2 className="text-xl md:text-2xl font-bold text-white section-title">একই লেখকের আরও বই</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 books-grid-scroll">
                            {relatedByAuthor.map((b: any) => (
                                <div key={b.id} className="min-w-[180px] md:min-w-[220px]">
                                    <BookCard
                                        book={b}
                                        onCompareToggle={toggleCompare}
                                        isCompareSelected={compareIds.includes(b.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Books: Category */}
                {relatedByCategory && relatedByCategory.length > 0 && (
                    <div className="mt-16 no-print">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">📚</span>
                            <h2 className="text-xl md:text-2xl font-bold text-white section-title">একই ক্যাটাগরির বই</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 books-grid-scroll">
                            {relatedByCategory.map((b: any) => (
                                <div key={b.id} className="min-w-[180px] md:min-w-[220px]">
                                    <BookCard
                                        book={b}
                                        onCompareToggle={toggleCompare}
                                        isCompareSelected={compareIds.includes(b.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print, header, footer, .sticky, button, a { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .max-w-7xl { max-width: 100% !important; padding: 0 !important; }
                    .grid { display: block !important; }
                    img { max-width: 200px !important; margin-bottom: 20px !important; }
                    h1 { color: black !important; font-size: 24pt !important; }
                    p { color: #333 !important; font-size: 12pt !important; }
                }
            ` }} />

            {/* PDF Preview Modal */}
            {showPreview && book.pdf_preview_url && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl h-[90vh] bg-[#0d1428] rounded-xl overflow-hidden">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute top-3 right-3 z-10 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg"
                        >
                            ✕
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0f1e]/90 to-transparent p-4 text-center z-10">
                            <p className="text-[#f0c040] text-sm">Salafiyyah Library BD — শুধুমাত্র প্রিভিউ</p>
                        </div>
                        <iframe src={book.pdf_preview_url} className="w-full h-full" title="PDF Preview" />
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-[#0d1428] rounded-xl border border-blue-800/40 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">রিভিউ লিখুন</h3>
                        <div className="flex gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button
                                    key={s} onClick={() => setReviewRating(s)}
                                    className={`text-2xl transition-colors ${s <= reviewRating ? 'text-[#f0c040]' : 'text-[#8899bb]'}`}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="আপনার মতামত লিখুন..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-blue-800/40 text-white placeholder-[#8899bb] focus:border-[#f0c040] focus:outline-none resize-none"
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => submitReview.mutate()}
                                className="flex-1 py-2.5 bg-[#c9a84c] hover:bg-[#f0c040] text-[#0a0f1e] rounded-lg font-semibold transition-colors"
                            >
                                জমা দিন
                            </button>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="px-6 py-2.5 border border-[#8899bb] text-[#8899bb] rounded-lg hover:bg-[#8899bb]/10 transition-colors"
                            >
                                বাতিল
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default BookDetailPage
