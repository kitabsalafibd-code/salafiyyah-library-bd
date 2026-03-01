import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/Toast'

const AdminUsersPanel: React.FC = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => { const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }); return data || [] },
    })

    const toggleAdmin = useMutation({
        mutationFn: async ({ id, val }: { id: string; val: boolean }) => { await supabase.from('profiles').update({ is_admin: val }).eq('id', id) },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); showToast('ব্যবহারকারী আপডেট হয়েছে') },
        onError: () => showToast('ত্রুটি হয়েছে', 'error'),
    })

    return (
        <div>
            <h2 className="text-lg font-bold text-white mb-4">👥 ব্যবহারকারী পরিচালনা</h2>
            <div className="overflow-x-auto rounded-xl border border-blue-800/30">
                <table className="w-full text-sm">
                    <thead><tr className="bg-[#111a33] text-[#8899bb]">
                        <th className="px-3 py-3 text-left">নাম</th><th className="px-3 py-3 text-left">ইমেইল</th>
                        <th className="px-3 py-3 text-left">যোগদান</th><th className="px-3 py-3 text-center">অ্যাডমিন</th>
                    </tr></thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={4} className="text-center py-8"><div className="skeleton h-8 w-48 mx-auto rounded" /></td></tr> :
                            users?.map((u: any) => (
                                <tr key={u.id} className="border-t border-blue-800/20 hover:bg-[#111a33]/50">
                                    <td className="px-3 py-2 text-white">{u.full_name || '-'}</td>
                                    <td className="px-3 py-2 text-[#8899bb]">{u.email || '-'}</td>
                                    <td className="px-3 py-2 text-[#8899bb] text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString('bn-BD') : '-'}</td>
                                    <td className="px-3 py-2 text-center">
                                        <button onClick={() => toggleAdmin.mutate({ id: u.id, val: !u.is_admin })}
                                            className={`w-8 h-4 rounded-full relative transition-colors ${u.is_admin ? 'bg-[#f0c040]' : 'bg-[#2a3555]'}`}>
                                            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${u.is_admin ? 'left-4' : 'left-0.5'}`} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminUsersPanel
