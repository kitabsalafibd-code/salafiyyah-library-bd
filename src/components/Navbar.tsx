import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import NotificationBell from './NotificationBell'

const navLinks = [
    { label: 'বই', to: '/books' },
    { label: 'লেখক', to: '/writers' },
    { label: 'প্রকাশনী', to: '/publishers' },
    { label: 'শীর্ষ বই', to: '/top-books' },
    { label: 'AI সহকারী', to: '/ai' },
]

const Navbar: React.FC = () => {
    const { user, signOut } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [theme, setTheme] = useState<'dark' | 'light'>(localStorage.getItem('theme') as 'dark' | 'light' || 'dark')
    const [hijriDate, setHijriDate] = useState<string>(localStorage.getItem('hijri-date') || '')
    const location = useLocation()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await supabase.from('categories').select('*').order('name')
            return data || []
        },
        staleTime: 30 * 60 * 1000,
    })

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Theme logic
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

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
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <span className="text-2xl">📖</span>
                    <span className="text-lg md:text-xl font-bold text-[#f0c040] whitespace-nowrap">
                        Salafiyyah Library BD
                    </span>
                </Link>

                {/* Center: Hijri Date (Desktop) */}
                <div className="hidden lg:flex items-center gap-2 text-xs text-[#8899bb] bg-[#111a33] px-3 py-1.5 rounded-full border border-blue-800/20">
                    <span className="text-base">📅</span>
                    <span>{hijriDate || 'লোড হচ্ছে...'}</span>
                </div>

                {/* Spacer to push right items */}
                <div className="flex-1" />

                {/* Right side */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#111a33] border border-blue-800/30 text-[#f0c040] hover:bg-[#1a3a8f] transition-all"
                        title={theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {user ? (
                        <>
                            {/* Notification bell */}
                            <NotificationBell />
                            {/* Avatar dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-9 h-9 rounded-full bg-[#1a3a8f] flex items-center justify-center text-white font-bold text-sm hover:bg-[#2952cc] transition-colors"
                                >
                                    {userInitial}
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 top-12 w-48 bg-[#0d1428] border border-blue-800/40 rounded-xl shadow-2xl overflow-hidden">
                                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-sm hover:bg-[#1a3a8f]/30 transition-colors">
                                            📊 ড্যাশবোর্ড
                                        </Link>
                                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-sm hover:bg-[#1a3a8f]/30 transition-colors">
                                            ❤️ উইশলিস্ট
                                        </Link>
                                        <button
                                            onClick={() => { signOut(); setDropdownOpen(false) }}
                                            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            🚪 লগআউট
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
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
                        className="md:hidden text-[#8899bb] hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Nav links - desktop */}
            <nav className="hidden md:block border-t border-blue-800/20">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="px-3 py-1.5 text-sm text-[#8899bb] hover:text-[#f0c040] whitespace-nowrap transition-colors rounded-lg hover:bg-[#1a3a8f]/20"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Category pills - Only show on home page to avoid duplicates on /books */}
            {categories && categories.length > 0 && location.pathname === '/' && (
                <div className="border-t border-blue-800/20 overflow-x-auto scrollbar-hide">
                    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
                        {categories.map((cat: any) => (
                            <Link
                                key={cat.id}
                                to={`/books?category=${cat.slug}`}
                                className="category-pill px-3 py-1 text-xs bg-[#1a3a8f]/30 text-[#8899bb] rounded-full border border-blue-800/30 hover:text-white whitespace-nowrap"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0a0f1e] border-t border-blue-800/30 px-4 py-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-[#8899bb] hover:text-[#f0c040] rounded-lg hover:bg-[#1a3a8f]/20 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}

export default React.memo(Navbar)
