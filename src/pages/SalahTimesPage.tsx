import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'

const salahNames: Record<string, string> = {
    Fajr: 'ফজর', Sunrise: 'সূর্যোদয়', Dhuhr: 'যোহর', Asr: 'আসর',
    Sunset: 'সূর্যাস্ত', Maghrib: 'মাগরিব', Isha: 'ইশা',
    Imsak: 'ইমসাক', Midnight: 'মধ্যরাত',
}
const mainSalah = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

const SalahTimesPage: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['salah-times-full'],
        queryFn: async () => {
            // Check cache
            const cached = localStorage.getItem('salah-full')
            const today = new Date().toDateString()
            if (cached) { const p = JSON.parse(cached); if (p.date === today) return p.data }

            let lat = 23.8103, lon = 90.4125
            try {
                const pos = await new Promise<GeolocationPosition>((res, rej) =>
                    navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
                )
                lat = pos.coords.latitude; lon = pos.coords.longitude
            } catch { /* Dhaka default */ }

            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=1`)
            const json = await res.json()
            const result = json.data
            localStorage.setItem('salah-full', JSON.stringify({ date: today, data: result }))
            return result
        },
        staleTime: 24 * 60 * 60 * 1000,
    })

    const timings = data?.timings
    const dateInfo = data?.date
    const meta = data?.meta

    const nextSalah = useMemo(() => {
        if (!timings) return ''
        const now = new Date()
        for (const k of mainSalah) {
            const [h, m] = timings[k].split(':').map(Number)
            const t = new Date(); t.setHours(h, m, 0, 0)
            if (t > now) return k
        }
        return 'Fajr'
    }, [timings])

    return (
        <>
            <Helmet><title>সালাতের সময় — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-2">🕌 সালাতের সময়</h1>
                <div className="flex flex-wrap gap-3 text-[#8899bb] text-sm mb-8">
                    {dateInfo && <span>{dateInfo.readable}</span>}
                    {dateInfo?.hijri && <span className="text-[#c9a84c]">• {dateInfo.hijri.day} {dateInfo.hijri.month.bn || dateInfo.hijri.month.en} {dateInfo.hijri.year} হিজরী</span>}
                    {meta?.timezone && <span>• {meta.timezone}</span>}
                </div>

                {isLoading ? (
                    <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
                ) : (
                    <>
                        {/* Main 5 salah */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                            {mainSalah.map(key => (
                                <div key={key} className={`bg-[#0d1428] rounded-xl border p-5 text-center transition-all ${nextSalah === key
                                        ? 'border-[#f0c040] shadow-[0_0_25px_rgba(240,192,64,0.15)] scale-[1.02]'
                                        : 'border-blue-800/40'
                                    }`}>
                                    <p className={`text-sm font-semibold mb-2 ${nextSalah === key ? 'text-[#f0c040]' : 'text-[#8899bb]'}`}>{salahNames[key]}</p>
                                    <p className={`text-2xl font-bold ${nextSalah === key ? 'text-[#f0c040]' : 'text-white'}`}>{timings?.[key]}</p>
                                    {nextSalah === key && <span className="text-[10px] text-[#f0c040] mt-2 block">পরবর্তী সালাত ◀</span>}
                                </div>
                            ))}
                        </div>

                        {/* Additional times */}
                        <h2 className="text-lg font-bold text-white mb-3">অতিরিক্ত সময়সমূহ</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                            {Object.entries(salahNames).filter(([k]) => !mainSalah.includes(k)).map(([key, name]) => (
                                <div key={key} className="bg-[#0d1428] rounded-lg border border-blue-800/40 p-3 flex items-center justify-between">
                                    <span className="text-[#8899bb] text-sm">{name}</span>
                                    <span className="text-white font-semibold">{timings?.[key] || '--:--'}</span>
                                </div>
                            ))}
                        </div>

                        {/* Qibla direction */}
                        {meta?.latitude && (
                            <div className="bg-gradient-to-r from-[#1a3a8f]/20 to-[#0d1428] rounded-xl border border-blue-800/40 p-5">
                                <h2 className="text-lg font-bold text-white mb-3">🧭 কিবলা দিক</h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-[#1a3a8f] flex items-center justify-center text-3xl">🕋</div>
                                    <div>
                                        <p className="text-white">অক্ষাংশ: {meta.latitude}°, দ্রাঘিমাংশ: {meta.longitude}°</p>
                                        <p className="text-[#c9a84c] text-sm">পদ্ধতি: {meta.method?.name || 'MWL'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default SalahTimesPage
