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
    const [mobileOpen, setMobileOpen] = useState(false)
    const [moreOpen, setMoreOpen] = useState(false)
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
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
                setMoreOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const handleClick = () => {
            if (mobileOpen) setMobileOpen(false)
        }
        document.addEventListener('touchstart', handleClick)
        return () => document.removeEventListener('touchstart', handleClick)
    }, [mobileOpen])

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
                            onClick={() => setMoreOpen(!moreOpen)}
                            onMouseEnter={() => setMoreOpen(true)}
                            className="text-sm font-medium text-[#8899bb] hover:text-[#f0c040] transition-colors flex items-center gap-1"
                        >
                            আরও ▾
                        </button>
                        {moreOpen && (
                            <div
                                className="absolute left-0 top-full pt-2 w-56"
                                onMouseLeave={() => setMoreOpen(false)}
                            >
                                <div className="bg-[#0d1428] border border-blue-800/40 rounded-xl shadow-2xl overflow-hidden py-2">
                                    {moreLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setMoreOpen(false)}
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

                    {/* Mobile hamburger button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        {mobileOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile menu panel */}
            <div style={{
                position: 'fixed',
                top: '60px',
                left: 0,
                right: 0,
                bottom: 0,
                background: '#0a0f1e',
                zIndex: 999,
                padding: '20px',
                display: mobileOpen ? 'flex' : 'none',
                flexDirection: 'column',
                gap: '8px',
                overflowY: 'auto'
            }}>
                <style>
                    {`
                    .mobile-nav-link {
                        display: block;
                        padding: 14px 16px;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-size: 16px;
                        border-bottom: 1px solid #1a3a8f;
                        transition: all 0.2s;
                    }
                    .mobile-nav-link:hover, .mobile-nav-link:active {
                        background: #1a3a8f;
                    }
                    `}
                </style>
                <Link to="/books" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    📚 বই
                </Link>
                <Link to="/writers" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    ✍️ লেখক
                </Link>
                <Link to="/publishers" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    🏢 প্রকাশনী
                </Link>
                <Link to="/ai" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    🤖 AI সহকারী
                </Link>

                <div style={{ borderBottom: '1px solid #1a3a8f66', margin: '8px 0' }} />

                <p style={{ color: '#c9a84c', fontSize: '12px', marginTop: '8px', paddingLeft: '16px' }}>
                    আরও পেজ
                </p>

                <Link to="/quran" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    📖 আল-কুরআন
                </Link>
                <Link to="/hadith" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    📜 হাদীস
                </Link>
                <Link to="/salah" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    🕌 সালাতের সময়
                </Link>
                <Link to="/dua" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    🤲 দৈনিক দুআ
                </Link>
                <Link to="/asmaul-husna" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    ☪️ আসমাউল হুসনা
                </Link>
                <Link to="/events" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    🗓️ ইসলামিক ইভেন্ট
                </Link>
                <Link to="/top-books" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    🏆 শীর্ষ বই
                </Link>
                <Link to="/quiz" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    ❓ ইসলামিক কুইজ
                </Link>
                <Link to="/about" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                    ℹ️ সম্পর্কে
                </Link>

                {user ? (
                    <button
                        onClick={() => { signOut(); setMobileOpen(false) }}
                        className="mobile-nav-link text-red-400 w-full text-left"
                    >
                        🚪 লগআউট
                    </button>
                ) : (
                    <div className="flex flex-col gap-3 mt-4">
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="mobile-nav-link text-center border-blue-800">
                            লগইন
                        </Link>
                        <Link to="/register" onClick={() => setMobileOpen(false)} className="mobile-nav-link text-center bg-[#1a3a8f] border-none">
                            রেজিস্টার
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}

export default React.memo(Navbar)

