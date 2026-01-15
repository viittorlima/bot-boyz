'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Check, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function OnboardingPage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // If already completed onboarding, redirect
        if (user?.onboarding_completed) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleComplete = async () => {
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/complete-onboarding', {
                feeType: 'fixed' // Always fixed fee now
            });

            // Refresh user data
            try {
                await refreshUser();
            } catch (refreshErr) {
                console.log('Refresh failed, continuing anyway');
            }

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            console.error('Onboarding error:', err);
            setError(err.response?.data?.error || 'Erro ao completar cadastro');
            setLoading(false);
        }
    };

    const benefits = [
        'Taxa fixa de apenas R$ 0,55 por venda',
        'Sem mensalidade ou taxa percentual',
        'Bot Telegram ilimitado',
        'Acesso completo ao painel',
        'Suporte via Telegram'
    ];

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>B</div>
                        <span>Boyz Vip</span>
                    </div>
                    <h1>Bem-vindo ao Boyz Vip!</h1>
                    <p>Sua conta está quase pronta</p>
                </div>

                {/* Single Plan Card */}
                <div className={styles.planCard}>
                    <div className={styles.planBadge}>
                        <Sparkles size={12} />
                        Taxa Fixa
                    </div>

                    <div className={styles.planFee}>
                        <span className={styles.feeNumber}>R$ 0,55</span>
                        <span className={styles.feeLabel}>por venda aprovada</span>
                    </div>

                    <ul className={styles.planFeatures}>
                        {benefits.map((benefit, idx) => (
                            <li key={idx}>
                                <Check size={14} />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Error */}
                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    className={styles.submitButton}
                    onClick={handleComplete}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className={styles.spinner} />
                            Processando...
                        </>
                    ) : (
                        <>
                            Começar Agora
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>

                {/* Info */}
                <p className={styles.infoText}>
                    Você receberá 100% do valor das vendas, descontando apenas R$ 0,55 por transação.
                </p>
            </div>
        </div>
    );
}
