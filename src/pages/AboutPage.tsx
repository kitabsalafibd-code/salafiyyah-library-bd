import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

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

                {/* Section 8 — সালাফিয়্যাহ লাইব্রেরি বিডি সম্পর্কে বিস্তারিত */}
                <AboutLibraryContent />
            </div>
        </>
    )
}

const AboutLibraryContent: React.FC = () => {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Salafiyyah Library BD",
        "url": "https://salafiyyah-library-bd.netlify.app/",
        "description": "সালাফিয়্যাহ লাইব্রেরি বিডি — ইসলামী বই, কুরআন, হাদীস ও মনিষীদের জীবনী সম্বলিত এক নির্ভরযোগ্য ডিজিটাল ভাণ্ডার।",
        "publisher": {
            "@type": "Organization",
            "name": "Salafiyyah Library BD",
            "logo": "https://salafiyyah-library-bd.netlify.app/logo.png"
        }
    }

    return (
        <section className="mt-16 border-t border-blue-800/20 pt-16">
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(websiteSchema)}
                </script>
            </Helmet>

            <div className="grid md:grid-cols-12 gap-12 text-left">
                <div className="md:col-span-8 space-y-8 text-[#b8c5e0] leading-relaxed">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 border-l-4 border-[#f0c040] pl-6">
                        সালাফিয়্যাহ লাইব্রেরি বিডি — বিশুদ্ধ ইসলামী জ্ঞানের ডিজিটাল ভাণ্ডার
                    </h2>

                    <div className="space-y-6">
                        <p>
                            ইসলামী বিশ্বের বিশাল জ্ঞানভাণ্ডারকে আধুনিক প্রযুক্তির মাধ্যমে মানুষের দোরগোড়ায় পৌঁছে দেওয়ার প্রত্যয় নিয়ে যাত্রা শুরু করেছে <strong>সালাফিয়্যাহ লাইব্রেরি বিডি</strong>। কুরআন এবং সুন্নাহর সঠিক বুঝ, যা সালাফে সালেহীনদের মানহাজ অনুযায়ী পরিচালিত, তা প্রচার ও প্রসারে আমরা নিরলস কাজ করে যাচ্ছি। আমাদের এই অনলাইন প্ল্যাটফর্মে আপনি পাবেন শত শত বিশুদ্ধ ইসলামী বই, যা আপনার ঈমান ও আমলকে সমৃদ্ধ করবে।
                        </p>

                        <h3 className="text-2xl font-bold text-[#f0c040] mt-8">আমাদের লক্ষ্য ও উদ্দেশ্য</h3>
                        <p>
                            আমাদের প্রধান লক্ষ্য হলো বাংলাভাষী মুসলিমদের কাছে আহলুস সুন্নাহ ওয়াল জামাআতের আলেমদের রচিত বিশুদ্ধ বইগুলো অনলাইনে সহজে পড়ার সুযোগ করে দেওয়া। বর্তমানে ইন্টারনেটের যুগে বিভ্রান্তিকর তথ্যের ভিড়ে সঠিক ইলম খুঁজে পাওয়া বেশ কঠিন। তাই আমরা যাচাই-বাছাই করে শুধুমাত্র নির্ভরযোগ্য প্রকাশনী এবং আলেমদের বইগুলোই আমাদের লাইব্রেরিতে যুক্ত করি।
                        </p>

                        <h3 className="text-2xl font-bold text-[#f0c040] mt-8">আমাদের সংগ্রহের বৈশিষ্ট্য</h3>
                        <p>
                            আমাদের লাইব্রেরিতে আকীদা, তাফসীর, হাদীস, ফিকহ, সীরাত এবং মুসলিম ইতিহাসসহ নানা বিষয়ের বই রয়েছে। বিশেষ করে শায়খুল ইসলাম ইবনে তাইমিয়্যাহ, ইমাম ইবনুল কাইয়্যুম, শায়খ নাসিরুদ্দিন আলবানী, শায়খ ইবনে উসাইমীন এবং শায়খ বিন বায (রাহিমাহুমুল্লাহ)-সহ বর্তমান সময়ের নির্ভরযোগ্য আলেমদের গুরুত্বপূর্ণ কিতাবগুলো এখানে সংরক্ষিত আছে।
                        </p>
                        <p>
                            প্রতিটি বইয়ের জন্য আমাদের রয়েছে উন্নত রিডার এবং সার্চ অপশন, যার মাধ্যমে আপনি খুব সহজেই আপনার কাঙ্ক্ষিত বিষয়টি খুঁজে পেতে পারেন। এছাড়া বইয়ের পাশাপাশি আমরা দৈনন্দিন দুআ, সালাতের সময় এবং আল-কুরআনের ডিজিটাল সেবাও প্রদান করছি।
                        </p>

                        <h3 className="text-2xl font-bold text-[#f0c040] mt-8">কেন সালাফিয়্যাহ লাইব্রেরি বিডি ব্যবহার করবেন?</h3>
                        <ul className="list-disc pl-6 space-y-3">
                            <li><strong>বিশুদ্ধতা:</strong> আমরা প্রতিটি কিতাব সালাফি মানহাজের মানদণ্ডে যাচাই করি।</li>
                            <li><strong>ব্যবহারকারী বান্ধব:</strong> আমাদের ইন্টারফেস অত্যন্ত সহজ এবং মোবাইল ফ্রেন্ডলি।</li>
                            <li><strong>বিনামূল্যে অ্যাক্সেস:</strong> দ্বীনি ইলম প্রসারে আমরা বেশিরভাগ সেবা বিনামূল্যে প্রদান করি।</li>
                            <li><strong>নিয়মিত আপডেট:</strong> আমরা প্রতিনিয়ত নতুন নতুন বই এবং ফিচার যুক্ত করছি।</li>
                        </ul>

                        <h3 className="text-2xl font-bold text-[#f0c040] mt-8">বিশিষ্ট আলেম ও লেখকগণ</h3>
                        <p>
                            সালাফিয়্যাহ লাইব্রেরি বিডিতে আপনি পাবেন বিশ্ববিখ্যাত আলেমদের পাশাপাশি দেশীয় বিজ্ঞ আলেমদের মূল্যবান সব অনুবাদ ও মৌলিক গ্রন্থ। আমাদের লেখক তালিকার শীর্ষে রয়েছেন ইমাম বুখারী, ইমাম মুসলিম, শায়খ আলবানী এবং আরও অনেকে। তাদের রচিত কিতাবগুলো মুসলিম উম্মাহর জন্য এক অমূল্য সম্পদ।
                        </p>

                        <h3 className="text-2xl font-bold text-[#f0c040] mt-8">বইয়ের বিভাগ ও সহজ অনুসন্ধান</h3>
                        <p>
                            আপনার সুবিধার্থে আমরা বইগুলোকে বিভিন্ন ক্যাটাগরিতে ভাগ করেছি। যেমন: তাওহীদ ও আকীদা, সালাত ও ইবাদত, রমাদান ও রোজা, হজ্জ ও উমরাহ, এবং মুসলিম নারীদের জন্য বিশেষ মাসায়েল। আপনি আমাদের সার্চ বক্স ব্যবহার করে ক্যাটাগরি, লেখক বা প্রকাশনীর নাম দিয়ে সহজেই সার্চ করতে পারেন।
                        </p>

                        <p className="border-t border-blue-800/20 pt-6 italic">
                            সঠিক জ্ঞানই পারে একজন মুমিনকে অন্ধকার থেকে আলোর পথে নিয়ে আসতে। সালাফিয়্যাহ লাইব্রেরি বিডির সাথে যুক্ত থেকে আপনার ইসলামী জ্ঞানের পরিধি আরও বৃদ্ধি করুন। জাযাকাল্লাহু খাইরান।
                        </p>
                    </div>
                </div>

                <div className="md:col-span-4">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-[#0d1428] border border-blue-800/40 p-6 rounded-2xl shadow-xl">
                            <h4 className="text-xl font-bold text-white mb-4">দ্রুত সংযোগ</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <Link to="/books" className="tap-target px-4 py-2 bg-blue-900/20 hover:bg-blue-900/40 rounded-lg text-sm transition-all text-center">সব বই দেখুন</Link>
                                <Link to="/writers" className="tap-target px-4 py-2 bg-blue-900/20 hover:bg-blue-900/40 rounded-lg text-sm transition-all text-center">আলেম ও লেখকগণ</Link>
                                <Link to="/quran" className="tap-target px-4 py-2 bg-blue-900/20 hover:bg-blue-900/40 rounded-lg text-sm transition-all text-center">আল-কুরআন</Link>
                                <Link to="/hadith" className="tap-target px-4 py-2 bg-blue-900/20 hover:bg-blue-900/40 rounded-lg text-sm transition-all text-center">হাদীস সম্ভার</Link>
                            </div>
                        </div>

                        {/* Social Connect Section */}
                        <div className="bg-[#0d1428] border border-[#1877F2]/30 p-6 rounded-2xl shadow-xl">
                            <h4 className="text-xl font-bold text-white mb-4">আমাদের সাথে যুক্ত থাকুন</h4>
                            <p className="text-sm text-[#8899bb] mb-6">সালাফিয়্যাহ লাইব্রেরি বিডির অফিসিয়াল ফেসবুক পেজ ফলো করে নতুন বই ও আপডেট সম্পর্কে জানুন।</p>
                            <a
                                href="https://www.facebook.com/profile.php?id=61585042973644"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-3 bg-[#1877F2] text-white rounded-xl font-bold hover:bg-[#1877F2]/90 transition-all shadow-lg"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                আমাদের Facebook পেজ ফলো করুন
                            </a>
                        </div>

                        <div className="bg-gradient-to-br from-[#1a1500] to-[#0d1428] rounded-2xl border border-[#c9a84c]/30 p-6 shadow-xl">
                            <h4 className="text-xl font-bold text-[#f0c040] mb-2">প্রতিদিনের ইলম</h4>
                            <p className="text-sm text-[#8899bb] mb-4">সঠিক উৎস থেকে দ্বীন শিখুন এবং অন্যদের সাথে শেয়ার করুন।</p>
                            <button className="w-full py-3 bg-[#c9a84c] text-[#0a0f1e] rounded-xl font-bold hover:bg-[#f0c040] transition-all">সাবস্ক্রাইব করুন</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutPage
