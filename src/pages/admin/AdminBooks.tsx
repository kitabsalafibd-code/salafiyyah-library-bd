import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/Toast'
import { getFullSizeImage } from '../../lib/utils'

interface BookForm {
    title: string; author_id: string; publisher_id: string; category_id: string
    description: string; cover_image_url: string; pdf_preview_url: string
    price: string; is_featured: boolean
    meta_description: string; meta_keywords: string; slug: string
    purchase_links: { label: string; url: string }[]
}
const emptyForm: BookForm = {
    title: '', author_id: '', publisher_id: '', category_id: '',
    description: '', cover_image_url: '', pdf_preview_url: '',
    price: '', is_featured: false,
    meta_description: '', meta_keywords: '', slug: '',
    purchase_links: []
}

const AdminBooksPanel: React.FC = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<BookForm>(emptyForm)

    const { data: books, isLoading } = useQuery({
        queryKey: ['admin-books'],
        queryFn: async () => {
            const { data } = await supabase.from('books').select('*, authors:author_id(name), categories:category_id(name)').order('created_at', { ascending: false })
            return data || []
        },
    })

    const { data: authors } = useQuery({ queryKey: ['all-authors'], queryFn: async () => { const { data } = await supabase.from('authors').select('id, name').order('name'); return data || [] } })
    const { data: publishers } = useQuery({ queryKey: ['all-publishers'], queryFn: async () => { const { data } = await supabase.from('publishers').select('id, name').order('name'); return data || [] } })
    const { data: categories } = useQuery({ queryKey: ['all-categories'], queryFn: async () => { const { data } = await supabase.from('categories').select('id, name').order('name'); return data || [] } })

    const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true) }
    const openEdit = (book: any) => {
        setForm({
            title: book.title || '', author_id: book.author_id || '', publisher_id: book.publisher_id || '',
            category_id: book.category_id || '', description: book.description || '', cover_image_url: book.cover_image_url || '',
            pdf_preview_url: book.pdf_preview_url || '', price: book.price?.toString() || '', is_featured: book.is_featured || false,
            meta_description: book.meta_description || '', meta_keywords: book.meta_keywords || '', slug: book.slug || '',
            purchase_links: []
        })
        setEditingId(book.id)
        setShowModal(true)
    }

    const saveMutation = useMutation({
        mutationFn: async () => {
            const bookData = {
                title: form.title, author_id: form.author_id || null, publisher_id: form.publisher_id || null,
                category_id: form.category_id || null, description: form.description, cover_image_url: form.cover_image_url,
                pdf_preview_url: form.pdf_preview_url, price: form.price ? parseFloat(form.price) : null,
                is_featured: form.is_featured, meta_description: form.meta_description,
                meta_keywords: form.meta_keywords, slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-')
            }
            console.log('Submitting book:', bookData)
            let bookId = editingId
            if (editingId) {
                await supabase.from('books').update(bookData).eq('id', editingId)
            } else {
                const { data } = await supabase.from('books').insert(bookData).select('id').single()
                bookId = data?.id
                // Notify users
                if (bookId) {
                    try {
                        const { data: subscribers } = await supabase.from('notification_preferences').select('user_id').eq('new_book_notify', true)
                        if (subscribers?.length) {
                            const notifs = subscribers.map((s: any) => ({ user_id: s.user_id, book_id: bookId, is_read: false }))
                            await supabase.from('notifications').insert(notifs)
                        }
                    } catch { /* silent */ }
                }
            }
            // Purchase links
            if (bookId && form.purchase_links.length > 0) {
                await supabase.from('purchase_links').delete().eq('book_id', bookId)
                const links = form.purchase_links.filter(l => l.label && l.url).map(l => ({ book_id: bookId, label: l.label, url: l.url }))
                if (links.length) await supabase.from('purchase_links').insert(links)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-books'] })
            showToast(editingId ? 'বই আপডেট হয়েছে!' : 'বই সফলভাবে যোগ হয়েছে!')
            setShowModal(false)
        },
        onError: () => showToast('ত্রুটি হয়েছে', 'error'),
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => { await supabase.from('books').delete().eq('id', id) },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-books'] }); showToast('বই মুছে ফেলা হয়েছে') },
    })

    const toggleFeatured = useMutation({
        mutationFn: async ({ id, val }: { id: string; val: boolean }) => { await supabase.from('books').update({ is_featured: val }).eq('id', id) },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-books'] }),
    })

    const addPurchaseLink = () => setForm(f => ({ ...f, purchase_links: [...f.purchase_links, { label: '', url: '' }] }))
    const removePurchaseLink = (i: number) => setForm(f => ({ ...f, purchase_links: f.purchase_links.filter((_, idx) => idx !== i) }))
    const updatePurchaseLink = (i: number, field: 'label' | 'url', val: string) => {
        setForm(f => ({ ...f, purchase_links: f.purchase_links.map((l, idx) => idx === i ? { ...l, [field]: val } : l) }))
    }

    const inputCls = "w-full px-3 py-2.5 rounded-lg bg-[#111a33] border border-blue-800/40 text-white text-sm focus:border-[#f0c040] focus:outline-none"
    const labelCls = "text-[#8899bb] text-xs block mb-1"

    return (
        <div className="admin-books-panel">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 admin-header">
                <h2 className="text-lg font-bold text-white">📚 বই পরিচালনা</h2>
                <button onClick={openAdd} className="px-4 py-2 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-lg text-sm transition-colors w-full sm:w-auto">+ নতুন বই যোগ করুন</button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-blue-800/30 admin-table-container">
                <table className="w-full text-sm admin-table">
                    <thead><tr className="bg-[#111a33] text-[#8899bb]">
                        <th className="px-3 py-3 text-left">প্রচ্ছদ</th><th className="px-3 py-3 text-left">শিরোনাম</th>
                        <th className="px-3 py-3 text-left">লেখক</th><th className="px-3 py-3 text-left">ক্যাটাগরি</th>
                        <th className="px-3 py-3 text-left">মূল্য</th><th className="px-3 py-3 text-center">ফিচার্ড</th>
                        <th className="px-3 py-3 text-center">অ্যাকশন</th>
                    </tr></thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={7} className="text-center py-8"><div className="skeleton h-8 w-48 mx-auto rounded" /></td></tr> :
                            books?.map((book: any) => (
                                <tr key={book.id} className="border-t border-blue-800/20 hover:bg-[#111a33]/50">
                                    <td className="px-3 py-2"><div className="w-10 h-14 bg-[#111a33] rounded overflow-hidden">{book.cover_image_url ? <img src={getFullSizeImage(book.cover_image_url)} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xs">📖</span>}</div></td>
                                    <td className="px-3 py-2 text-white font-medium max-w-[200px] truncate">{book.title}</td>
                                    <td className="px-3 py-2 text-[#c9a84c]">{book.authors?.name || '-'}</td>
                                    <td className="px-3 py-2 text-[#8899bb]">{book.categories?.name || '-'}</td>
                                    <td className="px-3 py-2 text-[#f0c040]">{book.price ? `৳${book.price}` : '-'}</td>
                                    <td className="px-3 py-2 text-center">
                                        <button onClick={() => toggleFeatured.mutate({ id: book.id, val: !book.is_featured })}
                                            className={`w-8 h-4 rounded-full relative transition-colors ${book.is_featured ? 'bg-[#f0c040]' : 'bg-[#2a3555]'}`}>
                                            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${book.is_featured ? 'left-4' : 'left-0.5'}`} />
                                        </button>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button onClick={() => openEdit(book)} className="text-[#3d6bff] hover:underline text-xs mr-2">সম্পাদনা</button>
                                        <button onClick={() => { if (confirm('মুছে ফেলতে চান?')) deleteMutation.mutate(book.id) }} className="text-red-400 hover:underline text-xs">মুছুন</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-[#0d1428] rounded-2xl border border-blue-800/40 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-white mb-6">{editingId ? '📝 বই সম্পাদনা' : '➕ নতুন বই যোগ করুন'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2"><label className={labelCls}>শিরোনাম *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} /></div>
                            <div><label className={labelCls}>লেখক</label><select value={form.author_id} onChange={e => setForm(f => ({ ...f, author_id: e.target.value }))} className={inputCls}><option value="">নির্বাচন করুন</option>{authors?.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
                            <div><label className={labelCls}>প্রকাশনী</label><select value={form.publisher_id} onChange={e => setForm(f => ({ ...f, publisher_id: e.target.value }))} className={inputCls}><option value="">নির্বাচন করুন</option>{publishers?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                            <div><label className={labelCls}>ক্যাটাগরি</label><select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className={inputCls}><option value="">নির্বাচন করুন</option>{categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                            <div><label className={labelCls}>মূল্য (৳)</label><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={inputCls} /></div>
                            <div className="md:col-span-2"><label className={labelCls}>বিবরণ</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={inputCls} /></div>
                            <div><label className={labelCls}>কভার ইমেজ URL</label><input value={form.cover_image_url} onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))} className={inputCls} /></div>
                            <div><label className={labelCls}>PDF প্রিভিউ URL</label><input value={form.pdf_preview_url} onChange={e => setForm(f => ({ ...f, pdf_preview_url: e.target.value }))} className={inputCls} /></div>
                            <div><label className={labelCls}>Slug</label><input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputCls} /></div>
                            <div><label className={labelCls}>Meta Description</label><input value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} className={inputCls} /></div>
                            <div><label className={labelCls}>Meta Keywords</label><input value={form.meta_keywords} onChange={e => setForm(f => ({ ...f, meta_keywords: e.target.value }))} className={inputCls} /></div>
                            <div className="flex items-center gap-3">
                                <label className={labelCls}>ফিচার্ড</label>
                                <button onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${form.is_featured ? 'bg-[#f0c040]' : 'bg-[#2a3555]'}`}>
                                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_featured ? 'left-5' : 'left-0.5'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Purchase Links */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className={labelCls}>ক্রয় লিংক</label>
                                <button onClick={addPurchaseLink} className="text-xs text-[#3d6bff] hover:underline">+ লিংক যোগ করুন</button>
                            </div>
                            {form.purchase_links.map((link, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input placeholder="লেবেল (Rokomari, Wafilife...)" value={link.label} onChange={e => updatePurchaseLink(i, 'label', e.target.value)} className={`${inputCls} flex-1`} />
                                    <input placeholder="URL" value={link.url} onChange={e => updatePurchaseLink(i, 'url', e.target.value)} className={`${inputCls} flex-1`} />
                                    <button onClick={() => removePurchaseLink(i)} className="text-red-400 text-xs px-2">✕</button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.title}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#1a3a8f] to-[#2952cc] text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all">
                                {saveMutation.isPending ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                            </button>
                            <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-blue-800/40 text-[#8899bb] rounded-xl text-sm hover:text-white transition-colors">বাতিল</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminBooksPanel
