import React from 'react'
import { Helmet } from 'react-helmet-async'

const asmaulHusna = [
    { number: 1, arabic: 'ٱلرَّحْمَٰنُ', bangla: 'আর-রহমান', meaning: 'পরম করুণাময়' },
    { number: 2, arabic: 'ٱلرَّحِيمُ', bangla: 'আর-রহীম', meaning: 'অসীম দয়ালু' },
    { number: 3, arabic: 'ٱلْمَلِكُ', bangla: 'আল-মালিক', meaning: 'মহান সম্রাট' },
    { number: 4, arabic: 'ٱلْقُدُّوسُ', bangla: 'আল-কুদ্দুস', meaning: 'পবিত্রতম' },
    { number: 5, arabic: 'ٱلسَّلَامُ', bangla: 'আস-সালাম', meaning: 'শান্তিদাতা' },
    { number: 6, arabic: 'ٱلْمُؤْمِنُ', bangla: 'আল-মুমিন', meaning: 'নিরাপত্তাদাতা' },
    { number: 7, arabic: 'ٱلْمُهَيْمِنُ', bangla: 'আল-মুহাইমিন', meaning: 'রক্ষাকারী' },
    { number: 8, arabic: 'ٱلْعَزِيزُ', bangla: 'আল-আযীয', meaning: 'পরাক্রমশালী' },
    { number: 9, arabic: 'ٱلْجَبَّارُ', bangla: 'আল-জাব্বার', meaning: 'মহা শক্তিশালী' },
    { number: 10, arabic: 'ٱلْمُتَكَبِّرُ', bangla: 'আল-মুতাকাব্বির', meaning: 'শ্রেষ্ঠত্বের অধিকারী' },
    { number: 11, arabic: 'ٱلْخَالِقُ', bangla: 'আল-খালিক', meaning: 'স্রষ্টা' },
    { number: 12, arabic: 'ٱلْبَارِئُ', bangla: 'আল-বারী', meaning: 'উদ্ভাবক' },
    { number: 13, arabic: 'ٱلْمُصَوِّرُ', bangla: 'আল-মুসাওয়ির', meaning: 'আকৃতিদাতা' },
    { number: 14, arabic: 'ٱلْغَفَّارُ', bangla: 'আল-গাফফার', meaning: 'ক্ষমাশীল' },
    { number: 15, arabic: 'ٱلْقَهَّارُ', bangla: 'আল-কাহহার', meaning: 'মহা পরাক্রান্ত' },
    { number: 16, arabic: 'ٱلْوَهَّابُ', bangla: 'আল-ওয়াহহাব', meaning: 'মহাদাতা' },
    { number: 17, arabic: 'ٱلرَّزَّاقُ', bangla: 'আর-রায্যাক', meaning: 'রিযিকদাতা' },
    { number: 18, arabic: 'ٱلْفَتَّاحُ', bangla: 'আল-ফাত্তাহ', meaning: 'উদঘাটনকারী' },
    { number: 19, arabic: 'ٱلْعَلِيمُ', bangla: 'আল-আলীম', meaning: 'সর্বজ্ঞ' },
    { number: 20, arabic: 'ٱلْقَابِضُ', bangla: 'আল-কাবিদ', meaning: 'সঙ্কোচনকারী' },
    { number: 21, arabic: 'ٱلْبَاسِطُ', bangla: 'আল-বাসিত', meaning: 'সম্প্রসারণকারী' },
    { number: 22, arabic: 'ٱلْخَافِضُ', bangla: 'আল-খাফিদ', meaning: 'অবনমনকারী' },
    { number: 23, arabic: 'ٱلرَّافِعُ', bangla: 'আর-রাফি', meaning: 'উত্তোলনকারী' },
    { number: 24, arabic: 'ٱلْمُعِزُّ', bangla: 'আল-মুইয', meaning: 'সম্মানদাতা' },
    { number: 25, arabic: 'ٱلْمُذِلُّ', bangla: 'আল-মুযিল', meaning: 'অপমানকারী' },
    { number: 26, arabic: 'ٱلسَّمِيعُ', bangla: 'আস-সামী', meaning: 'সর্বশ্রোতা' },
    { number: 27, arabic: 'ٱلْبَصِيرُ', bangla: 'আল-বাসীর', meaning: 'সর্বদ্রষ্টা' },
    { number: 28, arabic: 'ٱلْحَكَمُ', bangla: 'আল-হাকাম', meaning: 'বিচারক' },
    { number: 29, arabic: 'ٱلْعَدْلُ', bangla: 'আল-আদল', meaning: 'ন্যায়পরায়ণ' },
    { number: 30, arabic: 'ٱللَّطِيفُ', bangla: 'আল-লতীফ', meaning: 'সূক্ষ্মদর্শী' },
    { number: 31, arabic: 'ٱلْخَبِيرُ', bangla: 'আল-খবীর', meaning: 'সর্বজ্ঞাত' },
    { number: 32, arabic: 'ٱلْحَلِيمُ', bangla: 'আল-হালীম', meaning: 'সহিষ্ণু' },
    { number: 33, arabic: 'ٱلْعَظِيمُ', bangla: 'আল-আযীম', meaning: 'মহান' },
    { number: 34, arabic: 'ٱلْغَفُورُ', bangla: 'আল-গফুর', meaning: 'ক্ষমাকারী' },
    { number: 35, arabic: 'ٱلشَّكُورُ', bangla: 'আশ-শাকূর', meaning: 'কৃতজ্ঞতা প্রদানকারী' },
    { number: 36, arabic: 'ٱلْعَلِيُّ', bangla: 'আল-আলী', meaning: 'সুমহান' },
    { number: 37, arabic: 'ٱلْكَبِيرُ', bangla: 'আল-কবীর', meaning: 'সুবিশাল' },
    { number: 38, arabic: 'ٱلْحَفِيظُ', bangla: 'আল-হাফীয', meaning: 'সংরক্ষণকারী' },
    { number: 39, arabic: 'ٱلْمُقِيتُ', bangla: 'আল-মুকীত', meaning: 'জীবিকাদাতা' },
    { number: 40, arabic: 'ٱلْحَسِيبُ', bangla: 'আল-হাসীব', meaning: 'হিসাব গ্রহণকারী' },
    { number: 41, arabic: 'ٱلْجَلِيلُ', bangla: 'আল-জালীল', meaning: 'মহিমাময়' },
    { number: 42, arabic: 'ٱلْكَرِيمُ', bangla: 'আল-কারীম', meaning: 'মহানুভব' },
    { number: 43, arabic: 'ٱلرَّقِيبُ', bangla: 'আর-রাকীব', meaning: 'সতর্ক পর্যবেক্ষক' },
    { number: 44, arabic: 'ٱلْمُجِيبُ', bangla: 'আল-মুজীব', meaning: 'উত্তরদাতা' },
    { number: 45, arabic: 'ٱلْوَاسِعُ', bangla: 'আল-ওয়াসি', meaning: 'সর্বব্যাপী' },
    { number: 46, arabic: 'ٱلْحَكِيمُ', bangla: 'আল-হাকীম', meaning: 'প্রজ্ঞাময়' },
    { number: 47, arabic: 'ٱلْوَدُودُ', bangla: 'আল-ওয়াদূদ', meaning: 'ভালোবাসাময়' },
    { number: 48, arabic: 'ٱلْمَجِيدُ', bangla: 'আল-মাজীদ', meaning: 'মহিমান্বিত' },
    { number: 49, arabic: 'ٱلْبَاعِثُ', bangla: 'আল-বাঈস', meaning: 'পুনরুত্থানকারী' },
    { number: 50, arabic: 'ٱلشَّهِيدُ', bangla: 'আশ-শাহীদ', meaning: 'সাক্ষী' },
    { number: 51, arabic: 'ٱلْحَقُّ', bangla: 'আল-হাক্ক', meaning: 'সত্য' },
    { number: 52, arabic: 'ٱلْوَكِيلُ', bangla: 'আল-ওয়াকীল', meaning: 'কার্যনির্বাহক' },
    { number: 53, arabic: 'ٱلْقَوِيُّ', bangla: 'আল-কাওয়ী', meaning: 'মহাশক্তিশালী' },
    { number: 54, arabic: 'ٱلْمَتِينُ', bangla: 'আল-মাতীন', meaning: 'অবিচল' },
    { number: 55, arabic: 'ٱلْوَلِيُّ', bangla: 'আল-ওয়ালী', meaning: 'অভিভাবক' },
    { number: 56, arabic: 'ٱلْحَمِيدُ', bangla: 'আল-হামীদ', meaning: 'প্রশংসিত' },
    { number: 57, arabic: 'ٱلْمُحْصِي', bangla: 'আল-মুহসী', meaning: 'গণনাকারী' },
    { number: 58, arabic: 'ٱلْمُبْدِئُ', bangla: 'আল-মুবদী', meaning: 'আরম্ভকারী' },
    { number: 59, arabic: 'ٱلْمُعِيدُ', bangla: 'আল-মুঈদ', meaning: 'প্রত্যাবর্তনকারী' },
    { number: 60, arabic: 'ٱلْمُحْيِي', bangla: 'আল-মুহয়ী', meaning: 'জীবনদাতা' },
    { number: 61, arabic: 'ٱلْمُمِيتُ', bangla: 'আল-মুমীত', meaning: 'মৃত্যুদাতা' },
    { number: 62, arabic: 'ٱلْحَيُّ', bangla: 'আল-হাইয়ু', meaning: 'চিরঞ্জীব' },
    { number: 63, arabic: 'ٱلْقَيُّومُ', bangla: 'আল-কায়্যুম', meaning: 'স্বনির্ভর' },
    { number: 64, arabic: 'ٱلْوَاجِدُ', bangla: 'আল-ওয়াজিদ', meaning: 'অনুসন্ধানকারী' },
    { number: 65, arabic: 'ٱلْمَاجِدُ', bangla: 'আল-মাজিদ', meaning: 'মহত্ত্বপূর্ণ' },
    { number: 66, arabic: 'ٱلْوَاحِدُ', bangla: 'আল-ওয়াহিদ', meaning: 'একক' },
    { number: 67, arabic: 'ٱلْأَحَدُ', bangla: 'আল-আহাদ', meaning: 'অদ্বিতীয়' },
    { number: 68, arabic: 'ٱلصَّمَدُ', bangla: 'আস-সামাদ', meaning: 'অমুখাপেক্ষী' },
    { number: 69, arabic: 'ٱلْقَادِرُ', bangla: 'আল-কাদির', meaning: 'সর্বশক্তিমান' },
    { number: 70, arabic: 'ٱلْمُقْتَدِرُ', bangla: 'আল-মুকতাদির', meaning: 'ক্ষমতাবান' },
    { number: 71, arabic: 'ٱلْمُقَدِّمُ', bangla: 'আল-মুকাদ্দিম', meaning: 'অগ্রসরকারী' },
    { number: 72, arabic: 'ٱلْمُؤَخِّرُ', bangla: 'আল-মুআখখির', meaning: 'বিলম্বকারী' },
    { number: 73, arabic: 'ٱلْأَوَّلُ', bangla: 'আল-আওয়াল', meaning: 'প্রথম' },
    { number: 74, arabic: 'ٱلْآخِرُ', bangla: 'আল-আখির', meaning: 'শেষ' },
    { number: 75, arabic: 'ٱلظَّاهِرُ', bangla: 'আয-যাহির', meaning: 'প্রকাশ্য' },
    { number: 76, arabic: 'ٱلْبَاطِنُ', bangla: 'আল-বাতিন', meaning: 'গোপন' },
    { number: 77, arabic: 'ٱلْوَالِي', bangla: 'আল-ওয়ালী', meaning: 'শাসক' },
    { number: 78, arabic: 'ٱلْمُتَعَالِي', bangla: 'আল-মুতাআলী', meaning: 'সর্বোচ্চ' },
    { number: 79, arabic: 'ٱلْبَرُّ', bangla: 'আল-বার্র', meaning: 'পুণ্যময়' },
    { number: 80, arabic: 'ٱلتَّوَّابُ', bangla: 'আত-তাওয়াব', meaning: 'তওবা গ্রহণকারী' },
    { number: 81, arabic: 'ٱلْمُنْتَقِمُ', bangla: 'আল-মুনতাকিম', meaning: 'প্রতিশোধ গ্রহণকারী' },
    { number: 82, arabic: 'ٱلْعَفُوُّ', bangla: 'আল-আফু', meaning: 'মার্জনাকারী' },
    { number: 83, arabic: 'ٱلرَّؤُوفُ', bangla: 'আর-রাউফ', meaning: 'স্নেহশীল' },
    { number: 84, arabic: 'مَالِكُ ٱلْمُلْكِ', bangla: 'মালিকুল মুলক', meaning: 'সার্বভৌম ক্ষমতার মালিক' },
    { number: 85, arabic: 'ذُو ٱلْجَلَالِ وَٱلْإِكْرَامِ', bangla: 'যুল জালালি ওয়াল ইকরাম', meaning: 'মহিমা ও সম্মানের অধিকারী' },
    { number: 86, arabic: 'ٱلْمُقْسِطُ', bangla: 'আল-মুকসিত', meaning: 'ন্যায়বিচারক' },
    { number: 87, arabic: 'ٱلْجَامِعُ', bangla: 'আল-জামি', meaning: 'সমবেতকারী' },
    { number: 88, arabic: 'ٱلْغَنِيُّ', bangla: 'আল-গনী', meaning: 'স্বয়ংসম্পূর্ণ' },
    { number: 89, arabic: 'ٱلْمُغْنِي', bangla: 'আল-মুগনী', meaning: 'সমৃদ্ধিদাতা' },
    { number: 90, arabic: 'ٱلْمَانِعُ', bangla: 'আল-মানি', meaning: 'নিবারণকারী' },
    { number: 91, arabic: 'ٱلضَّارُّ', bangla: 'আদ-দের', meaning: 'ক্ষতিকারী' },
    { number: 92, arabic: 'ٱلنَّافِعُ', bangla: 'আন-নাফি', meaning: 'উপকারকারী' },
    { number: 93, arabic: 'ٱلنُّورُ', bangla: 'আন-নূর', meaning: 'আলো' },
    { number: 94, arabic: 'ٱلْهَادِي', bangla: 'আল-হাদী', meaning: 'পথপ্রদর্শক' },
    { number: 95, arabic: 'ٱلْبَدِيعُ', bangla: 'আল-বাদী', meaning: 'অভূতপূর্ব স্রষ্টা' },
    { number: 96, arabic: 'ٱلْبَاقِي', bangla: 'আল-বাকী', meaning: 'চিরস্থায়ী' },
    { number: 97, arabic: 'ٱلْوَارِثُ', bangla: 'আল-ওয়ারিস', meaning: 'উত্তরাধিকারী' },
    { number: 98, arabic: 'ٱلرَّشِيدُ', bangla: 'আর-রশীদ', meaning: 'সুদূরপ্রসারী পথনির্দেশক' },
    { number: 99, arabic: 'ٱلصَّبُورُ', bangla: 'আস-সবূর', meaning: 'মহা ধৈর্যশীল' },
]

const AsmaulHusnaPage: React.FC = () => {
    return (
        <>
            <Helmet><title>আসমাউল হুসনা — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">🌟 আসমাউল হুসনা</h1>
                    <p className="text-[#8899bb]">আল্লাহর ৯৯টি সুন্দর নাম</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {asmaulHusna.map((name) => (
                        <div
                            key={name.number}
                            className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-5 text-center hover:border-[#c9a84c]/50 gold-glow transition-all"
                        >
                            <span className="inline-block w-8 h-8 rounded-full bg-[#1a3a8f] text-white text-xs font-bold flex items-center justify-center mx-auto mb-3">
                                {name.number}
                            </span>
                            <p className="font-arabic text-2xl text-[#f0c040] mb-2" dir="rtl">{name.arabic}</p>
                            <p className="text-white font-semibold text-sm">{name.bangla}</p>
                            <p className="text-[#8899bb] text-xs mt-1">{name.meaning}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default AsmaulHusnaPage
