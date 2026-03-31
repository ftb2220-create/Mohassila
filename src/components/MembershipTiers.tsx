import React from 'react';

const tiers = [
    {
        name: 'الفضية',
        nameEn: 'Silver',
        price: '199',
        period: 'سنوياً',
        description: 'ابدأ رحلتك مع محصّلة واستمتع بمزايا حصرية وأسعار الجملة على آلاف المنتجات.',
        features: [
            'بطاقتين عضوية',
            'استرجاع 2% من كل عملية شراء',
            'خصم 10% على المنتجات',
            'توصيل مجاني للطلبات فوق 300 ريال',
            'الدخول لجميع الفروع',
        ],
        borderColor: 'border-slate-200',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-500',
        buttonStyle: 'bg-slate-800 hover:bg-slate-900 text-white',
    },
    {
        name: 'الذهبية',
        nameEn: 'Gold',
        price: '399',
        period: 'سنوياً',
        description: 'عضويتنا الأكثر شعبية! مكافآت مضاعفة وخصومات أكبر على جميع المنتجات والخدمات.',
        features: [
            'كل مميزات الفضية',
            'استرجاع 5% من كل عملية شراء',
            'خصم 25% على المنتجات',
            'توصيل مجاني بدون حد أدنى',
            'أولوية في العروض الحصرية',
            'خدمة عملاء VIP',
            '4 بطاقات عضوية للعائلة',
        ],
        borderColor: 'border-orange-300',
        iconBg: 'bg-gradient-to-br from-orange-100 to-amber-100',
        iconColor: 'text-orange-600',
        buttonStyle: 'bg-gradient-to-r from-orange-500 to-coral hover:from-orange-600 hover:to-red-500 text-white shadow-lg shadow-orange-500/30',
        bestValue: true,
    },
];

const MembershipTiers: React.FC = () => {
    return (
        <section id="tiers" className="py-32 md:py-40 bg-slate-50 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-amber-200 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto px-6 relative">
                {/* Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-5 py-2.5 rounded-full text-sm font-bold mb-8">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        خطط العضوية
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8" style={{ lineHeight: '1.6' }}>
                        اختر الخطة
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-500 to-amber-500"> المناسبة لك</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-loose mt-4">
                        جميع خططنا تشمل ضمان استرجاع 100% خلال 30 يوم. ابدأ اليوم ووفّر أكثر مع محصّلة
                    </p>
                </div>

                {/* Tiers Grid - 2 columns */}
                <div className="grid md:grid-cols-2 gap-12 md:gap-14 max-w-4xl mx-auto items-start">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            id={`tier-${tier.nameEn.toLowerCase()}`}
                            className={`relative bg-white rounded-3xl p-12 md:p-14 border-2 ${tier.borderColor} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${tier.bestValue ? 'pt-16 md:pt-18 md:scale-[1.02] shadow-xl ring-2 ring-orange-400/50' : 'shadow-lg'
                                }`}
                        >
                            {/* Best Value Badge */}
                            {tier.bestValue && (
                                <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black py-2 px-6 rounded-full shadow-lg shadow-orange-500/30 whitespace-nowrap">
                                    ⭐ الأكثر شعبية
                                </div>
                            )}

                            {/* Tier Header */}
                            <div className="text-center mb-12">
                                <div className={`${tier.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                                    <span className={`${tier.iconColor} text-2xl font-black`}>{tier.nameEn.charAt(0)}</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">{tier.name}</h3>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">{tier.nameEn}</p>
                            </div>

                            {/* Price */}
                            <div className="text-center mb-10">
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-5xl font-black text-slate-900">{tier.price}</span>
                                    <span className="text-lg font-bold text-slate-400">ر.س</span>
                                </div>
                                <span className="text-sm text-slate-400 mt-2 block">/ {tier.period}</span>
                            </div>

                            {/* Description */}
                            <p className="text-slate-500 text-sm text-center mb-12 leading-loose">{tier.description}</p>

                            {/* Features */}
                            <ul className="space-y-5 mb-14">
                                {tier.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center gap-4 text-sm text-slate-700">
                                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                className={`w-full py-5 rounded-2xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5 ${tier.buttonStyle}`}
                            >
                                اشترك الآن
                            </button>
                        </div>
                    ))}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 mt-20 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        دفع آمن 100%
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        استرجاع خلال 30 يوم
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        دعم على مدار الساعة
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MembershipTiers;
