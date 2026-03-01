import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const hadithBooks = [
    { slug: 'sahih-bukhari', name: 'সহীহ বুখারী', nameEn: 'Sahih al-Bukhari', count: '৭৫৬৩ হাদীস' },
    { slug: 'sahih-muslim', name: 'সহীহ মুসলিম', nameEn: 'Sahih Muslim', count: '৩০৩৩ হাদীস' },
    { slug: 'al-tirmidhi', name: 'জামে তিরমিযী', nameEn: 'Jami at-Tirmidhi', count: '৩৯৫৬ হাদীস' },
    { slug: 'abu-dawood', name: 'সুনানে আবু দাউদ', nameEn: 'Sunan Abu Dawud', count: '৫২৭৪ হাদীস' },
    { slug: 'ibn-e-majah', name: 'সুনানে ইবনে মাজাহ', nameEn: 'Sunan Ibn Majah', count: '৪৩৪১ হাদীস' },
    { slug: 'sunan-nasai', name: 'সুনানে নাসাঈ', nameEn: "Sunan an-Nasa'i", count: '৫৭৬১ হাদীস' },
]

const HadithPage: React.FC = () => {
    return (
        <>
            <Helmet><title>হাদীস — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8 container page-content" style={{ overflowX: 'hidden' }}>
                <h1 className="text-2xl font-bold text-white mb-6 section-title">📜 হাদীস সংকলন</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 hadith-grid">
                    {hadithBooks.map((book) => (
                        <Link
                            key={book.slug}
                            to={`/hadith/${book.slug}`}
                            className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-6 hover:border-[#c9a84c]/50 gold-glow transition-all group card"
                        >
                            <p className="text-3xl mb-3">📜</p>
                            <h3 className="text-white font-bold text-lg group-hover:text-[#f0c040] transition-colors">{book.name}</h3>
                            <p className="text-[#8899bb] text-sm">{book.nameEn}</p>
                            <p className="text-[#c9a84c] text-xs mt-2">{book.count}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default HadithPage
export { hadithBooks }
