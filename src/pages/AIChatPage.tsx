import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

const EDGE_FUNCTION_URL = 'https://ermxrcaqkblsaespedvs.supabase.co/functions/v1/groq-chat'
const MESSAGE_LIMIT = 5

const MessageComponent: React.FC<{ msg: Message; isLatest: boolean }> = ({ msg, isLatest }) => {
    const [displayedContent, setDisplayedContent] = useState(isLatest && msg.role === 'assistant' ? '' : msg.content)
    const [typing, setTyping] = useState(isLatest && msg.role === 'assistant')

    useEffect(() => {
        if (isLatest && msg.role === 'assistant' && displayedContent.length < msg.content.length) {
            const timeout = setTimeout(() => {
                setDisplayedContent(msg.content.slice(0, displayedContent.length + 1))
            }, 10) // Speed of typing
            return () => clearTimeout(timeout)
        } else {
            setTyping(false)
        }
    }, [msg.content, displayedContent, isLatest, msg.role])

    return (
        <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
            ? 'bg-gradient-to-r from-[#c9a84c] to-[#f0c040] text-[#0a0f1e]'
            : 'bg-[#0d1428] border border-blue-800/40 text-white'
            }`}>
            {msg.role === 'assistant' ? (
                <div className="prose prose-sm prose-invert max-w-none [&_p]:text-white [&_p]:leading-relaxed [&_p]:mb-2 [&_strong]:text-[#f0c040] [&_em]:text-[#c9a84c] [&_code]:text-[#3d6bff] [&_code]:bg-[#111a33] [&_code]:px-1 [&_code]:rounded [&_ul]:text-[#8899bb] [&_ol]:text-[#8899bb] [&_li]:mb-1 [&_a]:text-[#3d6bff]">
                    <ReactMarkdown>{displayedContent}</ReactMarkdown>
                    {typing && (
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-1.5 h-4 ml-1 bg-[#f0c040]"
                        />
                    )}
                </div>
            ) : (
                <p className="text-sm leading-relaxed font-semibold">{msg.content}</p>
            )}
        </div>
    )
}

const AIChatPage: React.FC = () => {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'আসসালামু আলাইকুম! আমি **কিতাব সহকারী**। বই, কুরআন, হাদীস বা ইসলামী বিষয়ে আমাকে প্রশ্ন করুন। 📖' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [messageCount, setMessageCount] = useState(0)
    const [limitReachedFlag, setLimitReachedFlag] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const fetchUsage = useCallback(async () => {
        if (!user) return
        const { data, error } = await supabase
            .from('ai_usage')
            .select('message_count')
            .eq('user_id', user.id)
            .maybeSingle()

        if (!error && data) {
            setMessageCount(data.message_count || 0)
            if (data.message_count >= MESSAGE_LIMIT) {
                setLimitReachedFlag(true)
            } else {
                setLimitReachedFlag(false)
            }
        } else {
            setMessageCount(0)
            setLimitReachedFlag(false)
        }
    }, [user])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
        fetchUsage()
    }, [fetchUsage])

    useEffect(() => {
        if (messages.length > 1 || loading) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, loading])

    const handleSend = useCallback(async () => {
        if (!input.trim() || loading || limitReachedFlag) return

        const userMsg: Message = { role: 'user', content: input.trim() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        // Build conversation history (last 10 messages)
        const history = [...messages, userMsg].slice(-10).map(m => ({ role: m.role, content: m.content }))

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('No session')

            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 30000)

            const res = await fetch(EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ message: userMsg.content, conversationHistory: history }),
                signal: controller.signal,
            })
            clearTimeout(timeout)

            if (!res.ok) throw new Error('API error')
            const data = await res.json()

            if (data.limitReached) {
                setLimitReachedFlag(true)
                setMessages(prev => [...prev, { role: 'assistant', content: 'দুঃখিত, আপনি আজকের ৫টি প্রশ্নের সীমা শেষ করেছেন।' }])
                return
            }

            const aiResponse = data.output || data.response || data.message || 'দুঃখিত, উত্তর পাওয়া যায়নি।'
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])

            // Refresh usage count after message
            fetchUsage()

        } catch (err: any) {
            const errorMsg = err.name === 'AbortError'
                ? 'সার্ভার সাড়া দিচ্ছে না। একটু পরে চেষ্টা করুন।'
                : 'দুঃখিত, সমস্যা হয়েছে। আবার চেষ্টা করুন।'
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
        } finally {
            setLoading(false)
        }
    }, [input, loading, messages, limitReachedFlag, fetchUsage])

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
                <div className="mb-4 chat-header flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-white section-title">🤖 কিতাব সহকারী</h1>
                        <p className="text-[#8899bb] text-sm">ইসলামী জ্ঞান সম্পর্কে প্রশ্ন করুন</p>
                    </div>
                    {/* Counter Pill */}
                    <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 px-3 py-1.5 rounded-full text-[#c9a84c] text-xs font-bold">
                        আজকের প্রশ্ন: {messageCount}/{MESSAGE_LIMIT}
                    </div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-hide message-list">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <MessageComponent msg={msg} isLatest={i === messages.length - 1} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-[#0d1428] border border-blue-800/40 rounded-2xl px-5 py-4">
                                <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 bg-[#f0c040] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2.5 h-2.5 bg-[#f0c040] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2.5 h-2.5 bg-[#f0c040] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex flex-col gap-3 chat-input-area">
                    {limitReachedFlag && (
                        <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-[#c9a84c] text-sm font-bold">
                                আপনি আজকের ৫টি প্রশ্নের সীমা শেষ করেছেন। 🌙
                            </p>
                        </div>
                    )}
                    <div className="flex gap-3 items-end">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={limitReachedFlag ? "সীমা শেষ হয়েছে" : "আপনার প্রশ্ন লিখুন... (Shift+Enter নতুন লাইন)"}
                            rows={1}
                            disabled={loading || limitReachedFlag}
                            className={`flex-1 px-4 py-3 rounded-xl bg-[#0d1428] border border-blue-800/40 text-white placeholder-[#8899bb] focus:border-[#f0c040] focus:outline-none resize-none max-h-32 chat-input ${limitReachedFlag ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                            style={{ minHeight: '48px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim() || limitReachedFlag}
                            className="px-5 py-3 bg-gradient-to-r from-[#c9a84c] to-[#f0c040] text-[#0a0f1e] rounded-xl transition-all disabled:opacity-50 font-bold shrink-0 hover:shadow-lg hover:shadow-yellow-900/20"
                        >
                            পাঠান
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AIChatPage
