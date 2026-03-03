import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from './LoginModal'

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [extraOpen, setExtraOpen] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()

    const links = [
        { to: '/books', label: '📚 বই' },
        { to: '/writers', label: '✍️ লেখক' },
        { to: '/publishers', label: '🏢 প্রকাশনী' },
        { to: '/quran', label: '📖 কুরআন' },
        { to: '/hadith', label: '📜 হাদীস' },
        { to: '/salah', label: '🕌 সালাত' },
        { to: '/dua', label: '🤲 দুআ' },
        { to: '/asmaul-husna', label: '✨ আসমাউল হুসনা' },
        { to: '/top-books', label: '🏆 শীর্ষ বই' },
        { to: '/ai', label: '🤖 AI সহকারী' },
        { to: '/about', label: 'ℹ️ সম্পর্কে' },
    ]

    const extraLinks = [
        { to: '/quran', label: '📖 কুরআন' },
        { to: '/hadith', label: '📋 হাদীস' },
        { to: '/salah', label: '🕌 সালাত' },
        { to: '/dua', label: '🤲 দুআ' },
        { to: '/asmaul-husna', label: '✨ আসমাউল হুসনা' },
    ]

    const handleAiClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault()
            setShowLoginModal(true)
        }
    }

    return (
        <>
            <nav style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                height: '60px',
                background: '#0a0f1e',
                borderBottom: '1px solid #1a3a8f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                zIndex: 1000
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none'
                }}>
                    <img
                        src="/logo.png"
                        alt="Salafiyyah Library BD"
                        style={{
                            height: '56px',
                            width: 'auto',
                            marginRight: '8px'
                        }}
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                </Link>

                {/* Center - Nav links */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center'
                }} className="desktop-nav">
                    {[
                        { path: 'books', label: 'বই' },
                        { path: 'writers', label: 'লেখক' },
                        { path: 'publishers', label: 'প্রকাশনী' },
                        { path: 'top-books', label: 'শীর্ষ বই' },
                        { path: 'about', label: 'সম্পর্কে' },
                        { path: 'ai', label: 'AI সহকারী' }
                    ].map((item) => (
                        <motion.div
                            key={item.path}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to={`/${item.path}`}
                                onClick={item.path === 'ai' ? handleAiClick : undefined}
                                style={{ color: 'white', textDecoration: 'none', fontSize: '14px', whiteSpace: 'nowrap' }}
                                className="nav-link"
                            >
                                {item.label}
                            </Link>
                        </motion.div>
                    ))}

                    {/* Extra Links Button (Desktop) */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setExtraOpen(!extraOpen)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '18px',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            ☰
                        </button>

                        <AnimatePresence>
                            {extraOpen && (
                                <>
                                    <div
                                        style={{ position: 'fixed', inset: 0, zIndex: -1 }}
                                        onClick={() => setExtraOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '12px',
                                            background: '#0a1628',
                                            border: '1px solid rgba(201,168,76,0.3)',
                                            borderRadius: '12px',
                                            padding: '8px',
                                            minWidth: '180px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                            zIndex: 1001
                                        }}
                                    >
                                        {extraLinks.map(link => (
                                            <Link
                                                key={link.to}
                                                to={link.to}
                                                onClick={() => setExtraOpen(false)}
                                                style={{
                                                    display: 'block',
                                                    padding: '10px 16px',
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    borderRadius: '8px',
                                                    transition: 'background 0.2s'
                                                }}
                                                className="hover:bg-[#c9a84c]/10"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right side icons */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <Link to="/dashboard" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '20px'
                    }}>👤</Link>

                    {/* Hamburger - only on mobile */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="hamburger"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '4px',
                            lineHeight: 1
                        }}>
                        {open ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            {/* Mobile dropdown menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: '60px',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: '#0a1628',
                            zIndex: 999,
                            overflowY: 'auto',
                            padding: '16px'
                        }}
                    >
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={(e) => {
                                    if (link.to === '/ai') {
                                        handleAiClick(e as any)
                                        if (!user) return
                                    }
                                    setOpen(false)
                                }}
                                style={{
                                    display: 'block',
                                    padding: '16px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderBottom: '1px solid #1a3a8f',
                                    fontSize: '16px'
                                }}>
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />

            {/* Spacer for fixed navbar */}
            <div style={{ height: '60px' }} />
        </>
    )
}

