'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle, Shield, Zap, DollarSign, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { login, isAuthenticated, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (isAuthenticated && user) {
            setIsRedirecting(true);

            // Check if needs onboarding (creators only)
            if (user.role === 'creator' && !user.onboarding_completed) {
                setTimeout(() => {
                    router.push('/onboarding');
                }, 1500);
            } else if (user.role === 'admin') {
                setTimeout(() => {
                    router.push('/admin');
                }, 1500);
            } else {
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            }
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        if (searchParams.get('session') === 'expired') {
            setError('Sua sessão expirou. Faça login novamente.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Shield, title: 'Segurança Total', desc: 'Seus dados protegidos' },
        { icon: DollarSign, title: 'Split Automático', desc: 'Receba instantaneamente' },
        { icon: Zap, title: 'Telegram Integrado', desc: 'Bots automatizados' }
    ];

    // Redirect Animation
    if (isRedirecting) {
        return (
            <div className={styles.redirectContainer}>
                <div className={styles.redirectContent}>
                    <div className={styles.redirectLogo}>
                        <div className={styles.logoIcon}>B</div>
                        <span>Boyz Vip</span>
                    </div>
                    <div className={styles.redirectSpinner}>
                        <Sparkles size={32} className={styles.sparkle} />
                    </div>
                    <h2 className={styles.redirectTitle}>
                        {user?.role === 'admin' ? 'Acessando Painel Admin...' :
                            !user?.onboarding_completed ? 'Preparando seu cadastro...' :
                                'Entrando...'}
                    </h2>
                    <p className={styles.redirectSubtitle}>Aguarde um momento</p>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Left Side - Branding */}
            <div className={styles.leftSide}>
                <div className={styles.brandContent}>
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>B</div>
                        <span>Boyz Vip</span>
                    </Link>

                    <h1 className={styles.headline}>
                        Monetize seu <br />
                        <span className={styles.highlight}>grupo VIP</span>
                    </h1>

                    <p className={styles.subheadline}>
                        A plataforma mais completa para criadores de conteúdo monetizarem com grupos no Telegram.
                    </p>

                    <div className={styles.features}>
                        {features.map((feature, i) => (
                            <div key={i} className={styles.feature}>
                                <div className={styles.featureIcon}>
                                    <feature.icon size={20} />
                                </div>
                                <div>
                                    <div className={styles.featureTitle}>{feature.title}</div>
                                    <div className={styles.featureDesc}>{feature.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.rightSide}>
                <div className={styles.formWrapper}>
                    <h2 className={styles.formTitle}>Bem-vindo de volta</h2>
                    <p className={styles.formSubtitle}>Entre para acessar seu painel</p>

                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Senha</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className={styles.spinner} />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>ou</span>
                    </div>

                    <Link href="/join" className={styles.registerLink}>
                        Criar nova conta
                    </Link>

                    <p className={styles.terms}>
                        Ao entrar, você concorda com nossos <a href="#">Termos</a> e <a href="#">Privacidade</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.leftSide}></div>
                <div className={styles.rightSide}>
                    <div className={styles.formWrapper}>
                        <Loader2 size={24} className={styles.spinner} />
                    </div>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
