'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Check,
    Star,
    Megaphone,
    Shield,
    ArrowRight,
    Sparkles,
    Clock,
    MessageCircle
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function OnboardingPage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // If already completed onboarding, redirect
        if (user?.onboarding_completed) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const plans = [
        {
            id: 'standard',
            name: 'Plano Padrão',
            fee: 5,
            icon: Shield,
            features: [
                'Taxa de 5% sobre vendas',
                'Acesso completo ao painel',
                'Bot Telegram ilimitado',
                'Suporte via Telegram'
            ],
            highlight: false
        },
        {
            id: 'promotion',
            name: 'Plano Divulgação',
            fee: 10,
            icon: Megaphone,
            features: [
                'Taxa de 10% sobre vendas',
                'Divulgação nos canais oficiais',
                '3 divulgações por mês',
                'Maior visibilidade',
                'Suporte prioritário'
            ],
            highlight: true,
            badge: 'Recomendado'
        }
    ];

    const handleComplete = async () => {
        if (!selectedPlan) {
            setError('Selecione um plano para continuar');
            return;
        }
        if (!termsAccepted) {
            setError('Você precisa aceitar os termos para continuar');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/auth/complete-onboarding', {
                feeType: selectedPlan
            });

            await refreshUser();
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao completar cadastro');
        } finally {
            setLoading(false);
        }
    };

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
                    <p>Escolha o plano que melhor se adapta ao seu perfil</p>
                </div>

                {/* Plans Grid */}
                <div className={styles.plansGrid}>
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`${styles.planCard} ${selectedPlan === plan.id ? styles.selected : ''} ${plan.highlight ? styles.highlighted : ''}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {plan.badge && (
                                <div className={styles.planBadge}>
                                    <Star size={12} />
                                    {plan.badge}
                                </div>
                            )}

                            <div className={styles.planIcon}>
                                <plan.icon size={28} />
                            </div>

                            <h3 className={styles.planName}>{plan.name}</h3>

                            <div className={styles.planFee}>
                                <span className={styles.feeNumber}>{plan.fee}%</span>
                                <span className={styles.feeLabel}>por venda</span>
                            </div>

                            <ul className={styles.planFeatures}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>
                                        <Check size={14} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className={styles.planCheck}>
                                {selectedPlan === plan.id ? (
                                    <div className={styles.checked}>
                                        <Check size={16} />
                                    </div>
                                ) : (
                                    <div className={styles.unchecked} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Promotion Info */}
                {selectedPlan === 'promotion' && (
                    <div className={styles.promotionInfo}>
                        <Sparkles size={18} />
                        <div>
                            <h4>Sobre o Plano Divulgação</h4>
                            <ul>
                                <li><Clock size={12} /> Mínimo de 30 dias ativo</li>
                                <li><MessageCircle size={12} /> 3 divulgações por mês (não acumulativas)</li>
                                <li><Megaphone size={12} /> Receba link para enviar seu conteúdo</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Terms */}
                <div className={styles.terms}>
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <span className={styles.checkmark}></span>
                        <span>
                            Li e aceito os <a href="/termos" target="_blank">Termos de Uso</a> e a{' '}
                            <a href="/privacidade" target="_blank">Política de Privacidade</a>
                        </span>
                    </label>
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
                    disabled={loading || !selectedPlan || !termsAccepted}
                >
                    {loading ? (
                        'Processando...'
                    ) : (
                        <>
                            Começar Agora
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>

                {/* Info */}
                <p className={styles.infoText}>
                    Você pode alterar seu plano a qualquer momento nas configurações.
                </p>
            </div>
        </div>
    );
}
