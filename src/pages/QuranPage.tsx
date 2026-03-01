import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'

const QuranPage: React.FC = () => {
    const [search, setSearch] = useState('')

    const { data: surahs, isLoading } = useQuery({
        queryKey: ['surahs'],
        queryFn: async () => {
            const res = await fetch('https://api.alquran.cloud/v1/surah')
            const json = await res.json()
            return json.data || []
        },
        staleTime: 24 * 60 * 60 * 1000,
    })

    const filtered = useMemo(() => {
        if (!surahs) return []
        if (!search.trim()) return surahs
        const q = search.toLowerCase()
        return surahs.filter((s: any) =>
            s.englishName.toLowerCase().includes(q) ||
            s.name.includes(q) ||
            s.englishNameTranslation.toLowerCase().includes(q) ||
            String(s.number).includes(q)
        )
    }, [surahs, search])

    return (
        <>
            <Helmet><title>কুরআন — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-white">📖 আল-কুরআন</h1>
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="সূরা খুঁজুন..."
                        className="px-4 py-2.5 rounded-xl bg-[#0d1428] border border-blue-800/40 text-white placeholder-[#8899bb] focus:border-[#f0c040] focus:outline-none w-full md:w-64"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {isLoading
                        ? Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)
                        : filtered.map((s: any) => (
                            <Link
                                key={s.number}
                                to={`/quran/${s.number}`}
                                className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-4 flex items-center gap-4 hover:border-[#c9a84c]/50 gold-glow transition-all group"
                            >
                                <span className="w-10 h-10 rounded-full bg-[#1a3a8f] flex items-center justify-center text-white text-sm font-bold shrink-0 group-hover:bg-[#2952cc] transition-colors">
                                    {s.number}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold">{s.englishName}</p>
                                    <p className="text-[#8899bb] text-xs">{s.englishNameTranslation} • {s.numberOfAyahs} আয়াত</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-arabic text-[#f0c040] text-lg" dir="rtl">{s.name}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.revelationType === 'Meccan' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {s.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}
                                    </span>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default QuranPage
