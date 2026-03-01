import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const [open, setOpen] = useState(false)

    const links = [
        { to: '/books', label: '📚 বই' },
        { to: '/writers', label: '✍️ লেখক' },
        { to: '/publishers', label: '🏢 প্রকাশনী' },
        { to: '/quran', label: '📖 কুরআন' },
        { to: '/hadith', label: '📜 হাদীস' },
        { to: '/salah', label: '🕌 সালাত' },
        { to: '/dua', label: '🤲 দুআ' },
        { to: '/asmaul-husna', label: '☪️ আসমাউল হুসনা' },
        { to: '/events', label: '🗓️ ইভেন্ট' },
        { to: '/top-books', label: '🏆 শীর্ষ বই' },
        { to: '/ai', label: '🤖 AI সহকারী' },
        { to: '/about', label: 'ℹ️ সম্পর্কে' },
    ]

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
                    textDecoration: 'none',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px'
                }}>
                    📖 Salafiyyah Library BD
                </Link>

                {/* Center - Nav links */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'center'
                }} className="desktop-nav">
                    <Link to="/books"
                        style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}
                        className="nav-link">বই</Link>
                    <Link to="/writers"
                        style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}
                        className="nav-link">লেখক</Link>
                    <Link to="/publishers"
                        style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}
                        className="nav-link">প্রকাশনী</Link>
                    <Link to="/ai"
                        style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}
                        className="nav-link">AI সহকারী</Link>
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
            {open && (
                <div style={{
                    position: 'fixed',
                    top: '60px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#0a0f1e',
                    zIndex: 999,
                    overflowY: 'auto',
                    padding: '16px'
                }}>
                    {links.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setOpen(false)}
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
                </div>
            )}

            {/* Spacer for fixed navbar */}
            <div style={{ height: '60px' }} />
        </>
    )
}
