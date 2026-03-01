import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/Toast'
import Papa from 'papaparse'

const AdminWritersPanel: React.FC = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', bio: '', avatar: '', is_featured: false })

    // Import State
    const fileRef = useRef<HTMLInputElement>(null)
    const [showImportModal, setShowImportModal] = useState(false)
    const [importRows, setImportRows] = useState<any[]>([])
    const [importing, setImporting] = useState(false)
    const [importProgress, setImportProgress] = useState(0)
    const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)

    const { data: writers, isLoading } = useQuery({
        queryKey: ['admin-writers'],
        queryFn: async () => { const { data } = await supabase.from('writers').select('*').order('name'); return data || [] },
    })

    const openAdd = () => { setForm({ name: '', bio: '', avatar: '', is_featured: false }); setEditingId(null); setShowModal(true) }
    const openEdit = (w: any) => { setForm({ name: w.name || '', bio: w.bio || '', avatar: w.avatar || '', is_featured: w.is_featured || false }); setEditingId(w.id); setShowModal(true) }

    const saveMutation = useMutation({
        mutationFn: async () => {
            const data = { name: form.name, bio: form.bio, avatar: form.avatar, is_featured: form.is_featured }
            if (editingId) await supabase.from('writers').update(data).eq('id', editingId)
            else await supabase.from('writers').insert(data)
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-writers'] }); showToast(editingId ? 'লেখক আপডেট হয়েছে!' : 'লেখক যোগ হয়েছে!'); setShowModal(false) },
        onError: () => showToast('ত্রুটি হয়েছে', 'error'),
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => { await supabase.from('writers').delete().eq('id', id) },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-writers'] }); showToast('লেখক মুছে ফেলা হয়েছে') },
    })

    const toggleFeatured = useMutation({
        mutationFn: async ({ id, val }: { id: string; val: boolean }) => { await supabase.from('writers').update({ is_featured: val }).eq('id', id) },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-writers'] }),
    })

    // Import Handlers
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        Papa.parse<any>(file, {
            header: true, skipEmptyLines: true,
            complete: (res) => { setImportRows(res.data); setImportResult(null) },
            error: () => showToast('CSV পার্সিং ব্যর্থ', 'error'),
        })
    }
    const downloadTemplate = () => {
        const headers = 'name,bio,avatar_url,is_featured'
        const blob = new Blob([headers + '\n'], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'writers_template.csv'; a.click()
        URL.revokeObjectURL(url)
    }
    const handleImport = async () => {
        setImporting(true); setImportProgress(0); let success = 0; let failed = 0;
        for (let i = 0; i < importRows.length; i++) {
            const row = importRows[i]
            if (!row.name?.trim()) { failed++; continue }
            try {
                await supabase.from('writers').insert({
                    name: row.name.trim(),
                    bio: row.bio || '',
                    avatar: row.avatar_url || '',
                    is_featured: row.is_featured?.toLowerCase() === 'true'
                })
                success++
            } catch { failed++ }
            setImportProgress(Math.round(((i + 1) / importRows.length) * 100))
        }
        setImportResult({ success, failed })
        setImporting(false)
        queryClient.invalidateQueries({ queryKey: ['admin-writers'] })
    }

    const inputCls = "w-full px-3 py-2.5 rounded-lg bg-[#111a33] border border-blue-800/40 text-white text-sm focus:border-[#f0c040] focus:outline-none"

    return (
        <div className="admin-writers-panel">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 admin-header">
                <h2 className="text-lg font-bold text-white">✍️ লেখক পরিচালনা</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button onClick={() => setShowImportModal(true)} className="px-4 py-2 bg-[#0d1428] border border-blue-800/40 hover:bg-[#111a33] text-white rounded-lg text-sm transition-colors w-full sm:w-auto">📥 CSV আমদানি</button>
                    <button onClick={openAdd} className="px-4 py-2 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-lg text-sm transition-colors w-full sm:w-auto">+ নতুন লেখক</button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-blue-800/30 admin-table-container">
                <table className="w-full text-sm admin-table">
                    <thead><tr className="bg-[#111a33] text-[#8899bb]">
                        <th className="px-3 py-3 text-left">ছবি</th><th className="px-3 py-3 text-left">নাম</th><th className="px-3 py-3 text-center">ফিচার্ড</th><th className="px-3 py-3 text-center">অ্যাকশন</th>
                    </tr></thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={4} className="text-center py-8"><div className="skeleton h-8 w-48 mx-auto rounded" /></td></tr> :
                            writers?.map((w: any) => (
                                <tr key={w.id} className="border-t border-blue-800/20 hover:bg-[#111a33]/50">
                                    <td className="px-3 py-2"><div className="w-10 h-10 rounded-full bg-[#1a3a8f] overflow-hidden flex items-center justify-center text-white text-sm">{w.avatar ? <img src={w.avatar} alt="" className="w-full h-full object-cover" /> : w.name?.charAt(0) || '✍'}</div></td>
                                    <td className="px-3 py-2 text-white">{w.name}</td>
                                    <td className="px-3 py-2 text-center">
                                        <button onClick={() => toggleFeatured.mutate({ id: w.id, val: !w.is_featured })} className={`w-8 h-4 rounded-full relative transition-colors ${w.is_featured ? 'bg-[#f0c040]' : 'bg-[#2a3555]'}`}>
                                            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${w.is_featured ? 'left-4' : 'left-0.5'}`} />
                                        </button>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button onClick={() => openEdit(w)} className="text-[#3d6bff] hover:underline text-xs mr-2">সম্পাদনা</button>
                                        <button onClick={() => { if (confirm('মুছে ফেলতে চান?')) deleteMutation.mutate(w.id) }} className="text-red-400 hover:underline text-xs">মুছুন</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowImportModal(false)}>
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 w-full max-w-2xl p-6 relative admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">📥 লেখক CSV আমদানি</h3>
                        <button onClick={() => setShowImportModal(false)} className="absolute top-4 right-4 text-[#8899bb] hover:text-white">✕</button>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-[#111a33] p-4 rounded-xl border border-blue-800/30">
                                <div>
                                    <p className="text-white text-sm">১. টেমপ্লেট ডাউনলোড করুন</p>
                                    <p className="text-[#8899bb] text-xs">name, bio, avatar_url, is_featured</p>
                                </div>
                                <button onClick={downloadTemplate} className="px-4 py-2 bg-[#1a3a8f] text-white rounded-lg text-sm hover:bg-[#2952cc]">ডাউনলোড</button>
                            </div>

                            <div className="bg-[#111a33] p-8 rounded-xl border border-blue-800/30 border-dashed text-center cursor-pointer hover:border-[#c9a84c]/50" onClick={() => fileRef.current?.click()}>
                                <p className="text-2xl mb-2">📁</p>
                                <p className="text-white">২. ফাইল আপলোড করুন</p>
                                <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
                            </div>

                            {importRows.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-white text-sm mb-2">৩. প্রিভিউ ({importRows.length} জন)</p>
                                    <div className="max-h-40 overflow-y-auto mb-4 border border-blue-800/30 rounded-xl">
                                        <table className="w-full text-xs">
                                            <thead className="sticky top-0 bg-[#111a33] text-[#8899bb]"><tr><th className="p-2 text-left">নাম</th><th className="p-2 text-left">বায়ো</th></tr></thead>
                                            <tbody>{importRows.slice(0, 5).map((r, i) => <tr key={i} className="border-t border-blue-800/10 text-white"><td className="p-2">{r.name}</td><td className="p-2 truncate max-w-xs">{r.bio}</td></tr>)}</tbody>
                                        </table>
                                    </div>

                                    {importing && (
                                        <div className="w-full bg-[#111a33] rounded-full h-2 mb-2">
                                            <div className="bg-[#f0c040] h-2 rounded-full transition-all" style={{ width: `${importProgress}%` }}></div>
                                        </div>
                                    )}

                                    {importResult ? (
                                        <p className="text-sm">✅ {importResult.success} সফল | ❌ {importResult.failed} ব্যর্থ</p>
                                    ) : (
                                        <button onClick={handleImport} disabled={importing} className="w-full py-3 bg-gradient-to-r from-[#c9a84c] to-[#f0c040] text-[#0a0f1e] font-bold rounded-xl disabled:opacity-50">
                                            {importing ? `আমদানি হচ্ছে... ${importProgress}%` : `আমদানি করুন (${importRows.length})`}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit/Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 w-full max-w-md p-6 admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-white mb-6">{editingId ? '📝 লেখক সম্পাদনা' : '➕ নতুন লেখক'}</h3>
                        <div className="space-y-4">
                            <div><label className="text-[#8899bb] text-xs block mb-1">নাম *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} /></div>
                            <div><label className="text-[#8899bb] text-xs block mb-1">জীবনী</label><textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className={inputCls} /></div>
                            <div><label className="text-[#8899bb] text-xs block mb-1">ছবি URL</label><input value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className={inputCls} /></div>
                            <div className="flex items-center gap-3">
                                <span className="text-[#8899bb] text-xs">ফিচার্ড</span>
                                <button onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))} className={`w-10 h-5 rounded-full relative transition-colors ${form.is_featured ? 'bg-[#f0c040]' : 'bg-[#2a3555]'}`}>
                                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_featured ? 'left-5' : 'left-0.5'}`} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name} className="px-6 py-2.5 bg-gradient-to-r from-[#1a3a8f] to-[#2952cc] text-white rounded-xl text-sm font-semibold disabled:opacity-50">{saveMutation.isPending ? 'সংরক্ষণ...' : 'সংরক্ষণ'}</button>
                            <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-blue-800/40 text-[#8899bb] rounded-xl text-sm">বাতিল</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminWritersPanel
