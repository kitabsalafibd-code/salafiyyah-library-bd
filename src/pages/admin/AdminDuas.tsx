import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/Toast'

const AdminDuasPanel: React.FC = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ title: '', arabic: '', bangla_translation: '', bangla_transliteration: '', source: '', category: '' })

    const { data: duas, isLoading } = useQuery({
        queryKey: ['admin-duas'],
        queryFn: async () => { const { data } = await supabase.from('duas').select('*').order('created_at', { ascending: false }); return data || [] },
    })

    const openAdd = () => { setForm({ title: '', arabic: '', bangla_translation: '', bangla_transliteration: '', source: '', category: '' }); setEditingId(null); setShowModal(true) }
    const openEdit = (d: any) => { setForm({ title: d.title || '', arabic: d.arabic || '', bangla_translation: d.bangla_translation || d.bangla || '', bangla_transliteration: d.bangla_transliteration || '', source: d.source || d.reference || '', category: d.category || '' }); setEditingId(d.id); setShowModal(true) }

    const saveMutation = useMutation({
        mutationFn: async () => {
            if (editingId) await supabase.from('duas').update(form).eq('id', editingId)
            else await supabase.from('duas').insert(form)
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-duas'] }); showToast('দুআ সংরক্ষিত!'); setShowModal(false) },
        onError: () => showToast('ত্রুটি হয়েছে', 'error'),
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => { await supabase.from('duas').delete().eq('id', id) },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-duas'] }); showToast('দুআ মুছে ফেলা হয়েছে') },
    })

    const inputCls = "w-full px-3 py-2.5 rounded-lg bg-[#111a33] border border-blue-800/40 text-white text-sm focus:border-[#f0c040] focus:outline-none"

    return (
        <div className="admin-duas-panel">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 admin-header">
                <h2 className="text-lg font-bold text-white">🤲 দুআ পরিচালনা</h2>
                <button onClick={openAdd} className="px-4 py-2 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-lg text-sm transition-colors w-full sm:w-auto">+ নতুন দুআ</button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-blue-800/30 admin-table-container">
                <table className="w-full text-sm admin-table">
                    <thead><tr className="bg-[#111a33] text-[#8899bb]"><th className="px-3 py-3 text-left">শিরোনাম</th><th className="px-3 py-3 text-left">ক্যাটাগরি</th><th className="px-3 py-3 text-center">অ্যাকশন</th></tr></thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={3} className="text-center py-8"><div className="skeleton h-8 w-48 mx-auto rounded" /></td></tr> :
                            duas?.map((d: any) => (
                                <tr key={d.id} className="border-t border-blue-800/20 hover:bg-[#111a33]/50">
                                    <td className="px-3 py-2 text-white">{d.title || d.arabic?.substring(0, 40) + '...'}</td>
                                    <td className="px-3 py-2 text-[#8899bb]">{d.category || '-'}</td>
                                    <td className="px-3 py-2 text-center">
                                        <button onClick={() => openEdit(d)} className="text-[#3d6bff] hover:underline text-xs mr-2">সম্পাদনা</button>
                                        <button onClick={() => { if (confirm('মুছে ফেলতে চান?')) deleteMutation.mutate(d.id) }} className="text-red-400 hover:underline text-xs">মুছুন</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-white mb-6">{editingId ? '📝 দুআ সম্পাদনা' : '➕ নতুন দুআ'}</h3>
                        <div className="space-y-4">
                            <div><label className="text-[#8899bb] text-xs block mb-1">শিরোনাম</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} /></div>
                            <div><label className="text-[#8899bb] text-xs block mb-1">আরবী</label><textarea value={form.arabic} onChange={e => setForm(f => ({ ...f, arabic: e.target.value }))} rows={2} className={inputCls} dir="rtl" /></div>
                            <div><label className="text-[#8899bb] text-xs block mb-1">বাংলা অনুবাদ</label><textarea value={form.bangla_translation} onChange={e => setForm(f => ({ ...f, bangla_translation: e.target.value }))} rows={2} className={inputCls} /></div>
                            <div><label className="text-[#8899bb] text-xs block mb-1">বাংলা উচ্চারণ</label><input value={form.bangla_transliteration} onChange={e => setForm(f => ({ ...f, bangla_transliteration: e.target.value }))} className={inputCls} /></div>
                            <div><label className="text-[#8899bb] text-xs block mb-1">উৎস</label><input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} className={inputCls} /></div>
                            <div><label className="text-[#8899bb] text-xs block mb-1">ক্যাটাগরি</label><input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls} /></div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="px-6 py-2.5 bg-gradient-to-r from-[#1a3a8f] to-[#2952cc] text-white rounded-xl text-sm font-semibold disabled:opacity-50">{saveMutation.isPending ? 'সংরক্ষণ...' : 'সংরক্ষণ'}</button>
                            <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-blue-800/40 text-[#8899bb] rounded-xl text-sm">বাতিল</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDuasPanel
