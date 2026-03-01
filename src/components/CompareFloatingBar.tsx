import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const CompareFloatingBar: React.FC = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const location = useLocation()

    // Periodically sync with localStorage
    useEffect(() => {
        const sync = () => {
            const stored = localStorage.getItem('compare-books')
            if (stored) setSelectedIds(JSON.parse(stored))
            else setSelectedIds([])
        }
        sync()
        window.addEventListener('storage', sync)
        const interval = setInterval(sync, 1000) // Poll for changes on the same page
        return () => {
            window.removeEventListener('storage', sync)
            clearInterval(interval)
        }
    }, [])

    const { data: books } = useQuery({
        queryKey: ['compare-books-bar', selectedIds],
        queryFn: async () => {
            if (selectedIds.length === 0) return []
            const { data } = await supabase
                .from('books')
                .select('id, title, cover_image')
                .in('id', selectedIds)
                .limit(3)
            return data || []
        },
        enabled: selectedIds.length > 0,
    })

    const removeBook = (id: string) => {
        const updated = selectedIds.filter(x => x !== id)
        localStorage.setItem('compare-books', JSON.stringify(updated))
        setSelectedIds(updated)
    }

    if (selectedIds.length === 0 || location.pathname === '/compare') return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-in slide-in-from-bottom-full duration-300">
            <div className="max-w-xl mx-auto bg-[#0d1428]/95 backdrop-blur-md border border-[#c9a84c]/40 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex -space-x-3 overflow-hidden">
                    {books?.map(book => (
                        <div key={book.id} className="relative group">
                            <div className="w-10 h-14 rounded-md border border-blue-800/40 overflow-hidden bg-[#111a33]">
                                {book.cover_image ? (
                                    <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs">📖</div>
                                )}
                            </div>
                            <button
                                onClick={() => removeBook(book.id)}
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    {selectedIds.length > 3 && (
                        <div className="w-10 h-14 rounded-md border border-blue-800/40 bg-[#1a3a8f] text-white flex items-center justify-center text-xs font-bold">
                            +{selectedIds.length - 3}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate leading-none">বই তুলনা করুন</p>
                    <p className="text-[#8899bb] text-[10px] mt-1">{selectedIds.length} টি বই নির্বাচিত</p>
                </div>

                <Link
                    to="/compare"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#c9a84c] to-[#f0c040] text-[#0a0f1e] text-sm font-bold rounded-xl shadow-lg hover:shadow-yellow-900/20 active:scale-95 transition-all"
                >
                    ⚖️ তুলনা করুন
                </Link>
            </div>
        </div>
    )
}

export default React.memo(CompareFloatingBar)
