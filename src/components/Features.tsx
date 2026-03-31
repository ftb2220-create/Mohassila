import React from 'react';

const features = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'توفير ذكي',
        description: 'خصومات حصرية تصل إلى 40% على المنتجات المتميزة مع نظام نقاط مكافآت يعيد لك جزء من كل عملية شراء.',
        bg: 'from-cyan-400 to-cyan-600',
        lightBg: 'bg-cyan-50',
        iconColor: 'text-white',
        accentColor: 'text-cyan-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'جودة مضمونة',
        description: 'جميع منتجاتنا مختارة بعناية فائقة وتمر بفحوصات جودة صارمة. ضمان استرجاع 100% على كل المنتجات.',
        bg: 'from-teal-400 to-emerald-600',
        lightBg: 'bg-teal-50',
        iconColor: 'text-white',
        accentColor: 'text-teal-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'عضوية عائلية',
        description: 'بطاقة عضوية واحدة لكل أفراد العائلة. شارك المزايا والخصومات مع من تحب بدون رسوم إضافية.',
        bg: 'from-amber-400 to-orange-500',
        lightBg: 'bg-amber-50',
        iconColor: 'text-white',
        accentColor: 'text-amber-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: 'توصيل سريع',
        description: 'خدمة توصيل مجانية للطلبيات الكبيرة مع إمكانية التوصيل في نفس اليوم داخل المدن الرئيسية.',
        bg: 'from-sky-400 to-blue-600',
        lightBg: 'bg-sky-50',
        iconColor: 'text-white',
        accentColor: 'text-sky-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
        title: 'تطبيق ذكي',
        description: 'تصفح المنتجات، تتبع طلباتك، واستخدم بطاقة عضويتك الرقمية كلها من تطبيق واحد سهل الاستخدام.',
        bg: 'from-violet-400 to-purple-600',
        lightBg: 'bg-violet-50',
        iconColor: 'text-white',
        accentColor: 'text-violet-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'منتجات عالمية',
        description: 'آلاف المنتجات المستوردة من أفضل العلامات التجارية العالمية بأسعار الجملة مباشرة إليك.',
        bg: 'from-rose-400 to-pink-600',
        lightBg: 'bg-rose-50',
        iconColor: 'text-white',
        accentColor: 'text-rose-600',
    },
];

const Features: React.FC = () => {
    return (
        <section id="features" className="py-32 md:py-40 bg-white relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-[150px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-600 px-5 py-2.5 rounded-full text-sm font-bold mb-6">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                        لماذا محصّلة؟
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8" style={{ lineHeight: '1.6' }}>
                        كل ما تحتاجه في
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-500 to-teal-500"> مكان واحد</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto" style={{ lineHeight: '2' }}>
                        نقدم لك تجربة تسوق استثنائية تجمع بين الجودة العالية والأسعار المنافسة مع خدمة عملاء لا مثيل لها
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            id={`feature-card-${index}`}
                            className="group bg-white rounded-3xl p-8 md:p-10 border border-slate-100/80 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 hover:-translate-y-2"
                            style={{ overflow: 'visible' }}
                        >
                            {/* Icon Container - Large & Prominent */}
                            <div className={`bg-gradient-to-br ${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                                <div className={feature.iconColor}>{feature.icon}</div>
                            </div>

                            {/* Title - Clear & Bold */}
                            <h3
                                className="text-xl font-bold text-slate-900 mb-3"
                                style={{ lineHeight: '1.8', overflow: 'visible', textOverflow: 'unset', whiteSpace: 'normal' }}
                            >
                                {feature.title}
                            </h3>

                            {/* Description - Full Text, No Clipping */}
                            <p
                                className="text-slate-500 text-sm"
                                style={{ lineHeight: '2.1', overflow: 'visible', wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                            >
                                {feature.description}
                            </p>

                            {/* Link Arrow */}
                            <div className={`mt-6 flex items-center gap-2 ${feature.accentColor} opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0`}>
                                <span className="text-sm font-semibold">اكتشف المزيد</span>
                                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
