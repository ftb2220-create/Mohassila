import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'الرئيسية', href: '#hero' },
        { label: 'العضويات', href: '#tiers' },
        { label: 'المميزات', href: '#features' },
        { label: 'تواصل معنا', href: '#contact' },
    ];

    return (
        <nav
            id="navbar"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <a href="#hero" className="relative z-10">
                    <Logo size={36} light={!scrolled} />
                </a>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-semibold transition-colors duration-300 hover:text-cyan-500 ${scrolled ? 'text-slate-700' : 'text-white/90'
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#tiers"
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5"
                    >
                        انضم الآن
                    </a>
                </div>

                <button
                    id="mobile-menu-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                >
                    <span className={`w-6 h-0.5 transition-all duration-300 ${scrolled ? 'bg-slate-800' : 'bg-white'} ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`w-6 h-0.5 transition-all duration-300 ${scrolled ? 'bg-slate-800' : 'bg-white'} ${mobileOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-6 h-0.5 transition-all duration-300 ${scrolled ? 'bg-slate-800' : 'bg-white'} ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl transition-all duration-500 overflow-hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 py-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-slate-700 font-semibold text-lg py-2 border-b border-slate-100 hover:text-cyan-500 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#tiers"
                        onClick={() => setMobileOpen(false)}
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-center py-3.5 rounded-xl font-bold text-lg mt-2"
                    >
                        انضم الآن
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
