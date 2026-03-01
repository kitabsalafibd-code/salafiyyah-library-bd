import React, { useState, createContext, useContext, useCallback } from 'react'

interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'info'
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => { } })

export function useToast() {
    return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-[fadeInUp_0.3s_ease-out] ${toast.type === 'success' ? 'bg-green-600 text-white' :
                            toast.type === 'error' ? 'bg-red-600 text-white' :
                                'bg-[#1a3a8f] text-white'
                            }`}
                    >
                        {toast.type === 'success' ? '✅ ' : toast.type === 'error' ? '❌ ' : 'ℹ️ '}
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
