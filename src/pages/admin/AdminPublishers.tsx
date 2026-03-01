import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/Toast'

const AdminPublishersPanel: React.FC = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', logo_url: '', description: '' })

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

    const inputCls = "w-full px-3 py-2.5 rounded-lg bg-[#111a33] border border-blue-800/40 text-white text-sm focus:border-[#f0c040] focus:outline-none"

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">🏢 প্রকাশনী পরিচালনা</h2>
                <button onClick={openAdd} className="px-4 py-2 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-lg text-sm transition-colors">+ নতুন প্রকাশনী</button>
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
