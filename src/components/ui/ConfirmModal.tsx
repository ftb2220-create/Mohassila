import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'تأكيد',
    cancelText = 'إلغاء',
    type = 'danger',
    onConfirm,
    onCancel,
    loading = false,
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            icon: 'bg-red-100 text-red-600',
            button: 'bg-red-500 hover:bg-red-600 shadow-red-500/25',
        },
        warning: {
            icon: 'bg-amber-100 text-amber-600',
            button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25',
        },
        info: {
            icon: 'bg-cyan-100 text-cyan-600',
            button: 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/25',
        },
    };
    const c = colors[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-scale-in">
                <div className={`w-16 h-16 rounded-2xl ${c.icon} flex items-center justify-center mx-auto mb-5`}>
                    {type === 'danger' ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    ) : type === 'warning' ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                <h3 className="text-xl font-black text-slate-900 text-center mb-2">{title}</h3>
                <p className="text-sm text-slate-500 text-center mb-8 leading-relaxed">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-3 text-white rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${c.button} disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : null}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
