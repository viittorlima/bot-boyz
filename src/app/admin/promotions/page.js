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
    AlertCircle,
    Percent,
    DollarSign
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function AdminPromotionsPage() {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, promotion, standard

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

    const handleUpdateFee = async (creatorId, feeRate, feeType) => {
        try {
            await api.put(`/admin/creators/${creatorId}/fee`, { feeRate, feeType });
            loadCreators();
        } catch (error) {
            console.error('Error updating fee:', error);
            alert('Erro ao atualizar taxa');
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
                                        <div className={styles.actions}>
                                            <select
                                                value={creator.fee_rate || 5}
                                                onChange={(e) => handleUpdateFee(
                                                    creator.id,
                                                    e.target.value,
                                                    e.target.value >= 10 ? 'promotion' : 'standard'
                                                )}
                                                className={styles.feeSelect}
                                            >
                                                <option value="5">5%</option>
                                                <option value="10">10%</option>
                                                <option value="15">15%</option>
                                                <option value="20">20%</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
