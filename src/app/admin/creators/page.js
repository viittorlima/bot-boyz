'use client';

import { useState, useEffect } from 'react';
import { Search, Ban, Eye, Loader2, Plus, RefreshCw, Check } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import api from '@/services/api';
import styles from './page.module.css';

export default function AdminCreatorsPage() {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCreator, setNewCreator] = useState({ name: '', email: '', password: '' });
    const [creating, setCreating] = useState(false);

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

    const filteredCreators = creators.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const handleToggleStatus = async (creator) => {
        const action = creator.status === 'banned' ? 'ativar' : 'banir';
        if (!confirm(`Tem certeza que deseja ${action} ${creator.name}?`)) return;

        try {
            await api.post(`/admin/creators/${creator.id}/toggle-status`);
            loadCreators();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleCreateCreator = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await api.post('/admin/creators', newCreator);
            setShowCreateModal(false);
            setNewCreator({ name: '', email: '', password: '' });
            loadCreators();
        } catch (error) {
            console.error('Error creating creator:', error);
            alert(error.response?.data?.error || 'Erro ao criar criador');
        } finally {
            setCreating(false);
        }
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
    };

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
                    <h1 className={styles.title}>Criadores</h1>
                    <p className={styles.subtitle}>Gerenciamento de todos os criadores da plataforma</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.refreshBtn} onClick={loadCreators}>
                        <RefreshCw size={18} />
                    </button>
                    <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} />
                        Criar Criador
                    </button>
                </div>
            </div>

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
                <div className={styles.stats}>
                    <span>{filteredCreators.length} criadores</span>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Criador</th>
                            <th>Email</th>
                            <th>Taxa</th>
                            <th>Bots</th>
                            <th>Receita Total</th>
                            <th>Sua Comissão</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCreators.length === 0 ? (
                            <tr>
                                <td colSpan={8} className={styles.emptyRow}>
                                    Nenhum criador encontrado
                                </td>
                            </tr>
                        ) : (
                            filteredCreators.map(creator => (
                                <tr key={creator.id}>
                                    <td>
                                        <div className={styles.creatorCell}>
                                            <div className={styles.avatar}>
                                                {getInitials(creator.name)}
                                            </div>
                                            <div>
                                                <div className={styles.creatorName}>{creator.name}</div>
                                                <div className={styles.username}>@{creator.username || creator.email?.split('@')[0]}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.email}>{creator.email}</td>
                                    <td>
                                        <span className={`${styles.feeBadge} ${creator.promotion_active ? styles.promo : ''}`}>
                                            {creator.fee_rate || 5}%
                                            {creator.promotion_active && ' 📢'}
                                        </span>
                                    </td>
                                    <td>{creator.botsCount || 0}</td>
                                    <td className={styles.revenue}>
                                        R$ {(creator.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className={styles.commission}>
                                        R$ {(creator.platformCommission || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[creator.status || 'active']}`}>
                                            {creator.status === 'banned' ? 'Banido' : 'Ativo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.actionButton}
                                                title="Ver detalhes"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${creator.status === 'banned' ? styles.success : styles.danger}`}
                                                onClick={() => handleToggleStatus(creator)}
                                                title={creator.status === 'banned' ? 'Ativar' : 'Banir'}
                                            >
                                                {creator.status === 'banned' ? <Check size={16} /> : <Ban size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Creator Modal */}
            {showCreateModal && (
                <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2>Criar Novo Criador</h2>
                        <form onSubmit={handleCreateCreator}>
                            <div className={styles.formGroup}>
                                <label>Nome</label>
                                <input
                                    type="text"
                                    value={newCreator.name}
                                    onChange={e => setNewCreator({ ...newCreator, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={newCreator.email}
                                    onChange={e => setNewCreator({ ...newCreator, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Senha</label>
                                <input
                                    type="password"
                                    value={newCreator.password}
                                    onChange={e => setNewCreator({ ...newCreator, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowCreateModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={creating}>
                                    {creating ? <Loader2 size={18} className={styles.spinner} /> : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
