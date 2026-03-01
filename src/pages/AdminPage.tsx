import React, { useState, lazy, Suspense } from 'react'
import AdminHomePanel from './admin/AdminHome'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

// Lazy sub-panels (to keep main bundle light)
const AdminBooksPanel = lazy(() => import('./admin/AdminBooks.tsx'))
const AdminWritersPanel = lazy(() => import('./admin/AdminWriters.tsx'))
const AdminPublishersPanel = lazy(() => import('./admin/AdminPublishers.tsx'))
const AdminCategoriesPanel = lazy(() => import('./admin/AdminCategories.tsx'))
const AdminUsersPanel = lazy(() => import('./admin/AdminUsers.tsx'))
const AdminDuasPanel = lazy(() => import('./admin/AdminDuas.tsx'))
const AdminAnalyticsPanel = lazy(() => import('./admin/AdminAnalytics.tsx'))
const AdminCSVImportPanel = lazy(() => import('./admin/AdminCSVImport.tsx'))

const sidebarItems = [
    { key: 'home', label: '🏠 ড্যাশবোর্ড', icon: '🏠' },
    { key: 'books', label: '📚 বই', icon: '📚' },
    { key: 'writers', label: '✍️ লেখক', icon: '✍️' },
    { key: 'publishers', label: '🏢 প্রকাশনী', icon: '🏢' },
    { key: 'categories', label: '📂 ক্যাটাগরি', icon: '📂' },
    { key: 'users', label: '👥 ইউজারস', icon: '👥' },
    { key: 'analytics', label: '📊 অ্যানালিটিক্স', icon: '📊' },
    { key: 'duas', label: '🤲 দুআ', icon: '🤲' },
    { key: 'import', label: '📥 CSV আমদানি', icon: '📥' },
]

const AdminPage: React.FC = () => {
    const { user, loading } = useAuth()
    const [activePanel, setActivePanel] = useState('home')

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="skeleton h-12 w-48 rounded-xl" /></div>
    if (!user) return <Navigate to="/login" replace />

    return (
        <>
            <Helmet><title>অ্যাডমিন — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-white mb-6">🛠️ অ্যাডমিন প্যানেল</h1>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar - desktop / Top tabs - mobile */}
                    <div className="md:w-52 shrink-0">
                        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hide pb-2 md:pb-0">
                            {sidebarItems.map(item => (
                                <button
                                    key={item.key}
                                    onClick={() => setActivePanel(item.key)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap text-left transition-all ${activePanel === item.key
                                        ? 'bg-[#1a3a8f] text-white shadow-lg shadow-blue-900/30'
                                        : 'bg-[#0d1428] text-[#8899bb] hover:text-white border border-blue-800/30 hover:border-blue-700/50'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Panel content */}
                    <div className="flex-1 min-w-0">
                        <Suspense fallback={<div className="p-10 text-center"><div className="skeleton h-12 w-48 mx-auto rounded-xl" /></div>}>
                            {activePanel === 'home' && <AdminHomePanel />}
                            {activePanel === 'books' && <AdminBooksPanel />}
                            {activePanel === 'writers' && <AdminWritersPanel />}
                            {activePanel === 'publishers' && <AdminPublishersPanel />}
                            {activePanel === 'categories' && <AdminCategoriesPanel />}
                            {activePanel === 'users' && <AdminUsersPanel />}
                            {activePanel === 'analytics' && <AdminAnalyticsPanel />}
                            {activePanel === 'duas' && <AdminDuasPanel />}
                            {activePanel === 'import' && <AdminCSVImportPanel />}
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminPage
