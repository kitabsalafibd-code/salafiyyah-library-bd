import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

const islamicEvents = [
    { name: 'ঈদুল ফিতর', nameAr: 'عيد الفطر', date: new Date('2026-03-20'), description: 'রমাদানের সিয়ামের পর ঈদ উদযাপন' },
    { name: 'ঈদুল আযহা', nameAr: 'عيد الأضحى', date: new Date('2026-05-27'), description: 'কুরবানীর ঈদ' },
    { name: 'আশুরা', nameAr: 'عاشوراء', date: new Date('2026-07-06'), description: 'মুহাররমের ১০ তারিখ — সিয়াম পালনের দিন' },
    { name: 'মিলাদুন্নবী', nameAr: 'المولد النبوي', date: new Date('2026-09-04'), description: 'রাসূলুল্লাহ ﷺ এর জন্ম দিবস' },
    { name: 'শবে বরাত', nameAr: 'ليلة النصف من شعبان', date: new Date('2027-01-18'), description: 'শাবান মাসের মধ্যরাত' },
    { name: 'রমাদান শুরু', nameAr: 'بداية رمضان', date: new Date('2027-02-08'), description: 'পবিত্র রমাদান মাসের সূচনা' },
    { name: 'লাইলাতুল কদর', nameAr: 'ليلة القدر', date: new Date('2027-03-04'), description: 'হাজার মাসের চেয়ে উত্তম রাত' },
]

const EventsPage: React.FC = () => {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    const upcomingEvents = useMemo(() => {
        return islamicEvents
            .filter(e => e.date > now)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
    }, [now])

    const getCountdown = (date: Date) => {
        const diff = date.getTime() - now.getTime()
        if (diff <= 0) return 'এখনই!'
        const days = Math.floor(diff / (86400000))
        const hours = Math.floor((diff % 86400000) / 3600000)
        const mins = Math.floor((diff % 3600000) / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        return `${days} দিন ${hours} ঘণ্টা ${mins} মিনিট ${secs} সেকেন্ড`
    }

    return (
        <>
            <Helmet><title>ইসলামী ইভেন্ট — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-4xl mx-auto px-4 py-8 container page-content" style={{ overflowX: 'hidden' }}>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2 section-title">🌙 ইসলামী ইভেন্ট</h1>
                    <p className="text-[#8899bb]">আসন্ন ইসলামী দিবস ও কাউন্টডাউন</p>
                </div>
                <div className="space-y-4">
                    {upcomingEvents.map((event, i) => (
                        <div
                            key={event.name}
                            className={`bg-[#0d1428] rounded-xl border p-6 transition-all event-card ${i === 0 ? 'border-[#f0c040] shadow-[0_0_20px_rgba(240,192,64,0.15)]' : 'border-blue-800/40'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 event-info">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{i === 0 ? '🌟' : '🌙'}</span>
                                        <h3 className="text-white font-bold text-lg">{event.name}</h3>
                                        <span className="font-arabic text-[#c9a84c] text-sm" dir="rtl">{event.nameAr}</span>
                                    </div>
                                    <p className="text-[#8899bb] text-sm">{event.description}</p>
                                    <p className="text-[#8899bb] text-xs mt-1">{event.date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold countdown-timer ${i === 0 ? 'text-[#f0c040] text-lg' : 'text-white'}`}>
                                        {getCountdown(event.date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default EventsPage
