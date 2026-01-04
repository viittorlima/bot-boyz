'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign, Loader2, Package } from 'lucide-react';
import { plansAPI, botsAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { SkeletonCard } from '@/components/ui/Skeleton';
import EmptyState, { GhostCard } from '@/components/ui/EmptyState';
import styles from './page.module.css';

export default function PlansPage() {
    const [plans, setPlans] = useState([]);
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration_days: 30,
        description: '',
        bot_id: '',
        is_recurring: true
    });

    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [plansRes, botsRes] = await Promise.all([
                plansAPI.list(),
                botsAPI.list()
            ]);
            setPlans(plansRes.data.plans || []);
            setBots(botsRes.data.bots || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editingPlan) {
                await plansAPI.update(editingPlan.id, formData);
                showToast('Plano atualizado!', 'success');
            } else {
                await plansAPI.create(formData);
                showToast('Plano criado!', 'success');
            }
            loadData();
            closeModal();
        } catch (error) {
            showToast(error.response?.data?.error || 'Erro ao salvar', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este plano?')) return;

        try {
            await plansAPI.delete(id);
            showToast('Plano excluído', 'success');
            loadData();
        } catch (error) {
            showToast('Erro ao excluir', 'error');
        }
    };

    const openCreateModal = () => {
        setEditingPlan(null);
        setFormData({
            name: '',
            price: '',
            duration_days: 30,
            description: '',
            bot_id: bots[0]?.id || '',
            is_recurring: true
        });
        setShowModal(true);
    };

    const openEditModal = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            duration_days: plan.duration_days,
            description: plan.description || '',
            bot_id: plan.bot_id,
            is_recurring: plan.is_recurring
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPlan(null);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <div className={styles.title}>Planos VIP</div>
                        <div className={styles.subtitle}>Gerencie seus planos de assinatura</div>
                    </div>
                </div>
                <div className={styles.grid}>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Planos VIP</h1>
                    <p className={styles.subtitle}>Gerencie seus planos de assinatura</p>
                </div>
                <button className={styles.addButton} onClick={openCreateModal}>
                    <Plus size={18} />
                    Novo Plano
                </button>
            </div>

            {bots.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title="Nenhum bot conectado"
                    description="Conecte um bot primeiro para criar planos"
                />
            ) : plans.length === 0 ? (
                <div className={styles.grid}>
                    <GhostCard
                        icon={Package}
                        title="Criar primeiro plano"
                        onClick={openCreateModal}
                    />
                </div>
            ) : (
                <div className={styles.grid}>
                    {plans.map((plan) => (
                        <div key={plan.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <Package size={24} />
                                </div>
                                <span className={`${styles.badge} ${plan.status === 'active' ? styles.active : styles.inactive}`}>
                                    {plan.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <h3 className={styles.cardTitle}>{plan.name}</h3>
                            <p className={styles.cardDescription}>{plan.description || 'Sem descrição'}</p>

                            <div className={styles.cardPrice}>
                                {formatPrice(plan.price)}
                            </div>

                            <div className={styles.cardMeta}>
                                <div className={styles.metaItem}>
                                    <Clock size={14} />
                                    {plan.duration_days === 0 ? 'Vitalício' : `${plan.duration_days} dias`}
                                </div>
                                {plan.is_recurring && (
                                    <div className={styles.metaItem}>
                                        Recorrente
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => openEditModal(plan)}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.danger}`}
                                    onClick={() => handleDelete(plan.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <GhostCard
                        icon={Plus}
                        title="Adicionar plano"
                        onClick={openCreateModal}
                    />
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>
                            {editingPlan ? 'Editar Plano' : 'Novo Plano'}
                        </h2>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Bot</label>
                                <select
                                    value={formData.bot_id}
                                    onChange={(e) => setFormData({ ...formData, bot_id: e.target.value })}
                                    className={styles.select}
                                    required
                                >
                                    <option value="">Selecione um bot</option>
                                    {bots.map((bot) => (
                                        <option key={bot.id} value={bot.id}>
                                            @{bot.username}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Nome do Plano</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Mensal, Trimestral, VIP"
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Preço (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="29.90"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Duração (dias)</label>
                                    <input
                                        type="number"
                                        value={formData.duration_days}
                                        onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                                        placeholder="30 (0 = vitalício)"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Descrição (opcional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descreva os benefícios do plano"
                                    className={styles.textarea}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    id="recurring"
                                    checked={formData.is_recurring}
                                    onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                                />
                                <label htmlFor="recurring">Cobrança recorrente</label>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelButton} onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className={styles.submitButton} disabled={saving}>
                                    {saving ? <Loader2 size={18} className={styles.spinner} /> : null}
                                    {editingPlan ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
