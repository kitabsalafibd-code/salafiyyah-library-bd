import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>
    signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>
    signOut: () => Promise<void>
    isAdmin: boolean
}

const ADMIN_EMAILS = [
    'mishkatmizan33@gmail.com',
    'zahin.pilot2009@gmail.com',
    'mrzzahin@gmail.com',
    'kitabsalafibd@gmail.com'
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const user = data.session?.user ?? null
            setUser(user)
            setIsAdmin(ADMIN_EMAILS.includes(user?.email || ''))
            setLoading(false)
        })

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                const user = session?.user ?? null
                setUser(user)
                setIsAdmin(ADMIN_EMAILS.includes(user?.email || ''))
                setLoading(false)
            })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error: error as Error | null }
    }, [])

    const signUp = useCallback(async (email: string, password: string, name: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
        })
        return { error: error as Error | null }
    }, [])

    const signOut = useCallback(async () => {
        await supabase.auth.signOut()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
