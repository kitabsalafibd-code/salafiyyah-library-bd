import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'

const SurahDetailPage: React.FC = () => {
    const { number } = useParams<{ number: string }>()
    const num = Number(number)

    const { user } = useAuth()
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    const { data, isLoading } = useQuery({
        queryKey: ['surah', number],
        queryFn: async () => {
            const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,bn.bengali`)
            const json = await res.json()
            return json.data || []
        },
        staleTime: 24 * 60 * 60 * 1000,
        enabled: !!number,
    })

    // Fetch bookmarks
    const { data: bookmarks } = useQuery({
        queryKey: ['quran-bookmarks', user?.id, num],
        queryFn: async () => {
            if (!user) return []
            const { data } = await supabase
                .from('quran_bookmarks')
                .select('ayah_number')
                .eq('user_id', user.id)
                .eq('surah_number', num)
            return (data || []).map(b => b.ayah_number)
        },
        enabled: !!user && !!num,
    })

    const toggleBookmark = useMutation({
        mutationFn: async ({ ayahNum, arabicText }: { ayahNum: number; arabicText: string }) => {
            if (!user) return
            const isBookmarked = bookmarks?.includes(ayahNum)
            if (isBookmarked) {
                await supabase.from('quran_bookmarks').delete().eq('user_id', user.id).eq('surah_number', num).eq('ayah_number', ayahNum)
            } else {
                await supabase.from('quran_bookmarks').insert({
                    user_id: user.id,
                    surah_number: num,
                    ayah_number: ayahNum,
                    ayah_arabic: arabicText,
                    created_at: new Date().toISOString()
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quran-bookmarks', user?.id, num] })
            showToast('বুকমার্ক আপডেট হয়েছে')
        }
    })

    const arabic = data?.[0]
    const bangla = data?.[1]

    return (
        <>
            <Helmet><title>{arabic?.englishName || `সূরা ${number}`} — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link to="/quran" className="text-[#3d6bff] text-sm hover:underline mb-4 block">← সকল সূরা</Link>
                {isLoading ? (
                    <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
                ) : arabic && (
                    <>
                        <div className="text-center mb-8 bg-gradient-to-br from-[#0d1a3a] to-[#0d1428] rounded-2xl border border-blue-800/40 p-8">
                            <h1 className="font-arabic text-4xl text-[#f0c040] mb-2" dir="rtl">{arabic.name}</h1>
                            <p className="text-white text-xl font-semibold">{arabic.englishName}</p>
                            <p className="text-[#8899bb] text-sm">{arabic.englishNameTranslation} • {arabic.numberOfAyahs} আয়াত • {arabic.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}</p>
                        </div>

                        {/* Bismillah */}
                        {num !== 1 && num !== 9 && (
                            <p className="font-arabic text-2xl text-[#f0c040] text-center mb-8 bg-[#0d1428] rounded-xl p-4 border border-[#c9a84c]/20" dir="rtl">
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </p>
                        )}

                        <div className="space-y-4">
                            {arabic.ayahs?.map((ayah: any, i: number) => (
                                <div key={ayah.number} className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-5 hover:border-[#c9a84c]/30 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="w-9 h-9 rounded-full bg-[#1a3a8f] flex items-center justify-center text-[#f0c040] text-xs font-bold shrink-0">
                                            {ayah.numberInSurah}
                                        </span>
                                        {user && (
                                            <button
                                                onClick={() => toggleBookmark.mutate({ ayahNum: ayah.numberInSurah, arabicText: ayah.text })}
                                                className={`text-xl transition-colors ${bookmarks?.includes(ayah.numberInSurah) ? 'text-[#f0c040]' : 'text-[#8899bb] hover:text-[#f0c040]'}`}
                                                title="বুকমার্ক করুন"
                                            >
                                                {bookmarks?.includes(ayah.numberInSurah) ? '🔖' : '🏷️'}
                                            </button>
                                        )}
                                    </div>
                                    <p className="font-arabic text-xl text-white text-right leading-loose mb-4" dir="rtl">
                                        {ayah.text}
                                    </p>
                                    <p className="text-[#8899bb] leading-relaxed">
                                        {bangla?.ayahs?.[i]?.text || ''}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Prev/Next */}
                        <div className="flex items-center justify-between mt-8">
                            {num > 1 ? (
                                <Link to={`/quran/${num - 1}`} className="px-5 py-2.5 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-xl text-sm transition-colors">← পূর্ববর্তী সূরা</Link>
                            ) : <div />}
                            {num < 114 ? (
                                <Link to={`/quran/${num + 1}`} className="px-5 py-2.5 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-xl text-sm transition-colors">পরবর্তী সূরা →</Link>
                            ) : <div />}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default SurahDetailPage
