import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ADMIN_EMAILS = [
    'mishkatmizan33@gmail.com',
    'zahin.pilot2009@gmail.com',
    'mrzzahin@gmail.com',
    'kitabsalafibd@gmail.com'
]

export default function AdminRoute({
    children
}: { children: React.ReactNode }) {
    const [status, setStatus] = useState<
        'loading' | 'admin' | 'noauth' | 'notadmin'
    >('loading')

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const email = data?.session?.user?.email
            if (!email) {
                setStatus('noauth')
            } else if (ADMIN_EMAILS.includes(email)) {
                setStatus('admin')
            } else {
                setStatus('notadmin')
            }
        }).catch(() => setStatus('notadmin'))
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
            অ্যাডমিন যাচাই করা হচ্ছে...
        </div>
    )

    if (status === 'noauth')
        return <Navigate to="/login" replace />
    if (status === 'notadmin')
        return <Navigate to="/" replace />
    return <>{children}</>
}
