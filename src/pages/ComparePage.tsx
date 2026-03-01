import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import type { CompareBook } from '../hooks/useCompare'
import { getFullSizeImage } from '../lib/utils'

const COMPARE_KEY = 'compare'

const ComparePage: React.FC = () => {
    const [books, setBooks] = useState<CompareBook[]>([])

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]')
            setBooks(stored)
        } catch {
            setBooks([])
        }
    }, [])

    const removeFromCompare = (bookId: string) => {
        const current = books.filter(b => b.id !== bookId)
        localStorage.setItem(COMPARE_KEY, JSON.stringify(current))
        setBooks(current)
        window.dispatchEvent(new Event('storage'))
    }

    const clearAll = () => {
        localStorage.setItem(COMPARE_KEY, '[]')
        setBooks([])
        window.dispatchEvent(new Event('storage'))
    }

    // Fetch purchase links for each book
    const bookIds = books.map(b => b.id)
    const { data: purchaseLinksMap } = useQuery({
        queryKey: ['compare-purchase-links', bookIds],
        queryFn: async () => {
            if (!bookIds.length) return {}
            const { data } = await supabase
                .from('purchase_links')
                .select('*')
                .in('book_id', bookIds)
            const map: Record<string, any[]> = {}
            data?.forEach(link => {
                if (!map[link.book_id]) map[link.book_id] = []
                map[link.book_id].push(link)
            })
            return map
        },
        enabled: bookIds.length > 0,
    })

    // Fetch reviews for ratings
    const { data: ratingsMap } = useQuery({
        queryKey: ['compare-ratings', bookIds],
        queryFn: async () => {
            if (!bookIds.length) return {}
            const { data } = await supabase
                .from('reviews')
                .select('book_id, rating')
                .in('book_id', bookIds)
            const map: Record<string, number[]> = {}
            data?.forEach(r => {
                if (!map[r.book_id]) map[r.book_id] = []
                map[r.book_id].push(r.rating)
            })
            return map
        },
        enabled: bookIds.length > 0,
    })

    const getAvgRating = (bookId: string) => {
        const ratings = ratingsMap?.[bookId]
        if (!ratings || !ratings.length) return null
        const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length
        return avg.toFixed(1)
    }

    // Empty state
    if (books.length === 0) {
        return (
            <>
                <Helmet><title>তুলনা করুন — Salafiyyah Library BD</title></Helmet>
                <div style={{ textAlign: 'center', padding: '80px 20px', color: '#8899bb' }}>
                    <div style={{ fontSize: '64px' }}>⚖️</div>
                    <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: '16px 0 8px' }}>
                        বই তুলনা করুন
                    </h2>
                    <p style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
                        বইয়ের পেজ থেকে ⚖️ বাটনে ক্লিক করে সর্বোচ্চ ২টি বই বেছে নিন
                    </p>
                    <Link to="/books">
                        <button style={{
                            background: '#1a3a8f',
                            color: 'white',
                            border: 'none',
                            padding: '12px 32px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                        }}>
                            📚 বই দেখুন
                        </button>
                    </Link>
                </div>
            </>
        )
    }

    const rows = [
        {
            label: '📸 প্রচ্ছদ',
            render: (book: CompareBook) => (
                <div style={{ width: '120px', margin: '0 auto' }}>
                    {book.cover_image_url ? (
                        <img
                            src={getFullSizeImage(book.cover_image_url)}
                            alt={book.title}
                            style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(59,86,179,0.4)' }}
                        />
                    ) : (
                        <div style={{
                            width: '100%', paddingBottom: '133%', background: '#111a33',
                            borderRadius: '8px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '32px', position: 'relative'
                        }}>
                            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>📖</span>
                        </div>
                    )}
                </div>
            )
        },
        { label: '📝 শিরোনাম', render: (b: CompareBook) => <span style={{ color: 'white', fontWeight: 600 }}>{b.title}</span> },
        { label: '✍️ লেখক', render: (b: CompareBook) => <span style={{ color: '#c9a84c' }}>{b.writers?.name || '—'}</span> },
        { label: '🏢 প্রকাশনী', render: (b: CompareBook) => <span>{b.publishers?.name || '—'}</span> },
        { label: '🏷️ বিভাগ', render: (b: CompareBook) => b.categories ? <span style={{ background: '#1a3a8f', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>{b.categories.name}</span> : <span>—</span> },
        { label: '💰 মূল্য', render: (b: CompareBook) => b.price ? <span style={{ color: '#f0c040', fontWeight: 700, fontSize: '18px' }}>৳ {b.price}</span> : <span style={{ color: '#8899bb' }}>উল্লেখ নেই</span> },
        {
            label: '⭐ রেটিং',
            render: (b: CompareBook) => {
                const avg = getAvgRating(b.id)
                if (!avg) return <span style={{ color: '#8899bb' }}>রেটিং নেই</span>
                const num = Math.round(Number(avg))
                return (
                    <div>
                        <span style={{ color: '#f0c040', fontSize: '16px' }}>{'⭐'.repeat(num)}{'☆'.repeat(5 - num)}</span>
                        <span style={{ color: '#f0c040', marginLeft: '6px', fontWeight: 700 }}>{avg}</span>
                    </div>
                )
            }
        },
        {
            label: '📄 বিবরণ',
            render: (b: CompareBook) => b.description
                ? <span style={{ color: '#8899bb', fontSize: '13px', lineHeight: '1.6' }}>{b.description.substring(0, 200)}{b.description.length > 200 ? '...' : ''}</span>
                : <span style={{ color: '#8899bb' }}>—</span>
        },
        {
            label: '🛒 কিনুন',
            render: (b: CompareBook) => {
                const links = purchaseLinksMap?.[b.id]
                if (!links || !links.length) return <span style={{ color: '#8899bb' }}>লিংক নেই</span>
                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {links.map((link: any) => (
                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                style={{ padding: '4px 12px', background: '#1a3a8f', color: 'white', borderRadius: '6px', fontSize: '12px', textDecoration: 'none' }}>
                                {link.label || link.name}
                            </a>
                        ))}
                    </div>
                )
            }
        },
    ]

    return (
        <>
            <Helmet><title>তুলনা করুন — Salafiyyah Library BD</title></Helmet>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', overflowX: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                    <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>⚖️ বই তুলনা</h1>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Link to="/books" style={{ color: '#c9a84c', fontSize: '14px', textDecoration: 'none' }}>
                            + আরও বই যোগ করুন
                        </Link>
                        <button onClick={clearAll} style={{
                            padding: '8px 18px', border: '1px solid #c9a84c', color: '#c9a84c',
                            background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
                        }}>
                            সব মুছুন
                        </button>
                    </div>
                </div>

                {/* Desktop table layout */}
                <div className="compare-desktop" style={{ display: 'block' }}>
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(59,86,179,0.3)' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8899bb', fontSize: '14px', width: '180px' }}>
                                        বৈশিষ্ট্য
                                    </th>
                                    {books.map(book => (
                                        <th key={book.id} style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <span style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>{book.title}</span>
                                                <button
                                                    onClick={() => removeFromCompare(book.id)}
                                                    title="সরিয়ে দিন"
                                                    style={{
                                                        marginLeft: '8px', width: '22px', height: '22px',
                                                        background: '#ef4444', border: 'none', color: 'white',
                                                        borderRadius: '50%', cursor: 'pointer', fontSize: '12px',
                                                        verticalAlign: 'middle', lineHeight: '22px'
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(row => (
                                    <tr key={row.label} style={{ borderBottom: '1px solid rgba(59,86,179,0.15)' }}>
                                        <td style={{ padding: '16px', color: '#8899bb', fontSize: '14px', fontWeight: 500, verticalAlign: 'middle' }}>
                                            {row.label}
                                        </td>
                                        {books.map(book => (
                                            <td key={book.id} style={{ padding: '16px', textAlign: 'center', color: '#8899bb', fontSize: '14px', verticalAlign: 'middle' }}>
                                                {row.render(book)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile layout: stacked cards */}
                <style>{`
                    @media (max-width: 640px) {
                        .compare-desktop table { display: none; }
                        .compare-mobile { display: block !important; }
                    }
                    .compare-mobile { display: none; }
                `}</style>
                <div className="compare-mobile">
                    {books.map(book => (
                        <div key={book.id} style={{
                            background: '#0d1428', border: '1px solid rgba(59,86,179,0.4)',
                            borderRadius: '12px', padding: '20px', marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <h3 style={{ color: 'white', fontWeight: 700, fontSize: '16px', maxWidth: '80%' }}>{book.title}</h3>
                                <button
                                    onClick={() => removeFromCompare(book.id)}
                                    style={{ background: '#ef4444', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}
                                >
                                    ✕
                                </button>
                            </div>
                            {book.cover_image_url && (
                                <img src={getFullSizeImage(book.cover_image_url)} alt={book.title}
                                    style={{ width: '120px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(59,86,179,0.4)' }} />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {rows.slice(2).map(row => (
                                    <div key={row.label} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        <span style={{ color: '#8899bb', fontSize: '13px', minWidth: '100px', flexShrink: 0 }}>{row.label}</span>
                                        <span style={{ fontSize: '13px' }}>{row.render(book)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '16px' }}>
                                <Link to={`/books/${book.id}`} style={{
                                    display: 'inline-block', padding: '10px 24px', background: '#1a3a8f',
                                    color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px'
                                }}>
                                    বিস্তারিত দেখুন →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View detail links */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {books.map(book => (
                        <Link key={book.id} to={`/books/${book.id}`} style={{
                            padding: '12px 28px', background: '#1a3a8f', color: 'white',
                            borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600
                        }}>
                            📖 {book.title.substring(0, 30)}{book.title.length > 30 ? '...' : ''} →
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ComparePage
