import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import BookCard from '../components/BookCard'
import { BookCardSkeleton } from '../components/Skeleton'
import { useCompare } from '../hooks/useCompare'
import { getFullSizeImage } from '../lib/utils'
import PlaceholderBook from '../components/PlaceholderBook'

/* ========== Helper: date-seeded random ========== */
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}
function getTodaySeed() {
    const d = new Date()
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

/* ========== 1. Hero Section ========== */
const HeroSection: React.FC = () => {
    console.log('Hero rendering')
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    const handleSearch = useCallback(() => {
        if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
        setShowSuggestions(false) // Hide suggestions after search
    }, [query, navigate])

    // Debounced search for suggestions
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 1) {
                const { data: books } = await supabase
                    .from('books')
                    .select('id, title, cover_image_url')
                    .ilike('title', `%${query.trim()}%`)
                    .limit(3)

                const { data: writers } = await supabase
                    .from('writers')
                    .select('id, name, avatar_url')
                    .ilike('name', `%${query.trim()}%`)
                    .limit(2)

                const { data: publishers } = await supabase
                    .from('publishers')
                    .select('id, name, logo_url')
                    .ilike('name', `%${query.trim()}%`)
                    .limit(2)

                const combinedSuggestions = [
                    ...(books || []).map(item => ({ ...item, type: 'book' })),
                    ...(writers || []).map(item => ({ ...item, type: 'writer' })),
                    ...(publishers || []).map(item => ({ ...item, type: 'publisher' }))
                ]

                setSuggestions(combinedSuggestions)
                setShowSuggestions(combinedSuggestions.length > 0)
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }, 300) // 300ms debounce

        return () => clearTimeout(delayDebounceFn)
    }, [query])

    return (
        <section className="relative md:min-h-[85vh] min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#0a0f1e]">
            {/* Layer 1: Base Gradient */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0f1e_0%,#0d1f4a_40%,#0a1535_70%,#0a0f1e_100%)]" />

            {/* Layer 2: Islamic Pattern */}
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><polygon points="45,5 75,5 115,45 115,75 75,115 45,115 5,75 5,45" fill="none" stroke="%23c9a84c" stroke-width="0.8"/><polygon points="60,15 65,45 95,45 72,63 80,93 60,75 40,93 48,63 25,45 55,45" fill="none" stroke="%23c9a84c" stroke-width="0.6"/><polygon points="60,40 75,60 60,80 45,60" fill="none" stroke="%23c9a84c" stroke-width="0.5"/><circle cx="60" cy="5" r="2" fill="%23c9a84c" opacity="0.4"/><circle cx="115" cy="60" r="2" fill="%23c9a84c" opacity="0.4"/><circle cx="60" cy="115" r="2" fill="%23c9a84c" opacity="0.4"/><circle cx="5" cy="60" r="2" fill="%23c9a84c" opacity="0.4"/></svg>')`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '120px'
                }}
            />

            {/* Layer 3: Radial Gold Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(41,82,204,0.15)_0%,transparent_70%)]" />

            {/* Layer 4: Bottom Fade */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_70%,#0a0f1e_100%)]" />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-[#c9a84c] opacity-40 animate-float"
                        style={{
                            width: `${Math.random() * 3 + 2}px`,
                            height: `${Math.random() * 3 + 2}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 5 + 5}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .hero-animate-1 { animation: fadeInUp 0.8s ease-out forwards; }
                .hero-animate-2 { animation: fadeInUp 0.8s ease-out 0.2s forwards; opacity: 0; }
                .hero-animate-3 { animation: fadeInUp 0.8s ease-out 0.4s forwards; opacity: 0; }
                .hero-animate-4 { animation: fadeInUp 0.8s ease-out 0.6s forwards; opacity: 0; }
                .animate-float { animation: float infinite ease-in-out; }
            `}</style>

            <div className="relative max-w-5xl mx-auto px-4 text-center">
                {/* Arabic Basmala */}
                <div className="hero-animate-1 mb-6 font-arabic text-2xl text-[#c9a84c] opacity-80" style={{ fontFamily: "'Amiri', serif" }}>
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </div>

                <h1 className="hero-animate-1 text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    সালাফি জ্ঞানের <span className="text-[#f0c040]">এক ঠিকানা</span>
                </h1>

                <p className="hero-animate-2 text-[#8899bb] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                    বিশুদ্ধ ইসলামী বই, কুরআন, হাদীস এবং ইসলামী জ্ঞানের সন্ধানে আপনাকে স্বাগতম
                </p>

                <div className="hero-animate-3 relative max-w-2xl mx-auto mb-12 shadow-[0_0_30px_rgba(201,168,76,0.1)] rounded-2xl border border-[#c9a84c]/30 focus-within:border-[#f0c040] transition-all">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        onFocus={() => query.length > 1 && setShowSuggestions(true)}
                        placeholder="বই, লেখক বা প্রকাশনী খুঁজুন..."
                        className="flex-1 px-6 py-4 bg-[#0d1428]/80 backdrop-blur-sm text-white placeholder-[#8899bb] focus:outline-none w-full"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-8 py-4 bg-gradient-to-r from-[#1a3a8f] to-[#2952cc] text-white transition-all font-bold hover:px-10"
                    >
                        খুঁজুন
                    </button>

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
                            <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-[#0d1428]/95 backdrop-blur-xl border border-blue-800/40 rounded-2xl shadow-3xl overflow-hidden animate-fadeIn">
                                {suggestions.map((item, idx) => (
                                    <button
                                        key={`${item.type}-${item.id}`}
                                        onClick={() => {
                                            setShowSuggestions(false)
                                            if (item.type === 'book') navigate(`/books/${item.id}`)
                                            else if (item.type === 'writer') navigate(`/writers/${item.id}`)
                                            else if (item.type === 'publisher') navigate(`/publishers/${item.id}`)
                                        }}
                                        className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-all hover:bg-white/5 ${idx !== suggestions.length - 1 ? 'border-b border-blue-800/20' : ''}`}
                                    >
                                        <div className="w-10 h-12 bg-[#111a33] rounded overflow-hidden shrink-0 border border-blue-800/20">
                                            {item.cover_image_url || item.avatar_url || item.logo_url ? (
                                                <img
                                                    src={getFullSizeImage(item.cover_image_url || item.avatar_url || item.logo_url)}
                                                    alt={item.title || item.name}
                                                    className="w-full h-full object-cover"
                                                    decoding="async"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs opacity-40">📖</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-semibold">{item.title || item.name}</p>
                                            <p className="text-[#8899bb] text-[10px] uppercase tracking-wider">
                                                {item.type === 'book' ? 'বই' : item.type === 'writer' ? 'লেখক' : 'প্রকাশনী'}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                                <button
                                    onClick={handleSearch}
                                    className="w-full py-3 bg-[#111a33]/50 text-[#f0c040] text-xs font-bold hover:bg-[#1a3a8f]/40 transition-all border-t border-blue-800/20"
                                >
                                    সবগুলো ফলাফল দেখুন →
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Stat Badges */}
                <div className="hero-animate-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
                    <div className="px-5 py-2 rounded-full border border-[#c9a84c]/20 bg-[#0d1428]/50 backdrop-blur-sm text-[#c9a84c] flex items-center gap-2">
                        <span className="text-lg">📚</span> ৫০০+ বই
                    </div>
                    <div className="px-5 py-2 rounded-full border border-[#c9a84c]/20 bg-[#0d1428]/50 backdrop-blur-sm text-[#c9a84c] flex items-center gap-2">
                        <span className="text-lg">✍️</span> ১০০+ লেখক
                    </div>
                    <div className="px-5 py-2 rounded-full border border-[#c9a84c]/20 bg-[#0d1428]/50 backdrop-blur-sm text-[#c9a84c] flex items-center gap-2">
                        <span className="text-lg">🏢</span> ৫০+ প্রকাশনী
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ========== 2. Salah Times Widget ========== */
const SalahTimesWidget: React.FC = () => {
    const salahNames: Record<string, string> = {
        Fajr: 'ফজর', Dhuhr: 'যোহর', Asr: 'আসর', Maghrib: 'মাগরিব', Isha: 'ইশা'
    }

    const { data: timings } = useQuery({
        queryKey: ['salah-times'],
        queryFn: async () => {
            const cached = localStorage.getItem('salah-times')
            const today = new Date().toDateString()
            if (cached) {
                const parsed = JSON.parse(cached)
                if (parsed.date === today) return parsed.timings
            }

            let lat = 23.8103, lon = 90.4125
            try {
                const pos = await new Promise<GeolocationPosition>((res, rej) =>
                    navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
                )
                lat = pos.coords.latitude
                lon = pos.coords.longitude
            } catch { /* use default Dhaka */ }

            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=1`)
            const json = await res.json()
            const t = json.data.timings
            localStorage.setItem('salah-times', JSON.stringify({ date: today, timings: t }))
            return t
        },
        staleTime: 24 * 60 * 60 * 1000,
    })

    const nextSalah = useMemo(() => {
        if (!timings) return ''
        const now = new Date()
        const keys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
        for (const k of keys) {
            const [h, m] = timings[k].split(':').map(Number)
            const salahTime = new Date()
            salahTime.setHours(h, m, 0, 0)
            if (salahTime > now) return k
        }
        return 'Fajr'
    }, [timings])

    if (!timings) return (
        <div className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-6">
            <div className="skeleton h-24 w-full" />
        </div>
    )

    return (
        <section className="max-w-7xl mx-auto px-4 my-10">
            <h2 className="text-xl font-bold text-white mb-4">🕌 সালাতের সময়</h2>
            <div className="grid grid-cols-5 gap-3">
                {Object.entries(salahNames).map(([key, name]) => (
                    <div
                        key={key}
                        className={`bg-[#0d1428] rounded-xl border p-4 text-center transition-all ${nextSalah === key
                            ? 'border-[#f0c040] shadow-[0_0_15px_rgba(240,192,64,0.2)]'
                            : 'border-blue-800/40'
                            }`}
                    >
                        <p className={`text-sm font-semibold mb-1 ${nextSalah === key ? 'text-[#f0c040]' : 'text-[#8899bb]'}`}>
                            {name}
                        </p>
                        <p className={`text-lg font-bold ${nextSalah === key ? 'text-[#f0c040]' : 'text-white'}`}>
                            {timings[key]}
                        </p>
                        {nextSalah === key && (
                            <span className="text-[10px] text-[#f0c040] mt-1 block">পরবর্তী ◀</span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}

/* ========== 3.5 New Arrivals ========== */
const NewArrivals: React.FC<BookSectionProps> = ({ onCompareToggle, compareIds }) => {
    const { data: books, isLoading } = useQuery({
        queryKey: ['new-arrivals'],
        queryFn: async () => {
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .order('created_at', { ascending: false })
                .limit(10)
            return data || []
        },
    })

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <h2 className="text-xl font-bold text-white mb-4">🆕 নতুন আসা বই</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="min-w-[200px] max-w-[200px]"><BookCardSkeleton /></div>
                    ))
                    : books?.map((book: any) => (
                        <div key={book.id} className="min-w-[200px] max-w-[200px]">
                            <BookCard
                                book={book}
                                onCompareToggle={onCompareToggle}
                                isCompareSelected={compareIds.includes(book.id)}
                            />
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

/* ========== 3. Featured Books ========== */
interface BookSectionProps {
    onCompareToggle: (id: string) => void
    compareIds: string[]
}

const FeaturedBooks: React.FC<BookSectionProps> = ({ onCompareToggle, compareIds }) => {
    const { data: books, isLoading } = useQuery({
        queryKey: ['featured-books'],
        queryFn: async () => {
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .eq('is_featured', true)
                .limit(10)
            return data || []
        },
    })

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <h2 className="text-xl font-bold text-white mb-4">⭐ ফিচার্ড বই</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="min-w-[200px] max-w-[200px]"><BookCardSkeleton /></div>
                    ))
                    : books?.map((book: any) => (
                        <div key={book.id} className="min-w-[200px] max-w-[200px]">
                            <BookCard
                                book={book}
                                onCompareToggle={onCompareToggle}
                                isCompareSelected={compareIds.includes(book.id)}
                            />
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

/* ========== 4. Hadith of the Day ========== */
const HadithOfTheDay: React.FC = () => {
    const seed = getTodaySeed()
    const hadithNumber = Math.floor(seededRandom(seed) * 7000) + 1

    const { data: hadith } = useQuery({
        queryKey: ['hadith-of-day', seed],
        queryFn: async () => {
            try {
                const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari/${hadithNumber}.json`)
                if (!res.ok) throw new Error('Failed')
                const json = await res.json()
                const h = json.hadiths?.[0]
                if (h) {
                    return {
                        text: typeof h.text === 'string' ? h.text : 'আজকের হাদীস লোড হচ্ছে না',
                        reference: h.reference ? `সহীহ বুখারী, বই ${h.reference.book}, হাদীস ${h.reference.hadith}` : 'সহীহ বুখারী',
                        arabic: '',
                    }
                }
                throw new Error('No hadith')
            } catch {
                return {
                    text: 'যে ব্যক্তি আল্লাহ ও শেষ দিবসের প্রতি ঈমান রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।',
                    reference: 'সহীহ বুখারী',
                    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ'
                }
            }
        },
        staleTime: 24 * 60 * 60 * 1000,
    })

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <h2 className="text-xl font-bold text-white mb-4">📜 হাদীস অফ দ্য ডে</h2>
            <div className="bg-gradient-to-br from-[#1a1500] to-[#0d1428] rounded-xl border border-[#c9a84c]/30 p-6 gold-glow">
                {hadith?.arabic && (
                    <p className="font-arabic text-xl text-[#f0c040] text-right mb-4 leading-relaxed" dir="rtl">
                        {hadith.arabic}
                    </p>
                )}
                <p className="text-white leading-relaxed mb-3">
                    {hadith?.text?.substring(0, 300) || 'লোড হচ্ছে...'}
                </p>
                <p className="text-[#c9a84c] text-sm font-semibold">
                    — {hadith?.reference || 'সহীহ হাদীস'}
                </p>
            </div>
        </section>
    )
}

/* ========== 5. Ayah of the Day ========== */
const AyahOfTheDay: React.FC = () => {
    const seed = getTodaySeed()
    const ayahNumber = Math.floor(seededRandom(seed + 1) * 6236) + 1

    const { data: ayah } = useQuery({
        queryKey: ['ayah-of-day', seed],
        queryFn: async () => {
            try {
                const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,bn.bengali`)
                const json = await res.json()
                if (json.code === 200 && json.data) {
                    return {
                        arabic: json.data[0]?.text || '',
                        bangla: json.data[1]?.text || '',
                        surah: json.data[0]?.surah?.name || '',
                        surahBn: json.data[0]?.surah?.englishName || '',
                        ayahNum: json.data[0]?.numberInSurah || '',
                    }
                }
                throw new Error('API error')
            } catch {
                return {
                    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                    bangla: 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে',
                    surah: 'الفاتحة',
                    surahBn: 'Al-Fatiha',
                    ayahNum: 1,
                }
            }
        },
        staleTime: 24 * 60 * 60 * 1000,
    })

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <h2 className="text-xl font-bold text-white mb-4">📖 আজকের আয়াত</h2>
            <div className="bg-gradient-to-br from-[#0d1a3a] to-[#0d1428] rounded-xl border border-blue-800/40 p-6">
                {ayah && (
                    <>
                        <p className="font-arabic text-2xl text-[#f0c040] text-right mb-4 leading-loose" dir="rtl">
                            {ayah.arabic}
                        </p>
                        <p className="text-white leading-relaxed mb-3">{ayah.bangla}</p>
                        <p className="text-[#8899bb] text-sm">
                            সূরা {ayah.surah} ({ayah.surahBn}) — আয়াত {ayah.ayahNum}
                        </p>
                    </>
                )}
            </div>
        </section>
    )
}

/* ========== 6. Categories Grid ========== */
const CategoriesGrid: React.FC = () => {
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await supabase.from('categories').select('*').order('name').limit(6)
            return data || []
        },
        staleTime: 30 * 60 * 1000,
    })

    const categoryIcons: Record<string, string> = {
        'aqeedah': '🕌', 'tafseer': '📖', 'hadith': '📜', 'fiqh': '⚖️',
        'seerah': '🌙', 'history': '📚', 'default': '📗'
    }

    if (!categories?.length) return null

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <h2 className="text-xl font-bold text-white mb-4">📂 ক্যাটাগরি</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat: any) => (
                    <Link
                        key={cat.id}
                        to={`/books?category=${cat.slug}`}
                        className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-6 text-center hover:border-[#c9a84c]/50 hover:-translate-y-1 transition-all gold-glow"
                    >
                        <span className="text-3xl block mb-2">{categoryIcons[cat.slug] || categoryIcons.default}</span>
                        <span className="text-white font-semibold">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    )
}

/* ========== 7. Featured Writers ========== */
const FeaturedWriters: React.FC = () => {
    const { data: writers } = useQuery({
        queryKey: ['featured-writers'],
        queryFn: async () => {
            const { data } = await supabase.from('authors').select('*').limit(10)
            return data || []
        },
    })

    if (!writers?.length) return null

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <h2 className="text-xl font-bold text-white mb-4">✍️ বিশিষ্ট লেখক</h2>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                {writers.map((w: any) => (
                    <Link key={w.id} to={`/writers/${w.id}`} className="flex flex-col items-center min-w-[100px] group">
                        <div className="w-16 h-16 rounded-full bg-[#1a3a8f] flex items-center justify-center text-2xl text-white mb-2 border-2 border-blue-800/40 group-hover:border-[#f0c040] transition-colors overflow-hidden">
                            {w.avatar ? (
                                <img src={w.avatar} alt={w.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                w.name?.charAt(0) || '✍'
                            )}
                        </div>
                        <span className="text-sm text-[#8899bb] text-center group-hover:text-[#f0c040] transition-colors line-clamp-2">
                            {w.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    )
}

/* ========== 8. Islamic Event Countdown ========== */
const IslamicEventCountdown: React.FC = () => {
    const islamicEvents = [
        { name: 'রমাদান', date: new Date('2026-02-18') },
        { name: 'ঈদুল ফিতর', date: new Date('2026-03-20') },
        { name: 'ঈদুল আযহা', date: new Date('2026-05-27') },
        { name: 'আশুরা', date: new Date('2026-07-06') },
        { name: 'মিলাদুন্নবী', date: new Date('2026-09-04') },
    ]

    const [timeLeft, setTimeLeft] = useState('')

    const nextEvent = useMemo(() => {
        const now = new Date()
        return islamicEvents.find(e => e.date > now) || islamicEvents[0]
    }, [])

    useEffect(() => {
        const update = () => {
            const diff = nextEvent.date.getTime() - Date.now()
            if (diff <= 0) { setTimeLeft('আজ!'); return }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const secs = Math.floor((diff % (1000 * 60)) / 1000)
            setTimeLeft(`${days} দিন ${hours} ঘণ্টা ${mins} মিনিট ${secs} সেকেন্ড`)
        }
        update()
        const interval = setInterval(update, 1000)
        return () => clearInterval(interval)
    }, [nextEvent])

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <h2 className="text-xl font-bold text-white mb-4">🌙 আসন্ন ইসলামী ইভেন্ট</h2>
            <div className="bg-gradient-to-r from-[#1a3a8f]/30 to-[#0d1428] rounded-xl border border-blue-800/40 p-6 text-center">
                <p className="text-[#f0c040] text-2xl font-bold mb-2">{nextEvent.name}</p>
                <p className="text-white text-lg">{timeLeft}</p>
            </div>
        </section>
    )
}

/* ========== 9. Daily Dua ========== */
const DailyDua: React.FC = () => {
    const seed = getTodaySeed()
    const { data: dua } = useQuery({
        queryKey: ['daily-dua', seed],
        queryFn: async () => {
            const { data } = await supabase.from('duas').select('*')
            if (data && data.length > 0) {
                const idx = Math.floor(seededRandom(seed + 2) * data.length)
                return data[idx]
            }
            return {
                arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
                bangla: 'হে আমাদের রব, আমাদের দুনিয়াতে কল্যাণ দিন এবং আখিরাতে কল্যাণ দিন এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করুন।',
                reference: 'সূরা বাকারা: ২০১',
            }
        },
        staleTime: 24 * 60 * 60 * 1000,
    })

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <h2 className="text-xl font-bold text-white mb-4">🤲 আজকের দুআ</h2>
            <div className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-6">
                {dua?.arabic && (
                    <p className="font-arabic text-xl text-[#f0c040] text-right mb-4 leading-relaxed" dir="rtl">
                        {dua.arabic}
                    </p>
                )}
                <p className="text-white leading-relaxed mb-2">{dua?.bangla || 'লোড হচ্ছে...'}</p>
                <p className="text-[#8899bb] text-sm">{dua?.reference || ''}</p>
            </div>
        </section>
    )
}

/* ========== 10. Top 5 Wishlisted ========== */
const TopWishlistedBooks: React.FC<BookSectionProps> = ({ onCompareToggle, compareIds }) => {
    const { data: books } = useQuery({
        queryKey: ['top-wishlisted'],
        queryFn: async () => {
            const { data } = await supabase.rpc('get_top_wishlisted_books', { limit_count: 5 })
            if (data && data.length > 0) return data
            // Fallback: fetch any 5 books
            const { data: fallback } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .limit(5)
            return fallback || []
        },
    })

    if (!books?.length) return null

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">🏆 শীর্ষ ৫ সর্বাধিক উইশলিস্টকৃত বই</h2>
                <Link to="/top-books" className="text-[#3d6bff] text-sm hover:underline">সব দেখুন →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {books.map((book: any, i: number) => (
                    <div key={book.id} className="relative">
                        <span className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-[#f0c040] text-[#0a0f1e] flex items-center justify-center font-bold text-sm">
                            {i + 1}
                        </span>
                        <BookCard
                            book={book}
                            onCompareToggle={onCompareToggle}
                            isCompareSelected={compareIds.includes(book.id)}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

/* ========== 11. Recently Viewed ========== */
const RecentlyViewedBooks: React.FC<BookSectionProps> = ({ onCompareToggle, compareIds }) => {
    const [recentIds, setRecentIds] = useState<string[]>([])

    useEffect(() => {
        const stored = localStorage.getItem('recently-viewed')
        if (stored) setRecentIds(JSON.parse(stored))
    }, [])

    const { data: books } = useQuery({
        queryKey: ['recently-viewed', recentIds],
        queryFn: async () => {
            if (!recentIds.length) return []
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .in('id', recentIds)
            return data || []
        },
        enabled: recentIds.length > 0,
    })

    const clearHistory = useCallback(() => {
        localStorage.removeItem('recently-viewed')
        setRecentIds([])
    }, [])

    if (!books?.length) return null

    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">🕐 সম্প্রতি দেখা বই</h2>
                <button onClick={clearHistory} className="text-red-400 text-sm hover:underline">ইতিহাস মুছুন</button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {books.map((book: any) => (
                    <div key={book.id} className="min-w-[200px] max-w-[200px]">
                        <BookCard
                            book={book}
                            onCompareToggle={onCompareToggle}
                            isCompareSelected={compareIds.includes(book.id)}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

/* ========== 12. All Books Paginated ========== */
const AllBooks: React.FC<BookSectionProps> = ({ onCompareToggle, compareIds }) => {

    const { data, isLoading } = useQuery({
        queryKey: ['homepage-all-books'],
        queryFn: async () => {
            const { data } = await supabase
                .from('books')
                .select(`
                    *,
                    writers:author_id(id, name),
                    publishers:publisher_id(id, name),
                    categories:category_id(id, name, slug)
                `)
                .limit(8)
                .order('created_at', { ascending: false })
            return data || []
        },
    })


    return (
        <section className="max-w-7xl mx-auto px-4 my-12">
            <h2 className="text-xl font-bold text-white mb-4">📚 সকল বই</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)
                    : data?.map((book: any) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onCompareToggle={onCompareToggle}
                            isCompareSelected={compareIds.includes(book.id)}
                        />
                    ))
                }
            </div>
            <div className="flex justify-center mt-8">
                <Link to="/books">
                    <button style={{
                        background: 'transparent',
                        border: '2px solid #c9a84c',
                        color: '#c9a84c',
                        padding: '12px 40px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginTop: '32px',
                        fontFamily: 'Hind Siliguri',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            const target = e.currentTarget as HTMLButtonElement
                            target.style.background = '#c9a84c'
                            target.style.color = '#0a0f1e'
                        }}
                        onMouseLeave={(e) => {
                            const target = e.currentTarget as HTMLButtonElement
                            target.style.background = 'transparent'
                            target.style.color = '#c9a84c'
                        }}>
                        📚 আরও বই দেখুন
                    </button>
                </Link>
            </div>
        </section>
    )
}

/* ========== Main Homepage ========== */
const HomePage: React.FC = () => {
    const { compareIds, toggleCompare } = useCompare()
    return (
        <>
            <Helmet>
                <title>Salafiyyah Library BD — সালাফি জ্ঞানের এক ঠিকানা</title>
                <meta name="description" content="বিশুদ্ধ ইসলামী বই, কুরআন, হাদীস এবং ইসলামী জ্ঞানের সর্ববৃহৎ বাংলা প্ল্যাটফর্ম" />
            </Helmet>
            <HeroSection />
            <FeaturedBookSection />
            <SalahTimesWidget />
            <IslamicQuoteSection />
            <NewArrivals onCompareToggle={toggleCompare} compareIds={compareIds} />
            {/* Featured */}
            <FeaturedBooks onCompareToggle={toggleCompare} compareIds={compareIds} />
            <HadithOfTheDay />
            <AyahOfTheDay />
            <CategoriesGrid />
            <FeaturedWriters />
            <IslamicEventCountdown />
            <DailyDua />
            {/* Top Wishlisted */}
            <TopWishlistedBooks onCompareToggle={toggleCompare} compareIds={compareIds} />
            {/* Recently Viewed */}
            <RecentlyViewedBooks onCompareToggle={toggleCompare} compareIds={compareIds} />
            {/* All Books */}
            <AllBooks onCompareToggle={toggleCompare} compareIds={compareIds} />
        </>
    )
}

/* ===== Featured Book Section ===== */
const FeaturedBookSection: React.FC = () => {
    const { data: book, isLoading } = useQuery({
        queryKey: ['featured-book'],
        queryFn: async () => {
            const { data } = await supabase
                .from('books')
                .select('*, authors:author_id(*), publishers:publisher_id(*), categories:category_id(*)')
                .eq('is_featured', true)
                .limit(1)
                .single()
            return data
        }
    })

    if (isLoading || !book) return null

    return (
        <section className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            <div className="bg-gradient-to-r from-[#1a3a8f]/40 to-[#0a0f1e] rounded-3xl border border-blue-800/40 p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
                    <span className="text-[200px] leading-none">📖</span>
                </div>
                <div className="relative group w-full md:w-1/3">
                    <div className="absolute -inset-4 bg-[#f0c040]/10 rounded-3xl blur-2xl group-hover:bg-[#f0c040]/20 transition-all" />
                    {book.cover_image_url ? (
                        <img
                            src={getFullSizeImage(book.cover_image_url)}
                            alt={book.title}
                            className="relative w-full max-w-[280px] mx-auto rounded-2xl shadow-2xl transform transition-transform group-hover:scale-[1.02] border border-blue-800/20"
                            decoding="async"
                        />
                    ) : (
                        <PlaceholderBook className="max-w-[280px] mx-auto" />
                    )}
                </div>
                <div className="w-full md:w-2/3 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0c040]/10 text-[#f0c040] rounded-full text-sm font-bold border border-[#f0c040]/20">
                        ⭐ সপ্তাহের সেরা বই
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                        {book.title}
                    </h2>
                    <p className="text-xl text-[#c9a84c]">লেখক: {book.authors?.name}</p>
                    <p className="text-[#8899bb] leading-relaxed line-clamp-3 md:line-clamp-4">
                        {book.description || 'বইটি সম্পর্কে বিস্তারিত জানতে নিচে ক্লিক করুন।'}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                            to={`/books/${book.id}`}
                            className="px-8 py-4 bg-[#f0c040] text-[#0a0f1e] rounded-xl font-bold hover:bg-white transition-all shadow-xl shadow-[#f0c040]/10"
                        >
                            বিস্তারিত দেখুন
                        </Link>
                        <Link
                            to="/books"
                            className="px-8 py-4 bg-white/5 text-white rounded-xl font-bold border border-white/10 hover:bg-white/10 transition-all font-bn"
                        >
                            সকল বই
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ===== Islamic Quote Section ===== */
const IslamicQuoteSection: React.FC = () => {
    const quotes = [
        { text: "যে ব্যক্তি আখিরাতকে তার চিন্তা-চেতনার কেন্দ্রবিন্দু বানাবে, আল্লাহ তার অভাব দূর করে দেবেন এবং তার অন্তরকে ধনাঢ্য করে দেবেন।", author: "ইমাম হাসান আল-বাসরী (রহ.)" },
        { text: "আল্লাহর জিকর ছাড়া বেশি কথা বলো না। কারণ আল্লাহর জিকর ছাড়া অধিক কথা অন্তরকে শক্ত করে দেয়।", author: "ইমাম ইবনুল কায়্যিম (রহ.)" },
        { text: "তুমি যখন একাকী থাকো তখন আল্লাহকে ভয় করো। কারণ সে সময়েই মূলত তোমার ঈমানের পরীক্ষা হয়।", author: "ইমাম আহমাদ বিন হাম্বল (রহ.)" },
        { text: "জ্ঞান অর্জনের প্রথম ধাপ হলো চুপ থাকা, দ্বিতীয় ধাপ মনোযোগ দিয়ে শোনা, তৃতীয় ধাপ মনে রাখা।", author: "সুফিয়ান আস-সাওরী (রহ.)" }
    ]
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000)
    const quote = quotes[dayOfYear % quotes.length]

    return (
        <section className="bg-gradient-to-b from-transparent to-[#111a33]/30 py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="text-4xl md:text-5xl text-[#f0c040]/20 mb-8 font-serif leading-none italic">"</div>
                <h2 className="text-xl md:text-3xl font-medium text-white/90 leading-relaxed mb-8 italic">
                    {quote.text}
                </h2>
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-blue-800/40" />
                    <p className="text-[#f0c040] font-semibold tracking-wide">{quote.author}</p>
                    <div className="h-px w-8 bg-blue-800/40" />
                </div>
            </div>
        </section>
    )
}

export default HomePage
