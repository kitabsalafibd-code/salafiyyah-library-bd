import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-[#0a1628] border border-[#c9a84c]/30 rounded-2xl p-8 shadow-2xl text-center"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-[#8899bb] hover:text-white transition-colors"
                        >
                            ✕
                        </button>

                        <div className="mb-6">
                            <div className="w-16 h-16 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c9a84c]/20">
                                <span className="text-3xl">🤖</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">লগইন প্রয়োজন</h2>
                            <p className="text-[#8899bb] leading-relaxed">
                                AI সহকারী ব্যবহার করতে অনুগ্রহ করে প্রথমে সাইন আপ বা লগইন করুন।
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    onClose();
                                }}
                                className="w-full py-3 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold rounded-xl transition-all shadow-lg shadow-yellow-900/10"
                            >
                                লগইন করুন
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/register');
                                    onClose();
                                }}
                                className="w-full py-3 bg-transparent border border-[#c9a84c]/50 text-[#c9a84c] hover:bg-[#c9a84c]/10 font-bold rounded-xl transition-all"
                            >
                                সাইন আপ করুন
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
