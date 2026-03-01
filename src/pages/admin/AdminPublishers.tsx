import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/Toast'
import Papa from 'papaparse'

const AdminPublishersPanel: React.FC = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', logo_url: '', description: '' })

    // Import State
    const fileRef = useRef<HTMLInputElement>(null)
    const [showImportModal, setShowImportModal] = useState(false)
    const [importRows, setImportRows] = useState<any[]>([])
    const [importing, setImporting] = useState(false)
    const [importProgress, setImportProgress] = useState(0)
    const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)

    const { data: publishers, isLoading } = useQuery({
        queryKey: ['admin-publishers'],
        queryFn: async () => { const { data } = await supabase.from('publishers').select('*').order('name'); return data || [] },
    })

    const openAdd = () => { setForm({ name: '', logo_url: '', description: '' }); setEditingId(null); setShowModal(true) }
    const openEdit = (p: any) => { setForm({ name: p.name || '', logo_url: p.logo_url || '', description: p.description || '' }); setEditingId(p.id); setShowModal(true) }

    const saveMutation = useMutation({
        mutationFn: async () => {
            if (editingId) await supabase.from('publishers').update(form).eq('id', editingId)
            else await supabase.from('publishers').insert(form)
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-publishers'] }); showToast(editingId ? 'প্রকাশনী আপডেট!' : 'প্রকাশনী যোগ হয়েছে!'); setShowModal(false) },
        onError: () => showToast('ত্রুটি হয়েছে', 'error'),
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => { await supabase.from('publishers').delete().eq('id', id) },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-publishers'] }); showToast('প্রকাশনী মুছে ফেলা হয়েছে') },
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
        const headers = 'name,description,logo_url'
        const blob = new Blob([headers + '\n'], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'publishers_template.csv'; a.click()
        URL.revokeObjectURL(url)
    }
    const handleImport = async () => {
        setImporting(true); setImportProgress(0); let success = 0; let failed = 0;
        for (let i = 0; i < importRows.length; i++) {
            const row = importRows[i]
            if (!row.name?.trim()) { failed++; continue }
            try {
                await supabase.from('publishers').insert({
                    name: row.name.trim(),
                    description: row.description || '',
                    logo_url: row.logo_url || ''
                })
                success++
            } catch { failed++ }
            setImportProgress(Math.round(((i + 1) / importRows.length) * 100))
        }
        setImportResult({ success, failed })
        setImporting(false)
        queryClient.invalidateQueries({ queryKey: ['admin-publishers'] })
    }

    const inputCls = "w-full px-3 py-2.5 rounded-lg bg-[#111a33] border border-blue-800/40 text-white text-sm focus:border-[#f0c040] focus:outline-none"

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">🏢 প্রকাশনী পরিচালনা</h2>
                <div className="flex gap-2">
                    <button onClick={() => setShowImportModal(true)} className="px-4 py-2 bg-[#0d1428] border border-blue-800/40 hover:bg-[#111a33] text-white rounded-lg text-sm transition-colors">📥 CSV আমদানি</button>
                    <button onClick={openAdd} className="px-4 py-2 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-lg text-sm transition-colors">+ নতুন প্রকাশনী</button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-blue-800/30">
                <table className="w-full text-sm">
                    <thead><tr className="bg-[#111a33] text-[#8899bb]"><th className="px-3 py-3 text-left">লোগো</th><th className="px-3 py-3 text-left">নাম</th><th className="px-3 py-3 text-center">অ্যাকশন</th></tr></thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={3} className="text-center py-8"><div className="skeleton h-8 w-48 mx-auto rounded" /></td></tr> :
                            publishers?.map((p: any) => (
                                <tr key={p.id} className="border-t border-blue-800/20 hover:bg-[#111a33]/50">
                                    <td className="px-3 py-2"><div className="w-10 h-10 rounded-lg bg-[#111a33] overflow-hidden flex items-center justify-center">{p.logo_url ? <img src={p.logo_url} alt="" className="w-full h-full object-contain" /> : <span className="text-sm">🏢</span>}</div></td>
                                    <td className="px-3 py-2 text-white">{p.name}</td>
                                    <td className="px-3 py-2 text-center">
                                        <button onClick={() => openEdit(p)} className="text-[#3d6bff] hover:underline text-xs mr-2">সম্পাদনা</button>
                                        <button onClick={() => { if (confirm('মুছে ফেলতে চান?')) deleteMutation.mutate(p.id) }} className="text-red-400 hover:underline text-xs">মুছুন</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowImportModal(false)}>
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 w-full max-w-2xl p-6 relative" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">📥 প্রকাশনী CSV আমদানি</h3>
                        <button onClick={() => setShowImportModal(false)} className="absolute top-4 right-4 text-[#8899bb] hover:text-white">✕</button>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-[#111a33] p-4 rounded-xl border border-blue-800/30">
                                <div>
                                    <p className="text-white text-sm">১. টেমপ্লেট ডাউনলোড করুন</p>
                                    <p className="text-[#8899bb] text-xs">name, description, logo_url</p>
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
                                    <p className="text-white text-sm mb-2">৩. প্রিভিউ ({importRows.length} প্রকাশনী)</p>
                                    <div className="max-h-40 overflow-y-auto mb-4 border border-blue-800/30 rounded-xl">
                                        <table className="w-full text-xs">
                                            <thead className="sticky top-0 bg-[#111a33] text-[#8899bb]"><tr><th className="p-2 text-left">নাম</th><th className="p-2 text-left">বিবরণ</th></tr></thead>
                                            <tbody>{importRows.slice(0, 5).map((r, i) => <tr key={i} className="border-t border-blue-800/10 text-white"><td className="p-2">{r.name}</td><td className="p-2 truncate max-w-xs">{r.description}</td></tr>)}</tbody>
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
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-white mb-6">{editingId ? '📝 সম্পাদনা' : '➕ নতুন প্রকাশনী'}</h3>
                        <div className="space-y-4">
                            <div><label className="text-[#8899bb] text-xs block mb-1">নাম *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} /></div>
                            <div><label className="text-[#8899bb] text-xs block mb-1">লোগো URL</label><input value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} className={inputCls} /></div>
                            <div><label className="text-[#8899bb] text-xs block mb-1">বিবরণ</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={inputCls} /></div>
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

export default AdminPublishersPanel
