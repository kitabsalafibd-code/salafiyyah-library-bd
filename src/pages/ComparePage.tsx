import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

const ComparePage: React.FC = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    useEffect(() => {
        const stored = localStorage.getItem('compare-books')
        if (stored) setSelectedIds(JSON.parse(stored))
    }, [])

    const { data: books } = useQuery({
        queryKey: ['compare-books', selectedIds],
        queryFn: async () => {
            if (selectedIds.length === 0) return []
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .in('id', selectedIds)
            return data || []
        },
        enabled: selectedIds.length > 0,
    })

    const resetSelection = () => {
        localStorage.removeItem('compare-books')
        setSelectedIds([])
    }

    return (
        <>
            <Helmet><title>তুলনা করুন — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8 container page-content" style={{ overflowX: 'hidden' }}>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-white section-title">⚖️ বই তুলনা</h1>
                    <button onClick={resetSelection} className="px-4 py-2 border border-[#c9a84c] text-[#c9a84c] rounded-lg text-sm hover:bg-[#c9a84c] hover:text-[#0a0f1e] transition-colors">
                        আরেকটি বই বাছুন
                    </button>
                </div>

                {!books || books.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[#8899bb] text-lg mb-4">তুলনা করার জন্য বই নির্বাচন করুন</p>
                        <Link to="/books" className="px-6 py-3 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-lg transition-colors">
                            বই ব্রাউজ করুন
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto compare-table-container">
                        <table className="w-full compare-table">
                            <thead>
                                <tr className="border-b border-blue-800/40">
                                    <th className="py-3 px-4 text-left text-[#8899bb] text-sm w-40">বৈশিষ্ট্য</th>
                                    {books.map((b: any) => (
                                        <th key={b.id} className="py-3 px-4 text-center text-white font-semibold">{b.title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-blue-800/20">
                                    <td className="py-4 px-4 text-[#8899bb] text-sm">প্রচ্ছদ</td>
                                    {books.map((b: any) => (
                                        <td key={b.id} className="py-4 px-4 text-center">
                                            <div className="w-32 aspect-[3/4] mx-auto bg-[#111a33] rounded-lg overflow-hidden">
                                                {b.cover_image ? <img src={b.cover_image} alt={b.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-3xl">📖</div>}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                {[
                                    { label: 'লেখক', key: (b: any) => b.authors?.name || 'N/A' },
                                    { label: 'প্রকাশনী', key: (b: any) => b.publishers?.name || 'N/A' },
                                    { label: 'ক্যাটাগরি', key: (b: any) => b.categories?.name || 'N/A' },
                                    { label: 'মূল্য', key: (b: any) => b.price ? `৳ ${b.price}` : 'N/A' },
                                    { label: 'বিবরণ', key: (b: any) => b.description?.substring(0, 150) + '...' || 'N/A' },
                                ].map((row) => (
                                    <tr key={row.label} className="border-b border-blue-800/20">
                                        <td className="py-4 px-4 text-[#8899bb] text-sm">{row.label}</td>
                                        {books.map((b: any) => (
                                            <td key={b.id} className="py-4 px-4 text-center text-white text-sm">{row.key(b)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}

export default ComparePage
