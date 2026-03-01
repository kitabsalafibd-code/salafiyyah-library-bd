import React, { useState } from 'react'
import { useToast } from './Toast'

interface ShareButtonProps {
    title: string
    author?: string
    url?: string
    variant?: 'small' | 'large'
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, author, url, variant = 'small' }) => {
    const { showToast } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const currentUrl = url || window.location.origin + window.location.pathname

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl)
        showToast('লিংক কপি হয়েছে!')
        setIsOpen(false)
    }

    const shareData = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`📚 ${title}\nলেখক: ${author || 'অজানা'}\nদেখুন: ${currentUrl}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    }

    return (
        <div className="relative inline-block">
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen) }}
                className={`${variant === 'large' ? 'px-5 py-2.5 bg-[#111a33] border border-blue-800/30' : 'w-8 h-8 bg-black/40'} rounded-xl flex items-center justify-center text-white hover:bg-[#1a3a8f] transition-all`}
                title="শেয়ার করুন"
            >
                📤 {variant === 'large' && <span className="ml-2 text-sm font-semibold">শেয়ার</span>}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 bottom-full mb-2 md:bottom-auto md:top-full md:mt-2 w-48 z-50 bg-[#0d1428] border border-blue-800/40 rounded-xl shadow-2xl py-2 overflow-hidden animate-fadeIn">
                        <a
                            href={shareData.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#8899bb] transition-all hover:bg-white/5 hover:text-white"
                        >
                            <span className="text-xl">💬</span>
                            <span>WhatsApp</span>
                        </a>
                        <a
                            href={shareData.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#8899bb] transition-all hover:bg-white/5 hover:text-white"
                        >
                            <span className="text-xl">👥</span>
                            <span>Facebook</span>
                        </a>
                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#8899bb] transition-all hover:bg-white/5 hover:text-white"
                        >
                            <span className="text-xl">🔗</span>
                            <span>লিংক কপি করুন</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default React.memo(ShareButton)
