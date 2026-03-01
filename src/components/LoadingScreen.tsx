import React, { useState, useEffect } from 'react'

const dhikrList = [
    { arabic: 'سُبْحَانَ اللَّهِ', bangla: 'আল্লাহ পবিত্র' },
    { arabic: 'الْحَمْدُ لِلَّهِ', bangla: 'সকল প্রশংসা আল্লাহর' },
    { arabic: 'اللَّهُ أَكْبَرُ', bangla: 'আল্লাহ সর্বশ্রেষ্ঠ' },
    { arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', bangla: 'আল্লাহ ছাড়া কোনো ইলাহ নেই' },
]

const LoadingScreen: React.FC = () => {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % dhikrList.length)
        }, 1500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 bg-[#0a0f1e] flex flex-col items-center justify-center z-[9999]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
                <div key={index} className="dhikr-animate text-center">
                    <p className="font-arabic text-3xl md:text-4xl text-[#f0c040]" dir="rtl">
                        {dhikrList[index].arabic}
                    </p>
                    <p className="text-[#8899bb] text-lg mt-2">
                        {dhikrList[index].bangla}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen
