import React from 'react'
import { Helmet } from 'react-helmet-async'

const AboutPage: React.FC = () => {
    return (
        <>
            <Helmet><title>এই ওয়েবসাইট সম্পর্কে — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-4xl mx-auto px-4 py-16 container page-content" style={{ overflowX: 'hidden' }}>
                <h1 className="text-3xl font-bold text-center text-white mb-12 section-title">এই ওয়েবসাইট সম্পর্কে</h1>

                {/* Section 1 — নির্মাতার পরিচয় */}
                <section className="mb-12 section">
                    <div className="bg-[#0d1428] border border-[#c9a84c] rounded-2xl p-8 text-center gold-glow creator-card">
                        <h2 className="text-[#f0c040] text-xl font-bold mb-4">নির্মাতা</h2>
                        <p className="text-2xl font-bold text-white mb-1">Mishkatur Rahman Zahin</p>
                        <p className="text-[#8899bb]">SSC 2026 ব্যাচ | সিলেট</p>
                        <p className="text-[#f0c040] text-sm mt-2">📧 zahin.pilot2009@gmail.com</p>
                    </div>
                </section>

                {/* Section 2 — ওয়েবসাইট সম্পর্কে */}
                <section className="mb-12 text-center">
                    <p className="text-[#8899bb] text-lg leading-relaxed">
                        এই ওয়েবসাইটটি সম্পূর্ণ AI এর সাহায্যে তৈরি করা হয়েছে। <br />
                        এটি বাংলাদেশের মুসলিম ভাই-বোনদের জন্য উন্মুক্ত এবং <br />
                        সম্পূর্ণ বিনামূল্যে। উম্মাহর কল্যাণের জন্য এই ক্ষুদ্র <br />
                        প্রচেষ্টা। আল্লাহ কবুল করুন। আমীন।
                    </p>
                </section>

                {/* Section 3 — নিরাপত্তা */}
                <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 info-grid">
                    <div className="bg-[#0d1428] border border-blue-800/30 rounded-xl p-6 info-card">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <span>🔒</span> এই ওয়েবসাইট সম্পূর্ণ নিরাপদ
                        </h3>
                        <ul className="text-[#8899bb] text-sm space-y-2">
                            <li>• Supabase দ্বারা সুরক্ষিত ডেটাবেস</li>
                            <li>• Row Level Security (RLS) সক্রিয়</li>
                            <li>• HTTPS এনক্রিপশন</li>
                            <li>• আপনার ব্যক্তিগত তথ্য সুরক্ষিত</li>
                        </ul>
                    </div>

                    {/* Section 4 — উন্নয়ন অবস্থা */}
                    <div style={{
                        background: '#1a1500',
                        border: '1px solid #c9a84c',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        marginBottom: '24px',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '16px',
                        alignItems: 'flex-start',
                        width: '100%',
                        boxSizing: 'border-box'
                    }} className="dev-status-card">
                        <span style={{
                            fontSize: '32px',
                            flexShrink: 0
                        }}>🚧</span>
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                color: '#c9a84c',
                                margin: '0 0 8px 0',
                                fontSize: '18px'
                            }}>
                                ওয়েবসাইটটি নির্মাণাধীন
                            </h3>
                            <p style={{
                                color: '#d4b86a',
                                margin: '0 0 8px 0',
                                lineHeight: '1.7',
                                fontSize: '15px'
                            }}>
                                এই ওয়েবসাইটটি ক্রমাগত উন্নত
                                করা হচ্ছে। আমি একা এই প্রজেক্টে
                                কাজ করছি, তাই সময় একটু বেশি
                                লাগছে — আপনাদের ধৈর্যের জন্য
                                আন্তরিক ধন্যবাদ। 🙏
                            </p>
                            <p style={{
                                color: '#8899bb',
                                margin: 0,
                                fontSize: '14px'
                            }}>
                                নতুন বই, লেখক ও ফিচার নিয়মিত
                                যোগ করা হচ্ছে। আবার আসুন! ✨
                            </p>
                        </div>
                    </div>

                    {/* Section 5 — বাগ রিপোর্ট */}
                    <div className="bg-[#0d1428] border border-blue-800/30 rounded-xl p-6 info-card">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <span>🐛</span> বাগ রিপোর্ট
                        </h3>
                        <p className="text-[#8899bb] text-sm mb-4">
                            ওয়েবসাইটটি ক্রমাগত উন্নত হচ্ছে। কোনো সমস্যা বা ভুল পেলে আমাদের জানান:
                        </p>
                        <a
                            href="mailto:zahin.pilot2009@gmail.com?subject=Salafiyyah%20Library%20BD%20%E2%80%94%20%E0%A6%AC%E0%A6%BE%E0%A6%97%20%E0%A6%B0%E0%A6%BF%E0%A6%AA%E0%A7%8B%E0%A6%B0%E0%A7%8D%E0%A6%9F&body=%E0%A6%B8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B0%20%E0%A6%AC%E0%A6%BF%E0%A6%AC%E0%A6%B0%E0%A6%A3%3A%0A%0A%E0%A6%AA%E0%A7%87%E0%A6%9C%20URL%3A%0A"
                            className="inline-block w-full py-3 bg-[#1a3a8f] text-white text-center font-bold rounded-lg hover:bg-[#2952cc] transition-colors"
                        >
                            📧 ইমেইল করুন
                        </a>
                    </div>
                </section>

                {/* Section 6 — ক্রেডিট */}
                <section className="text-center bg-[#111a33]/50 rounded-xl p-6 border border-blue-800/20 tech-section mb-12">
                    <h3 className="text-[#f0c040] font-bold mb-4">তৈরিতে ব্যবহৃত প্রযুক্তি</h3>
                    <p className="text-sm text-[#8899bb] mb-2 uppercase tracking-widest">
                        React | TypeScript | Supabase | Tailwind CSS
                    </p>
                    <p className="text-xs text-[#8899bb]">
                        Powered by AI (Anthropic Claude + Google Gemini)
                    </p>
                </section>

                {/* Section 7 — তথ্যসূত্র ও কৃতজ্ঞতা */}
                <section style={{
                    padding: '40px 16px',
                    maxWidth: '900px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
                }} className="sources-section">
                    <h2 style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 'clamp(20px, 5vw, 28px)',
                        marginBottom: '8px'
                    }}>
                        📚 তথ্যসূত্র ও কৃতজ্ঞতা
                    </h2>

                    <p style={{
                        color: '#8899bb',
                        textAlign: 'center',
                        marginBottom: '32px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        padding: '0 8px'
                    }}>
                        এই ওয়েবসাইটে বইয়ের তথ্য, প্রচ্ছদ ছবি
                        এবং মূল্য সংগ্রহ করা হয়েছে নিচের
                        নির্ভরযোগ্য উৎস থেকে:
                    </p>

                    {/* 3 cards - responsive grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px',
                        width: '100%'
                    }} className="sources-grid">

                        {/* Card 1 - Rokomari */}
                        <div style={{
                            background: '#0d1428',
                            border: '1px solid #c9a84c',
                            borderRadius: '12px',
                            padding: '24px 16px',
                            textAlign: 'center',
                            transition: 'box-shadow 0.3s ease',
                            cursor: 'default'
                        }}
                            className="source-card"
                            onMouseEnter={e =>
                                e.currentTarget.style.boxShadow =
                                '0 0 20px rgba(201,168,76,0.3)'}
                            onMouseLeave={e =>
                                e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{
                                fontSize: '40px',
                                marginBottom: '12px'
                            }}>🛒</div>
                            <h3 style={{
                                color: '#c9a84c',
                                margin: '0 0 8px 0',
                                fontSize: '18px'
                            }}>রকমারি</h3>
                            <p style={{
                                color: '#8899bb',
                                fontSize: '14px',
                                margin: '0 0 16px 0',
                                lineHeight: '1.6'
                            }}>
                                বাংলাদেশের সবচেয়ে বড়
                                অনলাইন বইয়ের দোকান
                            </p>

                            <a
                                href="https://www.rokomari.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    background: 'transparent',
                                    border: '1px solid #c9a84c',
                                    color: '#c9a84c',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontSize: '14px'
                                }}>
                                rokomari.com ↗
                            </a>
                        </div>

                        {/* Card 2 - Wafilife */}
                        <div style={{
                            background: '#0d1428',
                            border: '1px solid #c9a84c',
                            borderRadius: '12px',
                            padding: '24px 16px',
                            textAlign: 'center',
                            transition: 'box-shadow 0.3s ease',
                            cursor: 'default'
                        }}
                            className="source-card"
                            onMouseEnter={e =>
                                e.currentTarget.style.boxShadow =
                                '0 0 20px rgba(201,168,76,0.3)'}
                            onMouseLeave={e =>
                                e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{
                                fontSize: '40px',
                                marginBottom: '12px'
                            }}>📗</div>
                            <h3 style={{
                                color: '#c9a84c',
                                margin: '0 0 8px 0',
                                fontSize: '18px'
                            }}>ওয়াফিলাইফ</h3>
                            <p style={{
                                color: '#8899bb',
                                fontSize: '14px',
                                margin: '0 0 16px 0',
                                lineHeight: '1.6'
                            }}>
                                বিশ্বস্ত ইসলামিক বই
                                ও পণ্যের অনলাইন শপ
                            </p>

                            <a
                                href="https://www.wafilife.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    background: 'transparent',
                                    border: '1px solid #c9a84c',
                                    color: '#c9a84c',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontSize: '14px'
                                }}>
                                wafilife.com ↗
                            </a>
                        </div>

                        {/* Card 3 - Sunnah Book Shop */}
                        <div style={{
                            background: '#0d1428',
                            border: '1px solid #c9a84c',
                            borderRadius: '12px',
                            padding: '24px 16px',
                            textAlign: 'center',
                            transition: 'box-shadow 0.3s ease',
                            cursor: 'default'
                        }}
                            className="source-card"
                            onMouseEnter={e =>
                                e.currentTarget.style.boxShadow =
                                '0 0 20px rgba(201,168,76,0.3)'}
                            onMouseLeave={e =>
                                e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{
                                fontSize: '40px',
                                marginBottom: '12px'
                            }}>📘</div>
                            <h3 style={{
                                color: '#c9a84c',
                                margin: '0 0 8px 0',
                                fontSize: '18px'
                            }}>Sunnah Book Shop</h3>
                            <p style={{
                                color: '#8899bb',
                                fontSize: '14px',
                                margin: '0 0 16px 0',
                                lineHeight: '1.6'
                            }}>
                                ফেসবুকভিত্তিক
                                ইসলামিক বইয়ের পেজ
                            </p>

                            <a
                                href="https://www.facebook.com/sunnahbookshop"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    background: 'transparent',
                                    border: '1px solid #c9a84c',
                                    color: '#c9a84c',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontSize: '14px'
                                }}>
                                Facebook Page ↗
                            </a>
                        </div>
                    </div>

                    {/* Disclaimer note */}
                    <div style={{
                        background: '#0d1428',
                        border: '1px solid #1a3a8f',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center'
                    }} className="disclaimer-card">
                        <p style={{
                            color: '#8899bb',
                            fontSize: '13px',
                            margin: 0,
                            lineHeight: '1.7'
                        }}>
                            ⚠️ <strong style={{ color: '#c9a84c' }}>
                                দ্রষ্টব্য:</strong> এই ওয়েবসাইট
                            উপরোক্ত প্রতিষ্ঠানের সাথে কোনোভাবে
                            সম্পৃক্ত নয়। শুধুমাত্র
                            তথ্যসংগ্রহের উদ্দেশ্যে
                            উল্লেখ করা হয়েছে।
                        </p>
                    </div>
                </section>
            </div>
        </>
    )
}

export default AboutPage
