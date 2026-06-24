import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCTA = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0F1D] text-slate-100 font-sans overflow-hidden relative selection:bg-cyan-500/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[140px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-slate-800/40 backdrop-blur-md bg-[#0A0F1D]/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-500/20">
                            م
                        </div>
                        <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-350">
                            محصّلة
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">الميزات</a>
                        <a href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">حول النظام</a>
                        <a href="#stats" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">الإحصائيات</a>
                    </nav>

                    <button
                        onClick={handleCTA}
                        className="bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-sm font-bold px-6 py-2.5 rounded-xl transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-0.5"
                    >
                        {isAuthenticated ? 'لوحة التحكم ←' : 'تسجيل الدخول'}
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
                <div className="inline-flex items-center gap-2 bg-cyan-950/40 border border-cyan-800/30 px-4 py-2 rounded-full text-xs text-cyan-400 font-bold mb-8 animate-pulse">
                    🚀 نظام إدارة العضويات والبطاقات المتكامل
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.2] md:leading-[1.15] max-w-5xl mx-auto">
                    تحكّم بكامل عضويات وبطاقات{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400">
                        مشروعك بذكاء وسرعة
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mt-8 leading-[1.7] font-medium">
                    لوحة تحكم احترافية لإدارة الاشتراكات، إصدار بطاقات العضوية الفضية والذهبية، تتبع عمليات الكاش باك، وإدارة شؤون أفراد عوائل عملائك بكل سلاسة وبوضع داكن عصري.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
                    <button
                        onClick={handleCTA}
                        className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/20 text-base"
                    >
                        {isAuthenticated ? 'انتقل للوحة التحكم ←' : 'ابدأ تشغيل النظام الآن'}
                    </button>
                    <a
                        href="#features"
                        className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-300 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 text-center"
                    >
                        استكشف المزايا
                    </a>
                </div>

                {/* Mockup Dashboard Preview */}
                <div className="mt-20 relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-teal-500/5 rounded-3xl blur-2xl group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-3 md:p-4 backdrop-blur-xl shadow-2xl relative">
                        {/* Windows controls bar */}
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="w-3 h-3 bg-red-500/40 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-500/40 rounded-full" />
                            <div className="w-3 h-3 bg-green-500/40 rounded-full" />
                            <div className="text-[10px] text-slate-650 mr-4 font-mono">mohassila-dashboard.app</div>
                        </div>
                        {/* Preview Screen Image (Using CSS layout to simulate elegant UI preview) */}
                        <div className="bg-[#080B14] rounded-2xl aspect-[16/9] border border-slate-850/50 p-6 flex flex-col justify-between text-right">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-4">
                                    <div className="w-32 h-8 bg-slate-850 rounded-xl" />
                                    <div className="w-16 h-8 bg-slate-850 rounded-xl" />
                                </div>
                                <div className="w-24 h-8 bg-cyan-950/50 border border-cyan-850/30 rounded-xl" />
                            </div>
                            <div className="grid grid-cols-3 gap-4 flex-1">
                                <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
                                    <div className="w-10 h-10 bg-cyan-950/40 text-cyan-400 rounded-xl flex items-center justify-center font-bold">💳</div>
                                    <div className="space-y-2 mt-4">
                                        <div className="w-16 h-2 bg-slate-800 rounded" />
                                        <div className="w-24 h-4 bg-slate-700 rounded" />
                                    </div>
                                </div>
                                <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
                                    <div className="w-10 h-10 bg-amber-950/40 text-amber-400 rounded-xl flex items-center justify-center font-bold">⭐</div>
                                    <div className="space-y-2 mt-4">
                                        <div className="w-16 h-2 bg-slate-800 rounded" />
                                        <div className="w-20 h-4 bg-slate-700 rounded" />
                                    </div>
                                </div>
                                <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
                                    <div className="w-10 h-10 bg-teal-950/40 text-teal-400 rounded-xl flex items-center justify-center font-bold">👥</div>
                                    <div className="space-y-2 mt-4">
                                        <div className="w-12 h-2 bg-slate-800 rounded" />
                                        <div className="w-28 h-4 bg-slate-700 rounded" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 bg-slate-900/40 border border-slate-850 rounded-2xl p-4 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <div className="w-12 h-4 bg-slate-850 rounded-lg" />
                                    <div className="w-12 h-4 bg-slate-850 rounded-lg" />
                                </div>
                                <div className="w-48 h-4 bg-slate-800 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        ميزات هندسناها بعناية لأجلك
                    </h2>
                    <p className="text-slate-400 mt-4 leading-[1.6]">
                        يوفر نظام محصلة كل ما تحتاج لإدارة العضويات، أفراد العوائل، إصدار وطباعة البطاقات وتتبع العمليات بلمح البصر وبشكل فوري.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: '💳',
                            title: 'إدارة متكاملة للبطاقات',
                            desc: 'إصدار فوري للبطاقات الفضية والذهبية للعملاء وأفراد عوائلهم، إدارة حالتها (تفعيل، تعطيل، مفقودة) وطباعة البطاقة بلمسة واحدة.',
                            color: 'from-cyan-500/10 to-teal-500/5 hover:border-cyan-500/30'
                        },
                        {
                            icon: '👥',
                            title: 'إدارة أفراد العائلة',
                            desc: 'إضافة وتعديل وحذف أفراد عوائل الأعضاء مع تحديد صلة القرابة وأرقام الاتصال لربطهم بالبطاقات المصدرة بسهولة.',
                            color: 'from-violet-500/10 to-purple-500/5 hover:border-violet-500/30'
                        },
                        {
                            icon: '💰',
                            title: 'الكاش باك والعمليات',
                            desc: 'تتبع لحظي لعمليات الشراء والتجديد لكل عضو، وحساب الكاش باك التلقائي بناءً على فئة العضوية مع خيارات تصدير PDF/CSV.',
                            color: 'from-amber-500/10 to-orange-500/5 hover:border-amber-500/30'
                        }
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className={`bg-gradient-to-b ${feature.color} border border-slate-850 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 group shadow-sm`}
                        >
                            <div className="text-4xl mb-6 bg-slate-900/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-800">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 text-sm mt-4 leading-[1.6] font-medium">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
                <div className="bg-gradient-to-r from-cyan-950/20 via-slate-900/30 to-teal-950/20 border border-slate-800/60 rounded-3xl p-10 backdrop-blur-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                                %100
                            </div>
                            <p className="text-slate-400 text-xs md:text-sm mt-2 font-bold">أمان بيانات فائق</p>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
                                +10K
                            </div>
                            <p className="text-slate-400 text-xs md:text-sm mt-2 font-bold">بطاقات مصدرة بنجاح</p>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400">
                                24/7
                            </div>
                            <p className="text-slate-400 text-xs md:text-sm mt-2 font-bold">تتبع فوري ومستمر</p>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                                0.1s
                            </div>
                            <p className="text-slate-400 text-xs md:text-sm mt-2 font-bold">زمن معالجة فائق السرعة</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-900/60 bg-[#060912]/80 backdrop-blur-md py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center font-black text-white">
                            م
                        </div>
                        <span className="text-sm font-bold text-slate-300">
                            محصّلة لخدمات العضوية
                        </span>
                    </div>

                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} محصلة. جميع الحقوق محفوظة.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
