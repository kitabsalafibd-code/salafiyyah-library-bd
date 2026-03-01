import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NotificationBell from './NotificationBell'

const mainLinks = [
    { label: 'বই', to: '/books' },
    { label: 'লেখক', to: '/writers' },
    { label: 'প্রকাশনী', to: '/publishers' },
]

const moreLinks = [
    { label: '📖 আল-কুরআন', to: '/quran' },
    { label: '📜 হাদীস', to: '/hadith' },
    { label: '🕌 সালাতের সময়', to: '/salah' },
    { label: '🤲 দৈনিক দুআ', to: '/dua' },
    { label: '☪️ আসমাউল হুসনা', to: '/asmaul-husna' },
    { label: '🗓️ ইসলামিক ইভেন্ট', to: '/events' },
    { label: '🏆 শীর্ষ বই', to: '/top-books' },
    { label: 'সম্পর্কে', to: '/about' },
]

const Navbar: React.FC = () => {
    const { user, signOut } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)
    const [mobileMoreOpen, setMobileMoreOpen] = useState(false)
    const [hijriDate, setHijriDate] = useState<string>(localStorage.getItem('hijri-date') || '')
    const [logoExists, setLogoExists] = useState(false)
    const userDropdownRef = useRef<HTMLDivElement>(null)
    const moreDropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
                setUserDropdownOpen(false)
            }
            if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
                setMoreDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Logo check
    useEffect(() => {
        const img = new Image()
        img.src = '/logo.png'
        img.onload = () => setLogoExists(true)
        img.onerror = () => setLogoExists(false)
    }, [])

    // Hijri Date logic
    useEffect(() => {
        const cached = localStorage.getItem('hijri-cached-date')
        const todayStr = new Date().toDateString()
        if (cached === todayStr && hijriDate) return

        const today = new Date()
        const day = today.getDate().toString().padStart(2, '0')
        const month = (today.getMonth() + 1).toString().padStart(2, '0')
        const year = today.getFullYear()
        const url = `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`

        fetch(url)
            .then(res => res.json())
            .then(json => {
                if (json.data && json.data.hijri) {
                    const h = json.data.hijri
                    const dateStr = `${h.year} হিজরি, ${h.month.ar}`
                    setHijriDate(dateStr)
                    localStorage.setItem('hijri-date', dateStr)
                    localStorage.setItem('hijri-cached-date', todayStr)
                }
            })
            .catch(err => console.error('Hijri fetch error:', err))
    }, [hijriDate])

    const userInitial = useMemo(() => {
        if (!user) return ''
        const name = user.user_metadata?.full_name || user.email || ''
        return name.charAt(0).toUpperCase()
    }, [user])

    return (
        <header className="sticky top-0 z-50 bg-[#0a0f1e]/95 backdrop-blur-md border-b border-blue-800/30">
            {/* Main navbar */}
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* Logo + site name */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    {logoExists ? (
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                    ) : (
                        <span className="text-2xl">📖</span>
                    )}
                    <span className="text-lg md:text-xl font-bold text-[#f0c040] whitespace-nowrap">
                        Salafiyyah Library BD
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
                    {mainLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-sm font-medium text-[#8899bb] hover:text-[#f0c040] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="relative" ref={moreDropdownRef}>
                        <button
                            onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                            onMouseEnter={() => setMoreDropdownOpen(true)}
                            className="text-sm font-medium text-[#8899bb] hover:text-[#f0c040] transition-colors flex items-center gap-1"
                        >
                            আরও ▾
                        </button>
                        {moreDropdownOpen && (
                            <div
                                className="absolute left-0 top-full pt-2 w-56"
                                onMouseLeave={() => setMoreDropdownOpen(false)}
                            >
                                <div className="bg-[#0d1428] border border-blue-800/40 rounded-xl shadow-2xl overflow-hidden py-2">
                                    {moreLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setMoreDropdownOpen(false)}
                                            className="block px-4 py-2.5 text-sm text-[#8899bb] hover:text-[#f0c040] hover:bg-[#1a3a8f]/30 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/ai"
                        className="text-sm font-medium text-[#8899bb] hover:text-[#f0c040] transition-colors"
                    >
                        AI সহকারী
                    </Link>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Hijri Date (Desktop) */}
                    <div className="hidden xl:flex items-center gap-2 text-xs text-[#8899bb] bg-[#111a33] px-3 py-1.5 rounded-full border border-blue-800/20">
                        <span className="text-base">📅</span>
                        <span>{hijriDate || 'লোড হচ্ছে...'}</span>
                    </div>

                    {user ? (
                        <>
                            <NotificationBell />
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="w-9 h-9 rounded-full bg-[#1a3a8f] flex items-center justify-center text-white font-bold text-sm hover:bg-[#2952cc] transition-colors"
                                >
                                    {userInitial}
                                </button>
                                {userDropdownOpen && (
                                    <div className="absolute right-0 top-12 w-48 bg-[#0d1428] border border-blue-800/40 rounded-xl shadow-2xl overflow-hidden">
                                        <Link to="/dashboard" onClick={() => setUserDropdownOpen(false)} className="block px-4 py-3 text-sm hover:bg-[#1a3a8f]/30 transition-colors">
                                            📊 ড্যাশবোর্ড
                                        </Link>
                                        <Link to="/dashboard" onClick={() => setUserDropdownOpen(false)} className="block px-4 py-3 text-sm hover:bg-[#1a3a8f]/30 transition-colors">
                                            ❤️ উইশলিস্ট
                                        </Link>
                                        <button
                                            onClick={() => { signOut(); setUserDropdownOpen(false) }}
                                            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            🚪 লগআউট
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/login" className="px-4 py-2 text-sm text-[#8899bb] hover:text-white transition-colors">
                                লগইন
                            </Link>
                            <Link to="/register" className="px-4 py-2 text-sm bg-[#1a3a8f] hover:bg-[#2952cc] rounded-lg transition-colors">
                                রেজিস্টার
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-[#8899bb] hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0a0f1e] border-t border-blue-800/30 fixed inset-x-0 top-[65px] bottom-0 z-40 overflow-y-auto pb-20">
                    <div className="px-6 py-8 space-y-4">
                        {mainLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-lg font-medium text-[#8899bb] hover:text-[#f0c040] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="space-y-4">
                            <button
                                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                                className="w-full flex items-center justify-between text-lg font-medium text-[#8899bb] hover:text-[#f0c040] transition-colors"
                            >
                                <span>আরও</span>
                                <span>{mobileMoreOpen ? '▴' : '▾'}</span>
                            </button>
                            {mobileMoreOpen && (
                                <div className="pl-4 space-y-4 border-l border-blue-800/20">
                                    {moreLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-base text-[#8899bb] hover:text-[#f0c040] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            to="/ai"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-lg font-medium text-[#8899bb] hover:text-[#f0c040] transition-colors"
                        >
                            AI সহকারী
                        </Link>

                        {!user && (
                            <div className="pt-8 flex flex-col gap-4">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-3 text-center rounded-xl border border-blue-800/30 text-[#8899bb] hover:text-white transition-colors"
                                >
                                    লগইন
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-3 text-center rounded-xl bg-[#1a3a8f] hover:bg-[#2952cc] text-white transition-colors"
                                >
                                    রেজিস্টার
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default React.memo(Navbar)

