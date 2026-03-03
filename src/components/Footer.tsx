import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#070b17] border-t border-blue-800/30 mt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
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
                        <p className="text-[#8899bb] text-sm leading-relaxed mb-4">
                            সালাফি জ্ঞানের এক ঠিকানা। বিশুদ্ধ ইসলামী বই, কুরআন, হাদীস এবং ইসলামী জ্ঞানের সর্ববৃহৎ বাংলা প্ল্যাটফর্ম।
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs text-[#f0c040] bg-[#111a33] px-3 py-1.5 rounded-lg border border-[#f0c040]/20">
                            <span>📅 {localStorage.getItem('hijri-date') || 'হিজরী ক্যালেন্ডার'}</span>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-[#f0c040] font-semibold mb-6">দ্রুত লিংক</h3>
                        <nav className="grid grid-cols-1 gap-3">
                            <Link to="/books" className="text-sm text-[#8899bb] hover:text-[#f0c040] transition-colors">বই</Link>
                            <Link to="/writers" className="text-sm text-[#8899bb] hover:text-[#f0c040] transition-colors">লেখক</Link>
                            <Link to="/publishers" className="text-sm text-[#8899bb] hover:text-[#f0c040] transition-colors">প্রকাশনী</Link>
                            <Link to="/about" className="text-sm text-[#8899bb] hover:text-[#f0c040] transition-colors">সম্পর্কে</Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-[#f0c040] font-semibold mb-6">যোগাযোগ</h3>
                        <div className="space-y-4">
                            <div className="space-y-3 text-sm text-[#8899bb]">
                                <p className="flex items-center gap-2">
                                    <span>📧</span>
                                    <a href="mailto:kitabsalafibd@gmail.com" className="hover:text-[#f0c040] transition-colors">kitabsalafibd@gmail.com</a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span>🌐</span>
                                    <span>salafiyyahlibrary.com</span>
                                </p>
                            </div>
                            <a
                                href="mailto:kitabsalafibd@gmail.com?subject=ভুল%20রিপোর্ট&body=%E0%A6%AA%E0%A7%87%E0%A6%9C%3A%20%E0%A6%B8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%AF%E0%A6%BE%3A%0A"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                            >
                                <button
                                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    <span>🐛</span> বাগ রিপোর্ট করুন
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-blue-800/20 text-center">
                    <p className="text-sm text-[#8899bb] mb-2">
                        © ২০২৬ Salafiyyah Library BD — সকল স্বত্ব সংরক্ষিত
                    </p>
                    <p className="text-xs text-[#8899bb] flex items-center justify-center gap-1">
                        Made with <span className="text-red-500 text-lg">❤️</span> for the Ummah
                    </p>
                    <div className="mt-4 flex justify-center gap-4">
                        <a
                            href="https://www.facebook.com/profile.php?id=61585042973644"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8899bb] hover:text-[#1877F2] transition-colors text-xl"
                            title="Facebook"
                        >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default React.memo(Footer)
