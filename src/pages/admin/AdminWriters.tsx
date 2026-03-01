import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/Toast'

const AdminWritersPanel: React.FC = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', bio: '', avatar: '', is_featured: false })

    const { data: writers, isLoading } = useQuery({
        queryKey: ['admin-writers'],
        queryFn: async () => { const { data } = await supabase.from('authors').select('*').order('name'); return data || [] },
    })

    const openAdd = () => { setForm({ name: '', bio: '', avatar: '', is_featured: false }); setEditingId(null); setShowModal(true) }
    const openEdit = (w: any) => { setForm({ name: w.name || '', bio: w.bio || '', avatar: w.avatar || '', is_featured: w.is_featured || false }); setEditingId(w.id); setShowModal(true) }

    const saveMutation = useMutation({
        mutationFn: async () => {
            const data = { name: form.name, bio: form.bio, avatar: form.avatar, is_featured: form.is_featured }
            if (editingId) await supabase.from('authors').update(data).eq('id', editingId)
            else await supabase.from('authors').insert(data)
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-writers'] }); showToast(editingId ? 'লেখক আপডেট হয়েছে!' : 'লেখক যোগ হয়েছে!'); setShowModal(false) },
        onError: () => showToast('ত্রুটি হয়েছে', 'error'),
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => { await supabase.from('authors').delete().eq('id', id) },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-writers'] }); showToast('লেখক মুছে ফেলা হয়েছে') },
    })

    const toggleFeatured = useMutation({
        mutationFn: async ({ id, val }: { id: string; val: boolean }) => { await supabase.from('authors').update({ is_featured: val }).eq('id', id) },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-writers'] }),
    })

    const inputCls = "w-full px-3 py-2.5 rounded-lg bg-[#111a33] border border-blue-800/40 text-white text-sm focus:border-[#f0c040] focus:outline-none"

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">✍️ লেখক পরিচালনা</h2>
                <button onClick={openAdd} className="px-4 py-2 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-lg text-sm transition-colors">+ নতুন লেখক</button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-blue-800/30">
                <table className="w-full text-sm">
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
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
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
