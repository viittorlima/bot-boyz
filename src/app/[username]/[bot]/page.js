'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Check, Loader2, Bot, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';
import styles from './page.module.css';

export default function BotPublicPage() {
    const params = useParams();
    const botUsername = params.bot;
    const creatorUsername = params.username;

    const [bot, setBot] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBotData();
    }, [botUsername]);

    const loadBotData = async () => {
        try {
            const response = await api.get(`/bots/public/${botUsername}`);
            setBot(response.data.bot);
            setPlans(response.data.plans || []);
            if (response.data.plans?.length > 0) {
                setSelectedPlan(response.data.plans[0]);
            }
        } catch (err) {
            console.error('Error loading bot:', err);
            setError('Bot não encontrado');
        } finally {
            setLoading(false);
        }
    };

    // Redirect to Telegram bot with deeplink
    const handleSubscribe = () => {
        if (!selectedPlan || !bot) return;

        // Deeplink format: t.me/botusername?start=plan_PLANID
        const telegramUrl = `https://t.me/${bot.username}?start=plan_${selectedPlan.id}`;
        window.open(telegramUrl, '_blank');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 size={32} className={styles.spinner} />
            </div>
        );
    }

    if (error && !bot) {
        return (
            <div className={styles.errorContainer}>
                <h2>Ops!</h2>
                <p>{error}</p>
                <Link href={`/${creatorUsername}`} className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Voltar
                </Link>
            </div>
        );
    }

    const features = [
        'Acesso exclusivo ao grupo VIP',
        'Conteúdo premium diário',
        'Suporte prioritário via bot',
        'Ativação instantânea após pagamento'
    ];

    return (
        <div className={styles.container}>
            {/* Back Link */}
            <Link href={`/${creatorUsername}`} className={styles.backButton}>
                <ArrowLeft size={18} />
                Voltar
            </Link>

            <div className={styles.profile}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatarPlaceholder}>
                        <Bot size={48} />
                    </div>
                </div>

                <h1 className={styles.name}>{bot?.name || `@${botUsername}`}</h1>
                <p className={styles.username}>@{bot?.username}</p>
                <p className={styles.bio}>{bot?.welcome_message || 'Bot VIP exclusivo'}</p>

                <div className={styles.features}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.feature}>
                            <Check size={16} className={styles.featureIcon} />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Plans Selection */}
            {plans.length > 0 && (
                <div className={styles.plansSection}>
                    <h2 className={styles.plansTitle}>Escolha seu plano</h2>

                    <div className={styles.plansGrid}>
                        {plans.map((plan) => (
                            <button
                                key={plan.id}
                                className={`${styles.planCard} ${selectedPlan?.id === plan.id ? styles.selected : ''}`}
                                onClick={() => setSelectedPlan(plan)}
                            >
                                <div className={styles.planName}>{plan.name}</div>
                                <div className={styles.planPrice}>
                                    R$ {parseFloat(plan.price).toFixed(2).replace('.', ',')}
                                </div>
                                <div className={styles.planDuration}>
                                    {plan.duration_days === 0
                                        ? 'Vitalício'
                                        : `${plan.duration_days} dias`
                                    }
                                </div>
                                {plan.description && (
                                    <div className={styles.planDesc}>{plan.description}</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* How it works */}
            <div className={styles.howItWorks}>
                <h3>Como funciona?</h3>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <span className={styles.stepNumber}>1</span>
                        <span>Clique em "Assinar via Telegram"</span>
                    </div>
                    <div className={styles.step}>
                        <span className={styles.stepNumber}>2</span>
                        <span>Inicie o bot e siga as instruções</span>
                    </div>
                    <div className={styles.step}>
                        <span className={styles.stepNumber}>3</span>
                        <span>Realize o pagamento</span>
                    </div>
                    <div className={styles.step}>
                        <span className={styles.stepNumber}>4</span>
                        <span>Acesso liberado automaticamente!</span>
                    </div>
                </div>
            </div>

            {/* Checkout Bar */}
            <div className={styles.checkoutBar}>
                <div className={styles.checkoutInfo}>
                    {selectedPlan && (
                        <>
                            <span className={styles.checkoutPlan}>{selectedPlan.name}</span>
                            <span className={styles.checkoutPrice}>
                                R$ {parseFloat(selectedPlan.price).toFixed(2).replace('.', ',')}
                            </span>
                        </>
                    )}
                </div>

                <button
                    className={styles.checkoutButton}
                    onClick={handleSubscribe}
                    disabled={!selectedPlan}
                >
                    <Send size={18} />
                    ASSINAR VIA TELEGRAM
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
}
