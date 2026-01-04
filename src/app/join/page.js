'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, AtSign, Loader2, AlertCircle, Check, Shield, Zap, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function JoinPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(formData);
            setSuccess(true);
        } catch (err) {
            console.error('Register error:', err);
            setError(
                err.response?.data?.error ||
                'Erro ao criar conta. Tente novamente.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Shield, title: 'Sem Mensalidade', desc: 'Pague apenas por venda' },
        { icon: DollarSign, title: 'Taxa de R$ 0,75', desc: 'A menor do mercado' },
        { icon: Zap, title: '100% Automático', desc: 'Sem trabalho manual' }
    ];

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <div className={styles.brandContent}>
                        <Link href="/" className={styles.logo}>
                            <div className={styles.logoIcon}>B</div>
                            <span>BoyzClub</span>
                        </Link>
                        <h1 className={styles.headline}>
                            Conta criada <br />
                            <span className={styles.highlight}>com sucesso!</span>
                        </h1>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div className={styles.formWrapper}>
                        <div className={styles.successIcon}>
                            <Check size={32} />
                        </div>
                        <h2 className={styles.formTitle}>Bem-vindo!</h2>
                        <p className={styles.formSubtitle}>Redirecionando para o dashboard...</p>
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
                        <span>BoyzClub</span>
                    </Link>

                    <h1 className={styles.headline}>
                        Comece a <br />
                        <span className={styles.highlight}>monetizar</span>
                    </h1>

                    <p className={styles.subheadline}>
                        Crie sua conta gratuita e transforme seu Telegram em uma máquina de receita.
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
                    <h2 className={styles.formTitle}>Criar Conta</h2>
                    <p className={styles.formSubtitle}>Preencha seus dados para começar</p>

                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Nome</label>
                            <div className={styles.inputWrapper}>
                                <User size={18} className={styles.inputIcon} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Seu nome completo"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    name="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                    minLength={6}
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
                                    Criando...
                                </>
                            ) : (
                                'Criar Conta Grátis'
                            )}
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>ou</span>
                    </div>

                    <Link href="/login" className={styles.registerLink}>
                        Já tenho uma conta
                    </Link>

                    <p className={styles.terms}>
                        Ao criar conta, você concorda com nossos <a href="#">Termos</a> e <a href="#">Privacidade</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
