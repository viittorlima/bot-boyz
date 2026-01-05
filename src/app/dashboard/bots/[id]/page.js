'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Settings,
    MessageSquare,
    Package,
    Plus,
    Trash2,
    Save,
    Check,
    Loader2,
    ExternalLink,
    Copy
} from 'lucide-react';
import { botsAPI, plansAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { SkeletonCard } from '@/components/ui/Skeleton';
import EmptyState, { GhostCard } from '@/components/ui/EmptyState';
import TutorialCard from '@/components/ui/TutorialCard';
import styles from './page.module.css';

const tabsList = [
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'plans', label: 'Planos VIP', icon: Package },
];

export default function BotEditPage({ params }) {
    const { id } = use(params);
    const { showToast } = useToast();

    const [bot, setBot] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savingPlan, setSavingPlan] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        welcome_message: '',
        request_media_on_start: false,
        channel_id: ''
    });

    const [newPlan, setNewPlan] = useState({
        name: '',
        price: '',
        duration_days: 30,
        description: '',
        is_recurring: true
    });

    useEffect(() => {
        loadBot();
    }, [id]);

    const loadBot = async () => {
        try {
            const response = await botsAPI.get(id);
            const botData = response.data.bot;
            setBot(botData);
            setPlans(botData.plans || []);
            setFormData({
                name: botData.name || '',
                welcome_message: botData.welcome_message || '',
                request_media_on_start: botData.request_media_on_start || false,
                channel_id: botData.channel_id || ''
            });
        } catch (error) {
            console.error('Error loading bot:', error);
            showToast('Erro ao carregar bot', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await botsAPI.update(id, formData);
            showToast('Bot atualizado!', 'success');
        } catch (error) {
            showToast(error.response?.data?.error || 'Erro ao salvar', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleAddPlan = async (e) => {
        e.preventDefault();
        setSavingPlan(true);
        try {
            const response = await plansAPI.create({
                ...newPlan,
                bot_id: id,
                price: parseFloat(newPlan.price),
                duration_days: parseInt(newPlan.duration_days)
            });
            setPlans([...plans, response.data.plan]);
            setNewPlan({ name: '', price: '', duration_days: 30, description: '', is_recurring: true });
            setIsModalOpen(false);
            showToast('Plano criado!', 'success');
        } catch (error) {
            showToast(error.response?.data?.error || 'Erro ao criar plano', 'error');
        } finally {
            setSavingPlan(false);
        }
    };

    const handleDeletePlan = async (planId) => {
        if (!confirm('Excluir este plano?')) return;
        try {
            await plansAPI.delete(planId);
            setPlans(plans.filter(p => p.id !== planId));
            showToast('Plano excluído', 'success');
        } catch (error) {
            showToast('Erro ao excluir', 'error');
        }
    };

    const copyPublicLink = () => {
        // In production, use the actual domain
        const link = `${window.location.origin}/creator/${bot?.username}`;
        navigator.clipboard.writeText(link);
        showToast('Link copiado!', 'success');
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href="/dashboard/bots" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Voltar para Meus Bots
                    </Link>
                </div>
                <SkeletonCard />
            </div>
        );
    }

    if (!bot) {
        return (
            <div className={styles.container}>
                <EmptyState
                    title="Bot não encontrado"
                    description="Este bot não existe ou foi removido"
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/dashboard/bots" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Voltar para Meus Bots
                </Link>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.title}>{bot.name || `@${bot.username}`}</h1>
                        <div className={styles.headerMeta}>
                            <span className={`${styles.status} ${styles[bot.status]}`}>
                                {bot.status === 'active' ? 'Ativo' : 'Pausado'}
                            </span>
                            <span className={styles.tokenPreview}>@{bot.username}</span>
                        </div>
                    </div>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className={styles.spinner} />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Salvar
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                {tabsList.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className={styles.section}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Configurações Gerais</h2>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Nome do Bot</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={styles.input}
                                placeholder="Meu Bot VIP"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>ID do Canal/Grupo VIP</label>
                            <input
                                type="text"
                                value={formData.channel_id}
                                onChange={(e) => setFormData({ ...formData, channel_id: e.target.value })}
                                placeholder="-1001234567890"
                                className={styles.input}
                            />
                            <span className={styles.helper}>
                                O ID numérico do canal ou grupo privado no Telegram
                            </span>
                        </div>

                        <TutorialCard
                            title="Como obter o ID do canal"
                            steps={[
                                'Adicione o bot @userinfobot ao seu canal',
                                'Envie qualquer mensagem no canal',
                                'O bot responderá com o ID do canal',
                                'Copie o número (começa com -100)',
                                'Cole aqui no campo acima'
                            ]}
                        />
                    </div>

                    {/* Public Link */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Link Público</h2>
                        <p className={styles.cardDesc}>
                            Compartilhe este link para as pessoas comprarem acesso ao seu VIP
                        </p>
                        <div className={styles.linkBox}>
                            <input
                                type="text"
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/creator/${bot.username}`}
                                readOnly
                                className={styles.linkInput}
                            />
                            <button className={styles.copyButton} onClick={copyPublicLink}>
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
                <div className={styles.section}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Mensagem de Boas-Vindas</h2>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Mensagem</label>
                            <textarea
                                value={formData.welcome_message}
                                onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
                                rows={5}
                                className={styles.textarea}
                                placeholder="Olá {nome}! Bem-vindo ao grupo VIP!"
                            />
                            <span className={styles.helper}>
                                Use {'{nome}'} para incluir o nome do assinante
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Plans Tab */}
            {activeTab === 'plans' && (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Planos de Assinatura</h2>
                        <button className={styles.addPlanButton} onClick={() => setIsModalOpen(true)}>
                            <Plus size={16} />
                            Novo Plano
                        </button>
                    </div>

                    <div className={styles.plansGrid}>
                        {plans.map(plan => (
                            <div key={plan.id} className={styles.planCard}>
                                <div className={styles.planHeader}>
                                    <h3 className={styles.planName}>{plan.name}</h3>
                                    <button
                                        className={styles.deletePlanButton}
                                        onClick={() => handleDeletePlan(plan.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className={styles.planPrice}>
                                    R$ {parseFloat(plan.price).toFixed(2).replace('.', ',')}
                                </div>
                                <div className={styles.planDuration}>
                                    {plan.duration_days === 0 ? 'Vitalício' : `${plan.duration_days} dias`}
                                </div>
                                {plan.description && (
                                    <div className={styles.planDesc}>{plan.description}</div>
                                )}
                            </div>
                        ))}
                        <GhostCard
                            icon={Plus}
                            title="Adicionar plano"
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>
                </div>
            )}

            {/* Add Plan Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Novo Plano</h2>

                        <form onSubmit={handleAddPlan}>
                            <div className={styles.modalBody}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Nome do Plano</label>
                                    <input
                                        type="text"
                                        value={newPlan.name}
                                        onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                                        placeholder="Ex: Mensal, Vitalício"
                                        className={styles.input}
                                        required
                                    />
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Valor (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newPlan.price}
                                            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                            placeholder="29.90"
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Duração (dias)</label>
                                        <select
                                            value={newPlan.duration_days}
                                            onChange={(e) => setNewPlan({ ...newPlan, duration_days: e.target.value })}
                                            className={styles.select}
                                        >
                                            <option value={7}>7 dias</option>
                                            <option value={15}>15 dias</option>
                                            <option value={30}>30 dias (Mensal)</option>
                                            <option value={90}>90 dias (Trimestral)</option>
                                            <option value={365}>365 dias (Anual)</option>
                                            <option value={0}>Vitalício</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Descrição (opcional)</label>
                                    <input
                                        type="text"
                                        value={newPlan.description}
                                        onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                                        placeholder="Descreva os benefícios"
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={savingPlan}
                                >
                                    {savingPlan ? (
                                        <Loader2 size={18} className={styles.spinner} />
                                    ) : null}
                                    Adicionar Plano
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
