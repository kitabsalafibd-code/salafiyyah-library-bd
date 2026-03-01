import { useState, useEffect, useCallback } from 'react'

export interface CompareBook {
    id: string
    title: string
    cover_image_url?: string
    price?: number
    description?: string
    author_id?: string
    publisher_id?: string
    category_id?: string
    writers?: { id: string; name: string } | null
    publishers?: { id: string; name: string } | null
    categories?: { id: string; name: string; slug: string } | null
    [key: string]: any
}

const COMPARE_KEY = 'compare'
const MAX_COMPARE = 2

const getStored = (): CompareBook[] => {
    try {
        return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]')
    } catch {
        return []
    }
}

export const useCompare = () => {
    const [compareBooks, setCompareBooks] = useState<CompareBook[]>(getStored)
    const compareIds = compareBooks.map(b => b.id)

    const sync = useCallback(() => {
        setCompareBooks(getStored())
    }, [])

    useEffect(() => {
        window.addEventListener('storage', sync)
        const interval = setInterval(sync, 500)
        return () => {
            window.removeEventListener('storage', sync)
            clearInterval(interval)
        }
    }, [sync])

    const addToCompare = useCallback((book: CompareBook) => {
        const current = getStored()
        if (current.find(b => b.id === book.id)) {
            // Toggle off
            const updated = current.filter(b => b.id !== book.id)
            localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
            setCompareBooks(updated)
            window.dispatchEvent(new Event('storage'))
            return
        }
        if (current.length >= MAX_COMPARE) {
            alert('সর্বোচ্চ ২টি বই তুলনা করা যাবে')
            return
        }
        const updated = [...current, book]
        localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
        setCompareBooks(updated)
        window.dispatchEvent(new Event('storage'))
    }, [])

    // Legacy toggleCompare keeps compatibility with existing BookCard usage
    const toggleCompare = useCallback((id: string, book?: CompareBook) => {
        if (book) {
            addToCompare(book)
        } else {
            const current = getStored()
            const updated = current.filter(b => b.id !== id)
            localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
            setCompareBooks(updated)
            window.dispatchEvent(new Event('storage'))
        }
    }, [addToCompare])

    return { compareIds, compareBooks, addToCompare, toggleCompare }
}
