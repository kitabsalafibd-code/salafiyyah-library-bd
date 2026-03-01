import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

const fallbackDuas = [
    { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', bangla: 'হে আমাদের রব, আমাদের দুনিয়াতে কল্যাণ দিন এবং আখিরাতে কল্যাণ দিন এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করুন।', reference: 'সূরা বাকারা: ২০১' },
    { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', bangla: 'হে আমার রব, আমার বক্ষ প্রশস্ত করে দিন এবং আমার কাজকে সহজ করে দিন।', reference: 'সূরা ত্বহা: ২৫-২৬' },
    { arabic: 'رَبِّ زِدْنِي عِلْمًا', bangla: 'হে আমার রব, আমার জ্ঞান বাড়িয়ে দিন।', reference: 'সূরা ত্বহা: ১১৪' },
    { arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', bangla: 'আল্লাহই আমাদের জন্য যথেষ্ট, তিনি কতই না উত্তম কার্যনির্বাহক।', reference: 'সূরা আলে ইমরান: ১৭৩' },
    { arabic: 'رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً', bangla: 'হে আমার রব, আপনার কাছ থেকে আমাকে পবিত্র সন্তান দান করুন।', reference: 'সূরা আলে ইমরান: ৩৮' },
    { arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا', bangla: 'হে আমাদের রব, হিদায়াত দান করার পর আমাদের অন্তরকে বক্র করবেন না।', reference: 'সূরা আলে ইমরান: ৮' },
    { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى', bangla: 'হে আল্লাহ, আমি আপনার কাছে হিদায়াত, তাকওয়া, পবিত্রতা ও স্বচ্ছলতা প্রার্থনা করছি।', reference: 'সহীহ মুসলিম' },
    { arabic: 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', bangla: 'হে আমাদের রব, আমরা নিজেদের প্রতি জুলুম করেছি। আপনি যদি আমাদের ক্ষমা না করেন এবং দয়া না করেন, তবে আমরা অবশ্যই ক্ষতিগ্রস্তদের অন্তর্ভুক্ত হব।', reference: 'সূরা আরাফ: ২৩' },
]

const DuaPage: React.FC = () => {
    const { data: duas } = useQuery({
        queryKey: ['all-duas'],
        queryFn: async () => {
            const { data } = await supabase.from('duas').select('*')
            return data && data.length > 0 ? data : fallbackDuas
        },
        staleTime: 30 * 60 * 1000,
    })

    return (
        <>
            <Helmet><title>দৈনিক দুআ — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">🤲 দৈনিক দুআ</h1>
                    <p className="text-[#8899bb]">কুরআন ও সুন্নাহ থেকে দুআসমূহ</p>
                </div>
                <div className="space-y-4">
                    {(duas || fallbackDuas).map((dua: any, i: number) => (
                        <div key={i} className="bg-[#0d1428] rounded-xl border border-blue-800/40 p-6 gold-glow transition-all">
                            <p className="font-arabic text-xl text-[#f0c040] text-right mb-4 leading-relaxed" dir="rtl">
                                {dua.arabic}
                            </p>
                            <p className="text-white leading-relaxed mb-2">{dua.bangla}</p>
                            <p className="text-[#8899bb] text-sm">{dua.reference}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default DuaPage
