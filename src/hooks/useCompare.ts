import { useState, useEffect, useCallback } from 'react'

export const useCompare = () => {
    const [compareIds, setCompareIds] = useState<string[]>([])

    const sync = useCallback(() => {
        const stored = localStorage.getItem('compare-books')
        if (stored) {
            try {
                setCompareIds(JSON.parse(stored))
            } catch {
                setCompareIds([])
            }
        } else {
            setCompareIds([])
        }
    }, [])

    useEffect(() => {
        sync()
        window.addEventListener('storage', sync)
        const interval = setInterval(sync, 1000)
        return () => {
            window.removeEventListener('storage', sync)
            clearInterval(interval)
        }
    }, [sync])

    const toggleCompare = useCallback((id: string) => {
        const stored = localStorage.getItem('compare-books')
        let current: string[] = []
        if (stored) {
            try { current = JSON.parse(stored) } catch { current = [] }
        }

        const updated = current.includes(id)
            ? current.filter(x => x !== id)
            : [...current, id].slice(0, 4)

        localStorage.setItem('compare-books', JSON.stringify(updated))
        setCompareIds(updated)
        // Trigger sync for other instances of the hook
        window.dispatchEvent(new Event('storage'))
    }, [])

    return { compareIds, toggleCompare }
}
