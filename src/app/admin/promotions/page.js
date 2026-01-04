'use client';

import { useState, useEffect } from 'react';
import {
    Megaphone,
    Users,
    Loader2,
    RefreshCw,
    Search,
    Check,
    Clock,
    Percent,
    DollarSign,
    Edit3,
    X,
    Save
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function AdminPromotionsPage() {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, promotion, standard
    const [editModal, setEditModal] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCreators();
    }, []);

    const loadCreators = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/creators');
            setCreators(response.data.creators || []);
        } catch (error) {
            console.error('Error loading creators:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = (creator) => {
        setEditModal({
            id: creator.id,
            name: creator.name,
            fee_rate: creator.fee_rate || 5,
            promotion_active: creator.promotion_active || false,
            promotions_used_this_month: creator.promotions_used_this_month || 0
        });
    };

    const handleSaveEdit = async () => {
        if (!editModal) return;
        setSaving(true);
        try {
            await api.put(`/admin/creators/${editModal.id}/fee`, {
                feeRate: editModal.fee_rate,
                feeType: editModal.promotion_active ? 'promotion' : 'standard',
                promotionsUsed: editModal.promotions_used_this_month
            });
            setEditModal(null);
            loadCreators();
        } catch (error) {
            console.error('Error updating creator:', error);
            alert('Erro ao atualizar criador');
        } finally {
            setSaving(false);
        }
    };

    const filteredCreators = creators.filter(c => {
        const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'promotion') return matchesSearch && c.promotion_active;
        if (filter === 'standard') return matchesSearch && !c.promotion_active;
        return matchesSearch;
    });

    const promotionCount = creators.filter(c => c.promotion_active).length;
    const standardCount = creators.filter(c => !c.promotion_active).length;

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Loader2 size={32} className={styles.spinner} />
                    <p>Carregando criadores...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Divulgações</h1>
                    <p className={styles.subtitle}>Gerencie as taxas e promoções dos criadores</p>
                </div>
                <button className={styles.refreshBtn} onClick={loadCreators}>
                    <RefreshCw size={18} />
                    Atualizar
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Megaphone size={24} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{promotionCount}</div>
                        <div className={styles.statLabel}>Com Divulgação (10%)</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{standardCount}</div>
                        <div className={styles.statLabel}>Plano Padrão (5%)</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{creators.length}</div>
                        <div className={styles.statLabel}>Total de Criadores</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.filterTabs}>
                    <button
                        className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`${styles.filterTab} ${filter === 'promotion' ? styles.active : ''}`}
                        onClick={() => setFilter('promotion')}
                    >
                        <Megaphone size={14} />
                        Divulgação
                    </button>
                    <button
                        className={`${styles.filterTab} ${filter === 'standard' ? styles.active : ''}`}
                        onClick={() => setFilter('standard')}
                    >
                        Padrão
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Criador</th>
                            <th>Email</th>
                            <th>Taxa</th>
                            <th>Tipo</th>
                            <th>Divulgações Usadas</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCreators.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.emptyRow}>
                                    Nenhum criador encontrado
                                </td>
                            </tr>
                        ) : (
                            filteredCreators.map(creator => (
                                <tr key={creator.id}>
                                    <td>
                                        <div className={styles.creatorCell}>
                                            <div className={styles.avatar}>
                                                {creator.name?.substring(0, 2).toUpperCase() || '??'}
                                            </div>
                                            <div>
                                                <div className={styles.creatorName}>{creator.name}</div>
                                                <div className={styles.username}>@{creator.username || 'sem-username'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.email}>{creator.email}</td>
                                    <td>
                                        <span className={`${styles.feeBadge} ${creator.fee_rate >= 10 ? styles.high : ''}`}>
                                            {creator.fee_rate || 5}%
                                        </span>
                                    </td>
                                    <td>
                                        {creator.promotion_active ? (
                                            <span className={styles.typeBadge}>
                                                <Megaphone size={12} />
                                                Divulgação
                                            </span>
                                        ) : (
                                            <span className={`${styles.typeBadge} ${styles.standard}`}>
                                                Padrão
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {creator.promotion_active ? (
                                            <span className={styles.usageCount}>
                                                {creator.promotions_used_this_month || 0}/3
                                            </span>
                                        ) : (
                                            <span className={styles.na}>-</span>
                                        )}
                                    </td>
                                    <td>
                                        {creator.onboarding_completed ? (
                                            <span className={`${styles.statusBadge} ${styles.active}`}>
                                                <Check size={12} />
                                                Ativo
                                            </span>
                                        ) : (
                                            <span className={`${styles.statusBadge} ${styles.pending}`}>
                                                <Clock size={12} />
                                                Pendente
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleOpenEdit(creator)}
                                            title="Editar taxa e divulgações"
                                        >
                                            <Edit3 size={16} />
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editModal && (
                <div className={styles.modalOverlay} onClick={() => setEditModal(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Editar Criador</h2>
                            <button onClick={() => setEditModal(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <p className={styles.modalName}>{editModal.name}</p>

                        <div className={styles.formGroup}>
                            <label>Taxa (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={editModal.fee_rate}
                                onChange={(e) => setEditModal({
                                    ...editModal,
                                    fee_rate: parseInt(e.target.value) || 0
                                })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Plano</label>
                            <div className={styles.planToggle}>
                                <button
                                    className={!editModal.promotion_active ? styles.active : ''}
                                    onClick={() => setEditModal({
                                        ...editModal,
                                        promotion_active: false,
                                        fee_rate: 5
                                    })}
                                >
                                    Padrão (5%)
                                </button>
                                <button
                                    className={editModal.promotion_active ? styles.active : ''}
                                    onClick={() => setEditModal({
                                        ...editModal,
                                        promotion_active: true,
                                        fee_rate: 10
                                    })}
                                >
                                    Divulgação (10%)
                                </button>
                            </div>
                        </div>

                        {editModal.promotion_active && (
                            <div className={styles.formGroup}>
                                <label>Divulgações Usadas Este Mês</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={editModal.promotions_used_this_month}
                                    onChange={(e) => setEditModal({
                                        ...editModal,
                                        promotions_used_this_month: parseInt(e.target.value) || 0
                                    })}
                                />
                                <span className={styles.hint}>Máximo permitido: 3 por mês</span>
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button onClick={() => setEditModal(null)}>
                                Cancelar
                            </button>
                            <button onClick={handleSaveEdit} disabled={saving}>
                                {saving ? <Loader2 size={16} className={styles.spinner} /> : <Save size={16} />}
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
