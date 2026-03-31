import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        } catch {
            setError('حدث خطأ في الاتصال. حاول مرة أخرى');
        }
        setLoading(false);
    };

    return (
        <div dir="rtl" className="login-page">
            {/* Animated Background */}
            <div className="login-bg">
                <div className="login-orb login-orb-1" />
                <div className="login-orb login-orb-2" />
                <div className="login-orb login-orb-3" />
                <div className="login-orb login-orb-4" />
                <div className="login-grid" />
            </div>

            {/* Floating particles */}
            <div className="login-particles">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`login-particle login-particle-${i + 1}`} />
                ))}
            </div>

            <div className={`login-container ${mounted ? 'login-mounted' : ''}`}>
                {/* Logo */}
                <div className={`login-logo-section ${mounted ? 'login-logo-visible' : ''}`}>
                    <div className="login-logo-wrapper">
                        <div className="login-logo-icon">
                            <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                                <defs>
                                    <linearGradient id="loginLogoGrad" x1="0" y1="0" x2="64" y2="64">
                                        <stop offset="0%" stopColor="#06B6D4" />
                                        <stop offset="100%" stopColor="#14B8A6" />
                                    </linearGradient>
                                </defs>
                                <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#loginLogoGrad)" />
                                <path d="M16 42C16 42 20 24 26 24C30 24 28 38 32 38C36 38 34 20 38 20C42 20 48 42 48 42"
                                    stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
                                <circle cx="32" cy="48" r="3" fill="#FCD34D" />
                            </svg>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="login-brand-name">محصّلة</div>
                            <div className="login-brand-sub">MOHASSILA</div>
                        </div>
                    </div>
                    <p className="login-subtitle">لوحة تحكم الموظفين</p>
                </div>

                {/* Login Card */}
                <div className={`login-card ${mounted ? 'login-card-visible' : ''}`}>
                    {/* Top accent */}
                    <div className="login-card-accent" />
                    
                    <h2 className="login-title">تسجيل الدخول</h2>
                    <p className="login-desc">ادخل بيانات حسابك للوصول إلى لوحة التحكم</p>

                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <div className="login-field">
                            <label className="login-label">اسم المستخدم</label>
                            <div className="login-input-wrapper">
                                <svg className="login-input-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="ادخل اسم المستخدم"
                                    required
                                    className="login-input"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="login-field">
                            <label className="login-label">كلمة المرور</label>
                            <div className="login-input-wrapper">
                                <svg className="login-input-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="ادخل كلمة المرور"
                                    required
                                    className="login-input login-input-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="login-toggle-password"
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                                    ) : (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="login-error">
                                <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="login-btn"
                            type="submit"
                            disabled={loading}
                            className={`login-submit ${loading ? 'login-submit-loading' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="login-spinner" />
                                    جاري تسجيل الدخول...
                                </>
                            ) : (
                                <>
                                    <span>تسجيل الدخول</span>
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>


                </div>

                {/* Footer */}
                <p className={`login-footer ${mounted ? 'login-footer-visible' : ''}`}>
                    © 2026 محصّلة - جميع الحقوق محفوظة
                </p>
            </div>

            <style>{`
                .login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0A0F1E 0%, #111827 40%, #0F172A 100%);
                    position: relative;
                    overflow: hidden;
                    font-family: inherit;
                }

                /* === BACKGROUND === */
                .login-bg {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                }
                .login-orb {
                    position: absolute;
                    border-radius: 50%;
                }
                .login-orb-1 {
                    top: 10%;
                    right: 15%;
                    width: 500px;
                    height: 500px;
                    background: rgba(6, 182, 212, 0.12);
                    filter: blur(120px);
                    animation: loginFloat 8s ease-in-out infinite;
                }
                .login-orb-2 {
                    bottom: 10%;
                    left: 15%;
                    width: 400px;
                    height: 400px;
                    background: rgba(20, 184, 166, 0.1);
                    filter: blur(100px);
                    animation: loginFloat 10s ease-in-out infinite reverse;
                }
                .login-orb-3 {
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 300px;
                    height: 300px;
                    background: rgba(139, 92, 246, 0.06);
                    filter: blur(80px);
                    animation: loginPulse 6s ease-in-out infinite;
                }
                .login-orb-4 {
                    bottom: 30%;
                    right: 30%;
                    width: 200px;
                    height: 200px;
                    background: rgba(6, 182, 212, 0.08);
                    filter: blur(60px);
                    animation: loginFloat 12s ease-in-out infinite;
                }
                .login-grid {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 28px 28px;
                }

                /* === PARTICLES === */
                .login-particles {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }
                .login-particle {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(6, 182, 212, 0.4);
                }
                .login-particle-1 { width: 4px; height: 4px; top: 20%; left: 10%; animation: loginDrift 15s linear infinite; }
                .login-particle-2 { width: 3px; height: 3px; top: 60%; left: 80%; animation: loginDrift 18s linear infinite reverse; }
                .login-particle-3 { width: 5px; height: 5px; top: 80%; left: 30%; animation: loginDrift 12s linear infinite; }
                .login-particle-4 { width: 3px; height: 3px; top: 30%; left: 70%; animation: loginDrift 20s linear infinite reverse; background: rgba(20, 184, 166, 0.4); }
                .login-particle-5 { width: 4px; height: 4px; top: 50%; left: 20%; animation: loginDrift 16s linear infinite; background: rgba(139, 92, 246, 0.3); }
                .login-particle-6 { width: 3px; height: 3px; top: 70%; left: 60%; animation: loginDrift 14s linear infinite reverse; }

                /* === CONTAINER === */
                .login-container {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 440px;
                    margin: 0 16px;
                }

                /* === ENTRANCE ANIMATIONS === */
                .login-logo-section {
                    text-align: center;
                    margin-bottom: 36px;
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .login-logo-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .login-card {
                    opacity: 0;
                    transform: translateY(30px) scale(0.96);
                    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
                }
                .login-card-visible {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                .login-footer {
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.6s ease 0.5s;
                }
                .login-footer-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* === LOGO === */
                .login-logo-wrapper {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 14px;
                }
                .login-logo-icon {
                    animation: loginLogoGlow 3s ease-in-out infinite;
                    filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.3));
                }
                .login-brand-name {
                    font-size: 28px;
                    font-weight: 900;
                    color: #FFFFFF;
                    line-height: 1.2;
                }
                .login-brand-sub {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    background: linear-gradient(90deg, #06B6D4, #14B8A6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-transform: uppercase;
                }
                .login-subtitle {
                    color: #64748B;
                    font-size: 13px;
                    margin-top: 14px;
                    font-weight: 500;
                }

                /* === CARD === */
                .login-card {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 28px;
                    padding: 44px 40px 36px;
                    box-shadow: 0 32px 64px -16px rgba(0,0,0,0.6),
                                inset 0 1px 0 rgba(255,255,255,0.06);
                    position: relative;
                    overflow: hidden;
                }
                .login-card-accent {
                    position: absolute;
                    top: 0;
                    left: 10%;
                    right: 10%;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, #06B6D4, #14B8A6, transparent);
                    border-radius: 0 0 4px 4px;
                }
                .login-title {
                    font-size: 24px;
                    font-weight: 900;
                    color: #FFFFFF;
                    margin-bottom: 6px;
                    text-align: right;
                }
                .login-desc {
                    color: #94A3B8;
                    font-size: 13px;
                    margin-bottom: 32px;
                    text-align: right;
                    line-height: 1.6;
                }

                /* === FIELDS === */
                .login-field {
                    margin-bottom: 22px;
                }
                .login-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    color: #CBD5E1;
                    margin-bottom: 8px;
                    text-align: right;
                }
                .login-input-wrapper {
                    position: relative;
                }
                .login-input-icon {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #475569;
                    pointer-events: none;
                    transition: color 0.3s;
                }
                .login-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1.5px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    padding: 15px 44px 15px 16px;
                    color: #FFFFFF;
                    font-size: 14px;
                    outline: none;
                    direction: rtl;
                    text-align: right;
                    box-sizing: border-box;
                    transition: all 0.3s ease;
                    font-family: inherit;
                }
                .login-input-password {
                    padding-left: 44px;
                }
                .login-input::placeholder {
                    color: #475569;
                }
                .login-input:focus {
                    border-color: rgba(6, 182, 212, 0.5);
                    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.08), inset 0 0 0 1px rgba(6, 182, 212, 0.1);
                    background: rgba(255,255,255,0.06);
                }
                .login-input:focus + .login-input-icon,
                .login-input-wrapper:focus-within .login-input-icon {
                    color: #06B6D4;
                }
                .login-toggle-password {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #64748B;
                    padding: 6px;
                    border-radius: 8px;
                    transition: all 0.2s;
                    display: flex;
                }
                .login-toggle-password:hover {
                    color: #06B6D4;
                    background: rgba(6, 182, 212, 0.1);
                }

                /* === ERROR === */
                .login-error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #F87171;
                    padding: 12px 16px;
                    border-radius: 14px;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 22px;
                    text-align: right;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    animation: loginShake 0.5s ease;
                }

                /* === SUBMIT === */
                .login-submit {
                    width: 100%;
                    background: linear-gradient(135deg, #06B6D4, #0D9488);
                    color: #FFFFFF;
                    padding: 16px;
                    border-radius: 16px;
                    font-weight: 800;
                    font-size: 15px;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 32px -8px rgba(6, 182, 212, 0.5);
                    position: relative;
                    overflow: hidden;
                    font-family: inherit;
                }
                .login-submit::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
                    transform: translateX(-100%);
                    transition: transform 0.6s ease;
                }
                .login-submit:hover:not(:disabled)::before {
                    transform: translateX(100%);
                }
                .login-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px -8px rgba(6, 182, 212, 0.6);
                }
                .login-submit:active:not(:disabled) {
                    transform: translateY(0);
                }
                .login-submit-loading {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .login-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2.5px solid rgba(255,255,255,0.3);
                    border-top-color: #FFFFFF;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                }

                /* === HINT === */
                .login-hint {
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    color: #475569;
                    font-size: 11px;
                    font-weight: 500;
                    padding: 8px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.04);
                }

                /* === FOOTER === */
                .login-footer {
                    text-align: center;
                    color: #334155;
                    font-size: 11px;
                    margin-top: 28px;
                    font-weight: 500;
                }

                /* === ANIMATIONS === */
                @keyframes loginFloat {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    33% { transform: translateY(-20px) translateX(10px); }
                    66% { transform: translateY(10px) translateX(-10px); }
                }
                @keyframes loginPulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.06; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.1; }
                }
                @keyframes loginDrift {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
                }
                @keyframes loginLogoGlow {
                    0%, 100% { filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.3)); }
                    50% { filter: drop-shadow(0 0 30px rgba(6, 182, 212, 0.5)); }
                }
                @keyframes loginShake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-4px); }
                    80% { transform: translateX(4px); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* === RESPONSIVE === */
                @media (max-width: 480px) {
                    .login-card {
                        padding: 32px 24px 28px;
                        border-radius: 24px;
                    }
                    .login-brand-name {
                        font-size: 24px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
