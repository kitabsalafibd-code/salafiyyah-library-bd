import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

const EDGE_FUNCTION_URL = 'https://ermxrcaqkblsaespedvs.supabase.co/functions/v1/groq-chat'

const AIChatPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }, [])

    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'আসসালামু আলাইকুম! আমি **কিতাব সহকারী**। বই, কুরআন, হাদীস বা ইসলামী বিষয়ে আমাকে প্রশ্ন করুন। 📖' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (messages.length > 1 || loading) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, loading])

    const handleSend = useCallback(async () => {
        if (!input.trim() || loading) return
        const userMsg: Message = { role: 'user', content: input.trim() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        // Build conversation history (last 10 messages)
        const history = [...messages, userMsg].slice(-10).map(m => ({ role: m.role, content: m.content }))

        try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 30000)

            const res = await fetch(EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content, conversationHistory: history }),
                signal: controller.signal,
            })
            clearTimeout(timeout)

            if (!res.ok) throw new Error('API error')
            const data = await res.json()
            const aiResponse = data.output || data.response || data.message || 'দুঃখিত, উত্তর পাওয়া যায়নি।'

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
        } catch (err: any) {
            const errorMsg = err.name === 'AbortError'
                ? 'সার্ভার সাড়া দিচ্ছে না। একটু পরে চেষ্টা করুন।'
                : 'দুঃখিত, সমস্যা হয়েছে। আবার চেষ্টা করুন।'
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
        } finally {
            setLoading(false)
        }
    }, [input, loading, messages])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            <Helmet><title>কিতাব সহকারী — Salafiyyah Library BD</title></Helmet>
            <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col container page-content chat-container" style={{ height: 'calc(100vh - 180px)', overflowX: 'hidden' }}>
                {/* Header */}
                <div className="mb-4 chat-header">
                    <h1 className="text-2xl font-bold text-white section-title">🤖 কিতাব সহকারী</h1>
                    <p className="text-[#8899bb] text-sm">ইসলামী জ্ঞান সম্পর্কে প্রশ্ন করুন</p>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-hide message-list">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                ? 'bg-gradient-to-r from-[#c9a84c] to-[#f0c040] text-[#0a0f1e]'
                                : 'bg-[#0d1428] border border-blue-800/40 text-white'
                                }`}>
                                {msg.role === 'assistant' ? (
                                    <div className="prose prose-sm prose-invert max-w-none [&_p]:text-white [&_p]:leading-relaxed [&_p]:mb-2 [&_strong]:text-[#f0c040] [&_em]:text-[#c9a84c] [&_code]:text-[#3d6bff] [&_code]:bg-[#111a33] [&_code]:px-1 [&_code]:rounded [&_ul]:text-[#8899bb] [&_ol]:text-[#8899bb] [&_li]:mb-1 [&_a]:text-[#3d6bff]">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-sm leading-relaxed font-semibold">{msg.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-[#0d1428] border border-blue-800/40 rounded-2xl px-5 py-4">
                                <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 bg-[#f0c040] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2.5 h-2.5 bg-[#f0c040] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2.5 h-2.5 bg-[#f0c040] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-3 items-end chat-input-area">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="আপনার প্রশ্ন লিখুন... (Shift+Enter নতুন লাইন)"
                        rows={1}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#0d1428] border border-blue-800/40 text-white placeholder-[#8899bb] focus:border-[#f0c040] focus:outline-none resize-none max-h-32 chat-input"
                        style={{ minHeight: '48px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-[#c9a84c] to-[#f0c040] text-[#0a0f1e] rounded-xl transition-all disabled:opacity-50 font-bold shrink-0 hover:shadow-lg hover:shadow-yellow-900/20"
                    >
                        পাঠান
                    </button>
                </div>
            </div>
        </>
    )
}

export default AIChatPage
