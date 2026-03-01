import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({
    children
}: { children: React.ReactNode }) {
    const [status, setStatus] = useState<
        'loading' | 'auth' | 'noauth'
    >('loading')

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setStatus(data?.session ? 'auth' : 'noauth')
        }).catch(() => setStatus('noauth'))
    }, [])

    if (status === 'loading') return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0f1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c9a84c',
            fontSize: '20px'
        }}>
            লোড হচ্ছে...
        </div>
    )

    if (status === 'noauth')
        return <Navigate to="/login" replace />

    return <>{children}</>
}
