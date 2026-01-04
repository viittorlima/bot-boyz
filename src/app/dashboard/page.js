'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Users, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { statsAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await statsAPI.getCreatorStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
            showToast('Erro ao carregar estatísticas', 'error');
            // Use fallback data
            setStats({
                todayRevenue: 'R$ 0,00',
                activeSubscribers: 0,
                pendingSales: 0,
                totalRevenue: 'R$ 0,00',
                recentSales: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Carregando...</p>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Faturamento Hoje',
            value: stats?.todayRevenue || 'R$ 0,00',
            icon: DollarSign
        },
        {
            label: 'Assinantes Ativos',
            value: stats?.activeSubscribers || 0,
            icon: Users
        },
        {
            label: 'Vendas Pendentes',
            value: stats?.pendingSales || 0,
            icon: Clock
        },
        {
            label: 'Total Geral',
            value: stats?.totalRevenue || 'R$ 0,00',
            icon: TrendingUp
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Visão geral do seu negócio</p>
            </div>

            <div className={styles.statsGrid}>
                {statCards.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <div className={styles.statIcon}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className={styles.statValue}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Últimas Vendas</h2>
                </div>

                <div className={styles.tableWrapper}>
                    {stats?.recentSales?.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Plano</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentSales.map((sale) => (
                                    <tr key={sale.id}>
                                        <td className={styles.customer}>{sale.customer}</td>
                                        <td>{sale.plan}</td>
                                        <td className={styles.amount}>{sale.amount}</td>
                                        <td className={styles.date}>
                                            {new Date(sale.paidAt).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Nenhuma venda ainda</p>
                            <span>Suas vendas aparecerão aqui</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
