import React from 'react'
import { Link } from 'react-router-dom'

const footerLinks = [
    { label: 'বই', to: '/books' },
    { label: 'কুরআন', to: '/quran' },
    { label: 'হাদীস', to: '/hadith' },
    { label: 'সালাতের সময়', to: '/salah' },
    { label: 'আসমাউল হুসনা', to: '/asmaul-husna' },
    { label: 'দুআ', to: '/dua' },
    { label: 'শীর্ষ বই', to: '/top-books' },
]

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#070b17] border-t border-blue-800/30 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">📖</span>
                            <span className="text-xl font-bold text-[#f0c040]">Salafiyyah Library BD</span>
                        </Link>
                        <p className="text-[#8899bb] text-sm leading-relaxed mb-4">
                            সালাফি জ্ঞানের এক ঠিকানা। বিশুদ্ধ ইসলামী বই, কুরআন, হাদীস এবং ইসলামী জ্ঞানের সর্ববৃহৎ বাংলা প্ল্যাটফর্ম।
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs text-[#f0c040] bg-[#111a33] px-3 py-1.5 rounded-lg border border-[#f0c040]/20">
                            <span>📅 {localStorage.getItem('hijri-date') || 'হিজরী ক্যালেন্ডার'}</span>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-[#f0c040] font-semibold mb-4">দ্রুত লিংক</h3>
                        <nav className="grid grid-cols-2 gap-2">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-sm text-[#8899bb] hover:text-[#f0c040] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-[#f0c040] font-semibold mb-4">যোগাযোগ</h3>
                        <div className="space-y-4">
                            <div className="space-y-2 text-sm text-[#8899bb]">
                                <p>📧 <a href="mailto:kitabsalafibd@gmail.com" className="hover:text-[#f0c040] transition-colors">kitabsalafibd@gmail.com</a></p>
                                <p>🌐 salafiyyahlibrary.com</p>
                            </div>
                            <a
                                href={`mailto:kitabsalafibd@gmail.com?subject=ভুল রিপোর্ট&body=পেজ: ${window.location.href}%0Aসমস্যা:%0A`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    ⚠️ ভুল রিপোর্ট করুন
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-blue-800/20 text-center text-sm text-[#8899bb]">
                    © ২০২৫ Salafiyyah Library BD — সকল স্বত্ব সংরক্ষিত
                </div>
            </div>
        </footer>
    )
}

export default React.memo(Footer)
