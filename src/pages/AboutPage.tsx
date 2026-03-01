import React from 'react'
import { Helmet } from 'react-helmet-async'

const AboutPage: React.FC = () => {
    return (
        <>
            <Helmet><title>এই ওয়েবসাইট সম্পর্কে — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold text-center text-white mb-12">এই ওয়েবসাইট সম্পর্কে</h1>

                {/* Section 1 — নির্মাতার পরিচয় */}
                <section className="mb-12">
                    <div className="bg-[#0d1428] border border-[#c9a84c] rounded-2xl p-8 text-center gold-glow">
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
                <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0d1428] border border-blue-800/30 rounded-xl p-6">
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

                    {/* Section 4 — বাগ রিপোর্ট */}
                    <div className="bg-[#0d1428] border border-blue-800/30 rounded-xl p-6">
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

                {/* Section 5 — ক্রেডিট */}
                <section className="text-center bg-[#111a33]/50 rounded-xl p-6 border border-blue-800/20">
                    <h3 className="text-[#f0c040] font-bold mb-4">তৈরিতে ব্যবহৃত প্রযুক্তি</h3>
                    <p className="text-sm text-[#8899bb] mb-2 uppercase tracking-widest">
                        React | TypeScript | Supabase | Tailwind CSS
                    </p>
                    <p className="text-xs text-[#8899bb]">
                        Powered by AI (Anthropic Claude + Google Gemini)
                    </p>
                </section>
            </div>
        </>
    )
}

export default AboutPage
