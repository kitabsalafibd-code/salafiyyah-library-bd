import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'

const LoginPage: React.FC = () => {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { error: err } = await signIn(email, password)
            if (err) throw err
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.message || 'লগইন ব্যর্থ হয়েছে')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Helmet><title>লগইন — Salafiyyah Library BD</title></Helmet>
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">📖 লগইন করুন</h1>
                            <p className="text-[#8899bb] text-sm">আপনার একাউন্টে প্রবেশ করুন</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-[#8899bb] text-sm block mb-1.5">ইমেইল</label>
                                <input
                                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="w-full px-4 py-3 rounded-xl bg-[#111a33] border border-blue-800/40 text-white placeholder-[#556688] focus:border-[#f0c040] focus:outline-none focus:ring-1 focus:ring-[#f0c040]/30 transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="text-[#8899bb] text-sm block mb-1.5">পাসওয়ার্ড</label>
                                <input
                                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                    className="w-full px-4 py-3 rounded-xl bg-[#111a33] border border-blue-800/40 text-white placeholder-[#556688] focus:border-[#f0c040] focus:outline-none focus:ring-1 focus:ring-[#f0c040]/30 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-[#1a3a8f] to-[#2952cc] hover:from-[#2952cc] hover:to-[#3d6bff] text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-900/30"
                            >
                                {loading ? 'লোড হচ্ছে...' : 'লগইন'}
                            </button>
                        </form>

                        <p className="text-[#8899bb] text-sm text-center mt-6">
                            একাউন্ট নেই?{' '}
                            <Link to="/register" className="text-[#f0c040] hover:underline font-semibold">রেজিস্টার করুন</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage
