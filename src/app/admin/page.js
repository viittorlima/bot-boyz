'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign, Users, Percent, TrendingUp, Wallet,
    Plus, Settings, CreditCard, Loader2, Check, AlertCircle,
    Ban, Eye, Search, RefreshCw
} from 'lucide-react';
import api, { adminAPI } from '@/services/api';
import styles from './page.module.css';

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [creators, setCreators] = useState([]);
    const [settings, setSettings] = useState({
        platformFee: 10,
        gateway: 'asaas',
        walletId: ''
    });
    const [saving, setSaving] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCreator, setNewCreator] = useState({ name: '', email: '', password: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, creatorsRes, settingsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/creators'),
                api.get('/admin/settings')
            ]);
            setStats(statsRes.data);
            setCreators(creatorsRes.data.creators || []);
            if (settingsRes.data) {
                setSettings(prev => ({ ...prev, ...settingsRes.data }));
            }
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateCreator = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/creators', newCreator);
            setShowCreateModal(false);
            setNewCreator({ name: '', email: '', password: '' });
            loadData();
        } catch (error) {
            console.error('Error creating creator:', error);
            alert(error.response?.data?.error || 'Erro ao criar criador');
        }
    };

    const handleBanCreator = async (creatorId, currentStatus) => {
        if (!confirm(`Deseja ${currentStatus === 'active' ? 'banir' : 'ativar'} este criador?`)) return;
        try {
            await api.post(`/admin/creators/${creatorId}/toggle-status`);
            loadData();
        } catch (error) {
            console.error('Error toggling creator status:', error);
        }
    };

    const filteredCreators = creators.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Loader2 size={32} className={styles.spinner} />
                    <p>Carregando dados...</p>
                </div>
            </div>
        );
    }

    const statsCards = [
        {
            label: 'Faturamento Total',
            value: `R$ ${(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            change: 'Toda a plataforma'
        },
        {
            label: 'Comissões Recebidas',
            value: `R$ ${(stats?.totalCommission || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            icon: Percent,
            change: `${settings.platformFee}% das vendas`
        },
        {
            label: 'Total de Criadores',
            value: stats?.totalCreators || 0,
            icon: Users,
            change: `${stats?.activeCreators || 0} ativos`
        },
        {
            label: 'Assinantes na Plataforma',
            value: (stats?.totalSubscribers || 0).toLocaleString(),
            icon: TrendingUp,
            change: `+${stats?.newSubscribersMonth || 0} este mês`
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Painel Administrativo</h1>
                    <p className={styles.subtitle}>Gerencie a plataforma BoyzClub</p>
                </div>
                <button className={styles.refreshButton} onClick={loadData}>
                    <RefreshCw size={18} />
                    Atualizar
                </button>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {statsCards.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <div className={styles.statIcon}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={styles.statChange}>{stat.change}</div>
                    </div>
                ))}
            </div>

            {/* Platform Settings */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <Settings size={20} />
                        Configurações da Plataforma
                    </h2>
                </div>

                <div className={styles.settingsGrid}>
                    {/* Split Fee */}
                    <div className={styles.settingCard}>
                        <h3>Taxa da Plataforma (Split)</h3>
                        <p>Porcentagem que a plataforma recebe de cada venda</p>
                        <div className={styles.inputRow}>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                step="0.5"
                                value={settings.platformFee}
                                onChange={(e) => setSettings({ ...settings, platformFee: parseFloat(e.target.value) })}
                                className={styles.input}
                            />
                            <span className={styles.inputSuffix}>%</span>
                        </div>
                    </div>

                    {/* Gateway Selection */}
                    <div className={styles.settingCard}>
                        <h3>Gateway de Recebimento</h3>
                        <p>Onde a plataforma receberá as comissões</p>
                        <div className={styles.gatewayOptions}>
                            {['asaas', 'mercadopago', 'stripe'].map(gw => (
                                <button
                                    key={gw}
                                    className={`${styles.gatewayOption} ${settings.gateway === gw ? styles.active : ''}`}
                                    onClick={() => setSettings({ ...settings, gateway: gw })}
                                >
                                    {gw === 'asaas' && 'Asaas'}
                                    {gw === 'mercadopago' && 'Mercado Pago'}
                                    {gw === 'stripe' && 'Stripe'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wallet ID */}
                    <div className={styles.settingCard}>
                        <h3>Wallet ID da Plataforma</h3>
                        <p>ID da carteira para receber o split das vendas</p>
                        <input
                            type="text"
                            placeholder="wal_xxxxxxxx"
                            value={settings.walletId}
                            onChange={(e) => setSettings({ ...settings, walletId: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                </div>

                <button
                    className={styles.saveButton}
                    onClick={handleSaveSettings}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 size={18} className={styles.spinner} />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Check size={18} />
                            Salvar Configurações
                        </>
                    )}
                </button>
            </div>

            {/* Creators Management */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <Users size={20} />
                        Criadores ({creators.length})
                    </h2>
                    <div className={styles.sectionActions}>
                        <div className={styles.searchBox}>
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Buscar criador..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className={styles.addButton}
                            onClick={() => setShowCreateModal(true)}
                        >
                            <Plus size={18} />
                            Criar Criador
                        </button>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Criador</th>
                                <th>Email</th>
                                <th>Receita</th>
                                <th>Bots</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCreators.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyRow}>
                                        Nenhum criador encontrado
                                    </td>
                                </tr>
                            ) : (
                                filteredCreators.map(creator => (
                                    <tr key={creator.id}>
                                        <td className={styles.creatorName}>{creator.name}</td>
                                        <td className={styles.email}>{creator.email}</td>
                                        <td className={styles.revenue}>
                                            R$ {(creator.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td>{creator.botsCount || 0}</td>
                                        <td>
                                            <span className={`${styles.status} ${styles[creator.status || 'active']}`}>
                                                {creator.status === 'banned' ? 'Banido' : 'Ativo'}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            <button
                                                className={styles.actionBtn}
                                                title="Ver detalhes"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.banBtn}`}
                                                title={creator.status === 'banned' ? 'Ativar' : 'Banir'}
                                                onClick={() => handleBanCreator(creator.id, creator.status)}
                                            >
                                                <Ban size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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
                                <button type="submit" className={styles.primaryBtn}>
                                    Criar Criador
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
