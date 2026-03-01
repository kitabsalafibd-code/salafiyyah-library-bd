import React, { useState, useRef } from 'react'
import Papa from 'papaparse'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/Toast'
import { getFullSizeImage } from '../../lib/utils'

interface CSVRow {
    title: string; author_name: string; publisher_name: string; category_name: string
    description: string; cover_image_url: string; price: string; is_featured: string
    rokomari_url: string; wafilife_url: string
}

const AdminCSVImportPanel: React.FC = () => {
    const { showToast } = useToast()
    const fileRef = useRef<HTMLInputElement>(null)
    const [rows, setRows] = useState<CSVRow[]>([])
    const [importing, setImporting] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState<{ success: number; failed: number } | null>(null)

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        Papa.parse<CSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (res) => { setRows(res.data); setResult(null) },
            error: () => showToast('CSV পার্সিং ব্যর্থ', 'error'),
        })
    }

    const downloadTemplate = () => {
        const headers = 'title,author_name,publisher_name,category_name,description,cover_image_url,price,is_featured,rokomari_url,wafilife_url'
        const blob = new Blob([headers + '\n'], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'book_import_template.csv'; a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = async () => {
        setImporting(true); setProgress(0); let success = 0; let failed = 0
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            try {
                // Find or create author
                let author_id = null
                if (row.author_name?.trim()) {
                    const { data: existing } = await supabase.from('authors').select('id').ilike('name', row.author_name.trim()).limit(1).single()
                    if (existing) { author_id = existing.id }
                    else { const { data: created } = await supabase.from('authors').insert({ name: row.author_name.trim() }).select('id').single(); author_id = created?.id }
                }
                // Find or create publisher
                let publisher_id = null
                if (row.publisher_name?.trim()) {
                    const { data: existing } = await supabase.from('publishers').select('id').ilike('name', row.publisher_name.trim()).limit(1).single()
                    if (existing) { publisher_id = existing.id }
                    else { const { data: created } = await supabase.from('publishers').insert({ name: row.publisher_name.trim() }).select('id').single(); publisher_id = created?.id }
                }
                // Find category
                let category_id = null
                if (row.category_name?.trim()) {
                    const { data: cat } = await supabase.from('categories').select('id').ilike('name', row.category_name.trim()).limit(1).single()
                    category_id = cat?.id || null
                }
                // Insert book
                const { data: book } = await supabase.from('books').insert({
                    title: row.title, author_id, publisher_id, category_id,
                    description: row.description || '', cover_image_url: getFullSizeImage(row.cover_image_url) || '',
                    price: row.price ? parseFloat(row.price) : null,
                    is_featured: row.is_featured?.toLowerCase() === 'true',
                }).select('id').single()
                // Purchase links
                if (book?.id) {
                    const links = []
                    if (row.rokomari_url?.trim()) links.push({ book_id: book.id, label: 'Rokomari', url: row.rokomari_url.trim() })
                    if (row.wafilife_url?.trim()) links.push({ book_id: book.id, label: 'Wafilife', url: row.wafilife_url.trim() })
                    if (links.length) await supabase.from('purchase_links').insert(links)
                }
                success++
            } catch { failed++ }
            setProgress(Math.round(((i + 1) / rows.length) * 100))
        }
        setResult({ success, failed })
        setImporting(false)
        showToast(`আমদানি সম্পন্ন: ${success} সফল, ${failed} ব্যর্থ`, failed > 0 ? 'error' : 'success')
    }

    return (
        <div className="admin-csv-panel">
            <h2 className="text-lg font-bold text-white mb-4 admin-header">📥 CSV আমদানি</h2>
            <div className="space-y-6">
                {/* Download template */}
                <div className="bg-[#111a33] rounded-xl border border-blue-800/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 template-card">
                    <div>
                        <p className="text-white text-sm font-semibold">CSV টেমপ্লেট ডাউনলোড</p>
                        <p className="text-[#8899bb] text-xs">সঠিক ফরম্যাটে CSV তৈরি করুন</p>
                    </div>
                    <button onClick={downloadTemplate} className="px-4 py-2 bg-[#1a3a8f] hover:bg-[#2952cc] text-white rounded-lg text-sm transition-colors w-full sm:w-auto">📥 ডাউনলোড</button>
                </div>

                {/* File upload */}
                <div className="bg-[#111a33] rounded-xl border border-blue-800/30 border-dashed p-8 text-center cursor-pointer hover:border-[#c9a84c]/50 transition-colors"
                    onClick={() => fileRef.current?.click()}>
                    <p className="text-3xl mb-2">📁</p>
                    <p className="text-white text-sm">CSV ফাইল নির্বাচন করুন (ক্লিক করুন)</p>
                    <p className="text-[#8899bb] text-xs mt-1">.csv ফাইল শুধু</p>
                    <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
                </div>

                {/* Preview table */}
                {rows.length > 0 && (
                    <div>
                        <p className="text-white text-sm mb-2">📋 প্রিভিউ ({rows.length} টি বই)</p>
                        <div className="overflow-x-auto rounded-xl border border-blue-800/30 max-h-[300px] overflow-y-auto admin-table-container">
                            <table className="w-full text-xs admin-table">
                                <thead className="sticky top-0"><tr className="bg-[#111a33] text-[#8899bb]">
                                    <th className="px-2 py-2 text-left">শিরোনাম</th><th className="px-2 py-2 text-left">লেখক</th>
                                    <th className="px-2 py-2 text-left">প্রকাশনী</th><th className="px-2 py-2 text-left">ক্যাটাগরি</th>
                                    <th className="px-2 py-2 text-left">মূল্য</th>
                                </tr></thead>
                                <tbody>{rows.map((r, i) => (
                                    <tr key={i} className="border-t border-blue-800/10">
                                        <td className="px-2 py-1.5 text-white">{r.title}</td>
                                        <td className="px-2 py-1.5 text-[#c9a84c]">{r.author_name}</td>
                                        <td className="px-2 py-1.5 text-[#8899bb]">{r.publisher_name}</td>
                                        <td className="px-2 py-1.5 text-[#8899bb]">{r.category_name}</td>
                                        <td className="px-2 py-1.5 text-[#f0c040]">{r.price ? `৳${r.price}` : '-'}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>

                        {/* Progress bar */}
                        {importing && (
                            <div className="mt-4">
                                <div className="w-full h-3 bg-[#111a33] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#1a3a8f] to-[#f0c040] transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="text-[#8899bb] text-xs text-center mt-1">{progress}% সম্পন্ন</p>
                            </div>
                        )}

                        {/* Result */}
                        {result && (
                            <div className={`mt-4 p-4 rounded-xl border ${result.failed > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                                <p className={result.failed > 0 ? 'text-red-400' : 'text-green-400'}>
                                    ✅ {result.success} টি বই সফলভাবে আমদানি হয়েছে {result.failed > 0 && `| ❌ ${result.failed} টি ব্যর্থ`}
                                </p>
                            </div>
                        )}

                        {/* Import button */}
                        <button
                            onClick={handleImport} disabled={importing || rows.length === 0}
                            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#c9a84c] to-[#f0c040] text-[#0a0f1e] font-bold rounded-xl disabled:opacity-50 transition-all w-full flex items-center justify-center gap-2"
                        >
                            {importing ? `আমদানি হচ্ছে... (${progress}%)` : `📥 ${rows.length} টি বই আমদানি করুন`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminCSVImportPanel
