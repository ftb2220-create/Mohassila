import React, { useState, useEffect, useRef } from 'react';

interface CounterProps {
    end: number;
    suffix: string;
    label: string;
    duration?: number;
}

const Counter: React.FC<CounterProps> = ({ end, suffix, label, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let startTime: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl md:text-5xl font-black text-white mb-2">
                {count.toLocaleString('ar-SA')}{suffix}
            </div>
            <div className="text-cyan-200 font-medium text-sm">{label}</div>
        </div>
    );
};

const Stats: React.FC = () => {
    return (
        <section className="relative py-28 md:py-32 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-[80px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300 rounded-full blur-[100px]" />
            </div>
            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
                    <Counter end={50000} suffix="+" label="عضو نشط" />
                    <Counter end={500} suffix="+" label="علامة تجارية" />
                    <Counter end={15} suffix="" label="فرع في المملكة" />
                    <Counter end={98} suffix="%" label="رضا العملاء" />
                </div>
            </div>
        </section>
    );
};

export default Stats;
