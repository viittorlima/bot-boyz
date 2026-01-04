'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    DollarSign, Users, Percent, TrendingUp, Wallet,
    Loader2, RefreshCw, ArrowRight, CreditCard
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
            setRecentTransactions(response.data.recentTransactions || []);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

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
            label: 'Suas Comissões',
            value: `R$ ${(stats?.totalCommission || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            icon: Percent,
            change: 'Split das vendas',
            highlight: true
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
                    <h1 className={styles.title}>Visão Geral</h1>
                    <p className={styles.subtitle}>Métricas globais da plataforma Boyz Vip</p>
                </div>
                <button className={styles.refreshButton} onClick={loadData}>
                    <RefreshCw size={18} />
                    Atualizar
                </button>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {statsCards.map((stat, index) => (
                    <div key={index} className={`${styles.statCard} ${stat.highlight ? styles.highlight : ''}`}>
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

            {/* Quick Links */}
            <div className={styles.quickLinks}>
                <Link href="/admin/finance" className={styles.quickLink}>
                    <CreditCard size={20} />
                    <div>
                        <span className={styles.quickLinkTitle}>Configurar Gateway</span>
                        <span className={styles.quickLinkDesc}>Configure onde receber suas comissões</span>
                    </div>
                    <ArrowRight size={18} />
                </Link>
                <Link href="/admin/creators" className={styles.quickLink}>
                    <Users size={20} />
                    <div>
                        <span className={styles.quickLinkTitle}>Gerenciar Criadores</span>
                        <span className={styles.quickLinkDesc}>Ver receitas, banir ou criar criadores</span>
                    </div>
                    <ArrowRight size={18} />
                </Link>
            </div>

            {/* Recent Transactions */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Últimas Transações</h2>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Criador</th>
                                <th>Cliente</th>
                                <th>Valor Total</th>
                                <th>Sua Comissão</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className={styles.emptyRow}>
                                        Nenhuma transação ainda
                                    </td>
                                </tr>
                            ) : (
                                recentTransactions.map((tx, i) => (
                                    <tr key={i}>
                                        <td className={styles.creatorName}>{tx.creator}</td>
                                        <td className={styles.customer}>{tx.customer}</td>
                                        <td>R$ {tx.amount?.toFixed(2).replace('.', ',')}</td>
                                        <td className={styles.commission}>
                                            R$ {tx.commission?.toFixed(2).replace('.', ',')}
                                        </td>
                                        <td className={styles.date}>
                                            {tx.paidAt ? new Date(tx.paidAt).toLocaleDateString('pt-BR') : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
