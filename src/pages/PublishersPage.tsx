import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

const PublishersPage: React.FC = () => {
    const { data: publishers, isLoading } = useQuery({
        queryKey: ['publishers'],
        queryFn: async () => {
            const { data } = await supabase.from('publishers').select('*').order('name')
            return data || []
        },
    })

    return (
        <>
            <Helmet><title>প্রকাশনী — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">🏢 প্রকাশনী</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)
                        : publishers?.map((p: any) => (
                            <Link key={p.id} to={`/publishers/${p.id}`} className="group bg-[#0d1428] rounded-xl border border-blue-800/40 p-6 text-center hover:border-[#c9a84c]/50 gold-glow transition-all">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-[#1a3a8f]/30 flex items-center justify-center text-2xl overflow-hidden">
                                    {p.logo ? <img src={p.logo} alt={p.name} className="w-full h-full object-contain" /> : '🏢'}
                                </div>
                                <span className="text-white font-semibold text-sm group-hover:text-[#f0c040] transition-colors">{p.name}</span>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default PublishersPage
