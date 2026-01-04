'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    Megaphone,
    Shield,
    Clock,
    MessageCircle,
    Send,
    ExternalLink,
    Check,
    AlertCircle,
    Loader,
    Sparkles
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function PromotionPage() {
    const { user, refreshUser } = useAuth();
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await api.get('/auth/promotion-status');
            setStatus(response.data);
        } catch (error) {
            console.error('Error fetching promotion status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async () => {
        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.post('/auth/activate-promotion');
            setMessage({ type: 'success', text: response.data.message });
            await fetchStatus();
            await refreshUser();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao ativar' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeactivate = async () => {
        if (!confirm('Tem certeza que deseja desativar a divulgação?')) return;

        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.post('/auth/deactivate-promotion');
            setMessage({ type: 'success', text: response.data.message });
            await fetchStatus();
            await refreshUser();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao desativar' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitPromotion = async () => {
        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.post('/auth/submit-promotion');
            setMessage({ type: 'success', text: response.data.message });

            // Open contact link
            if (response.data.contactLink) {
                window.open(response.data.contactLink, '_blank');
            }

            await fetchStatus();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao enviar' });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Loader size={24} className={styles.spinner} />
                    <span>Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Divulgação</h1>
                <p className={styles.subtitle}>Gerencie sua taxa e divulgações nos canais oficiais</p>
            </div>

            {/* Current Status */}
            <div className={styles.statusCard}>
                <div className={styles.statusHeader}>
                    <div className={`${styles.statusIcon} ${status.promotionActive ? styles.active : ''}`}>
                        {status.promotionActive ? <Megaphone size={24} /> : <Shield size={24} />}
                    </div>
                    <div className={styles.statusInfo}>
                        <h3>{status.promotionActive ? 'Plano Divulgação' : 'Plano Padrão'}</h3>
                        <p>Taxa atual: <strong>{status.feeRate}%</strong> sobre vendas</p>
                    </div>
                </div>

                {status.promotionActive && (
                    <div className={styles.promotionStats}>
                        <div className={styles.stat}>
                            <MessageCircle size={18} />
                            <div>
                                <span className={styles.statValue}>{status.promotionsRemaining}</span>
                                <span className={styles.statLabel}>divulgações restantes</span>
                            </div>
                        </div>
                        <div className={styles.stat}>
                            <Clock size={18} />
                            <div>
                                <span className={styles.statValue}>{status.daysUntilCanDeactivate || 0}</span>
                                <span className={styles.statLabel}>dias até poder desativar</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Message */}
            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            {/* Actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Sparkles size={18} />
                    Ações
                </h2>

                {status.promotionActive ? (
                    <>
                        {/* Submit Promotion */}
                        <div className={styles.actionCard}>
                            <div className={styles.actionInfo}>
                                <Send size={20} />
                                <div>
                                    <h4>Enviar Conteúdo para Divulgação</h4>
                                    <p>Você usou {status.promotionsUsedThisMonth}/3 divulgações este mês</p>
                                </div>
                            </div>
                            <button
                                className={styles.actionButton}
                                onClick={handleSubmitPromotion}
                                disabled={actionLoading || status.promotionsRemaining <= 0}
                            >
                                {actionLoading ? <Loader size={16} className={styles.spinner} /> : <ExternalLink size={16} />}
                                Enviar Conteúdo
                            </button>
                        </div>

                        {/* Contact Link Info */}
                        {status.contactLink && (
                            <div className={styles.contactInfo}>
                                <MessageCircle size={16} />
                                <span>Ao clicar, você será direcionado para enviar seu conteúdo</span>
                            </div>
                        )}

                        {/* Deactivate */}
                        <div className={styles.deactivateSection}>
                            {status.promotionEndsAt ? (
                                <div className={styles.scheduledInfo}>
                                    <Clock size={16} />
                                    <span>
                                        Desativação agendada para{' '}
                                        {new Date(status.promotionEndsAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            ) : status.daysUntilCanDeactivate > 0 ? (
                                <div className={styles.minPeriodInfo}>
                                    <AlertCircle size={16} />
                                    <span>
                                        Você precisa permanecer no plano por mais {status.daysUntilCanDeactivate} dias
                                    </span>
                                </div>
                            ) : null}

                            <button
                                className={styles.deactivateButton}
                                onClick={handleDeactivate}
                                disabled={actionLoading || status.promotionEndsAt}
                            >
                                {actionLoading ? <Loader size={16} className={styles.spinner} /> : null}
                                {status.daysUntilCanDeactivate > 0 ? 'Agendar Desativação' : 'Desativar Divulgação'}
                            </button>
                        </div>
                    </>
                ) : (
                    /* Activate Promotion */
                    <div className={styles.activateSection}>
                        <div className={styles.promotionBenefits}>
                            <h4>Benefícios do Plano Divulgação</h4>
                            <ul>
                                <li><Check size={14} /> Divulgação nos canais oficiais da plataforma</li>
                                <li><Check size={14} /> 3 divulgações por mês</li>
                                <li><Check size={14} /> Maior visibilidade para seu conteúdo</li>
                                <li><Check size={14} /> Suporte prioritário</li>
                            </ul>
                            <p className={styles.feeNote}>Taxa: 10% sobre vendas (atual: 5%)</p>
                        </div>

                        <button
                            className={styles.activateButton}
                            onClick={handleActivate}
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader size={16} className={styles.spinner} /> : <Megaphone size={16} />}
                            Ativar Divulgação
                        </button>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={styles.infoSection}>
                <h3>Regras da Divulgação</h3>
                <ul>
                    <li><strong>Taxa:</strong> 10% sobre vendas enquanto ativo</li>
                    <li><strong>Mínimo:</strong> 30 dias antes de poder desativar</li>
                    <li><strong>Limite:</strong> 3 divulgações por mês (não acumulativas)</li>
                    <li><strong>Reset:</strong> Contador zera todo dia 1º do mês</li>
                </ul>
            </div>
        </div>
    );
}
