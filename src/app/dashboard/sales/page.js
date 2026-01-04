'use client';

import { useState, useEffect } from 'react';
import {
    Receipt,
    Users,
    DollarSign,
    Filter,
    Download,
    Search,
    ChevronDown,
    Clock,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import { statsAPI, botsAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { SkeletonTable, SkeletonStats } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import styles from './page.module.css';

export default function SalesHistoryPage() {
    const [sales, setSales] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [stats, setStats] = useState(null);
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sales');
    const [filters, setFilters] = useState({
        bot: 'all',
        status: 'all',
        search: ''
    });

    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, botsRes] = await Promise.all([
                statsAPI.getCreatorStats(),
                botsAPI.list()
            ]);

            setStats(statsRes.data);
            setBots(botsRes.data.bots || []);
            setSales(statsRes.data.recentSales || []);
            setSubscribers(statsRes.data.subscribers || []);
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Erro ao carregar dados', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'paid': { label: 'Pago', icon: CheckCircle, class: styles.statusPaid },
            'pending': { label: 'Pendente', icon: Clock, class: styles.statusPending },
            'active': { label: 'Ativo', icon: CheckCircle, class: styles.statusPaid },
            'expired': { label: 'Expirado', icon: XCircle, class: styles.statusExpired },
            'cancelled': { label: 'Cancelado', icon: XCircle, class: styles.statusExpired }
        };
        const s = statusMap[status] || { label: status, icon: Clock, class: styles.statusPending };
        return (
            <span className={`${styles.statusBadge} ${s.class}`}>
                <s.icon size={12} />
                {s.label}
            </span>
        );
    };

    const filteredSales = sales.filter(sale => {
        if (filters.bot !== 'all' && sale.botId !== filters.bot) return false;
        if (filters.status !== 'all' && sale.status !== filters.status) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            if (!sale.customer?.toLowerCase().includes(search) &&
                !sale.plan?.toLowerCase().includes(search)) return false;
        }
        return true;
    });

    const filteredSubscribers = subscribers.filter(sub => {
        if (filters.bot !== 'all' && sub.botId !== filters.bot) return false;
        if (filters.status !== 'all' && sub.status !== filters.status) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            if (!sub.name?.toLowerCase().includes(search) &&
                !sub.username?.toLowerCase().includes(search)) return false;
        }
        return true;
    });

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Histórico de Vendas</h1>
                </div>
                <SkeletonStats count={3} />
                <div style={{ marginTop: 32 }}>
                    <SkeletonTable rows={5} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Histórico de Vendas</h1>
                    <p className={styles.subtitle}>Acompanhe todas as suas transações e assinantes</p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <DollarSign size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Vendas</span>
                        <span className={styles.statValue}>{stats?.totalRevenue || 'R$ 0,00'}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Receipt size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Transações</span>
                        <span className={styles.statValue}>{sales.length}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Users size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Assinantes Ativos</span>
                        <span className={styles.statValue}>{stats?.activeSubscribers || 0}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'sales' ? styles.active : ''}`}
                    onClick={() => setActiveTab('sales')}
                >
                    <Receipt size={18} />
                    Vendas
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'subscribers' ? styles.active : ''}`}
                    onClick={() => setActiveTab('subscribers')}
                >
                    <Users size={18} />
                    Assinantes
                </button>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.selectWrapper}>
                        <select
                            value={filters.bot}
                            onChange={(e) => setFilters({ ...filters, bot: e.target.value })}
                            className={styles.select}
                        >
                            <option value="all">Todos os Bots</option>
                            {bots.map(bot => (
                                <option key={bot.id} value={bot.id}>@{bot.username}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className={styles.selectIcon} />
                    </div>

                    <div className={styles.selectWrapper}>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className={styles.select}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="paid">Pago</option>
                            <option value="pending">Pendente</option>
                            <option value="active">Ativo</option>
                            <option value="expired">Expirado</option>
                        </select>
                        <ChevronDown size={16} className={styles.selectIcon} />
                    </div>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'sales' ? (
                <div className={styles.tableSection}>
                    {filteredSales.length === 0 ? (
                        <EmptyState
                            icon={Receipt}
                            title="Nenhuma venda encontrada"
                            description="Suas vendas aparecerão aqui quando você fizer sua primeira venda"
                        />
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Plano</th>
                                        <th>Valor</th>
                                        <th>Status</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSales.map((sale, index) => (
                                        <tr key={sale.id || index}>
                                            <td>
                                                <div className={styles.customerCell}>
                                                    <span className={styles.customerName}>{sale.customer || 'Anônimo'}</span>
                                                    {sale.telegramUsername && (
                                                        <span className={styles.customerUsername}>@{sale.telegramUsername}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{sale.plan}</td>
                                            <td className={styles.amountCell}>{sale.amount}</td>
                                            <td>{getStatusBadge(sale.status || 'paid')}</td>
                                            <td className={styles.dateCell}>
                                                {sale.paidAt ? new Date(sale.paidAt).toLocaleDateString('pt-BR') : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.tableSection}>
                    {filteredSubscribers.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="Nenhum assinante encontrado"
                            description="Seus assinantes ativos aparecerão aqui"
                        />
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Assinante</th>
                                        <th>Bot</th>
                                        <th>Plano</th>
                                        <th>Status</th>
                                        <th>Expira em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubscribers.map((sub, index) => (
                                        <tr key={sub.id || index}>
                                            <td>
                                                <div className={styles.customerCell}>
                                                    <span className={styles.customerName}>{sub.name || 'Usuário'}</span>
                                                    {sub.username && (
                                                        <span className={styles.customerUsername}>@{sub.username}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>@{sub.botUsername || 'bot'}</td>
                                            <td>{sub.planName}</td>
                                            <td>{getStatusBadge(sub.status)}</td>
                                            <td className={styles.dateCell}>
                                                {sub.expiresAt
                                                    ? (sub.expiresAt === 'lifetime'
                                                        ? 'Vitalício'
                                                        : new Date(sub.expiresAt).toLocaleDateString('pt-BR'))
                                                    : '-'
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
