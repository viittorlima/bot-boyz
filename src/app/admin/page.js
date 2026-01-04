'use client';

import { DollarSign, Users, Percent, TrendingUp, Wallet } from 'lucide-react';
import { adminView } from '@/utils/mockData';
import styles from './page.module.css';

export default function AdminDashboardPage() {
    const stats = [
        {
            label: 'Faturamento Total',
            value: adminView.platformStats.totalRevenue,
            icon: DollarSign,
            change: 'Toda a plataforma'
        },
        {
            label: 'Comissões Recebidas',
            value: adminView.platformStats.totalCommission,
            icon: Percent,
            change: '10% das vendas'
        },
        {
            label: 'Total de Criadores',
            value: adminView.platformStats.totalCreators,
            icon: Users,
            change: `${adminView.platformStats.activeCreators} ativos`
        },
        {
            label: 'Assinantes na Plataforma',
            value: adminView.platformStats.totalSubscribers.toLocaleString(),
            icon: TrendingUp,
            change: '+245 este mês'
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Visão Geral da Plataforma</h1>
                <p className={styles.subtitle}>Métricas globais do BoyzClub</p>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
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

            <div className={styles.pendingCard}>
                <div className={styles.pendingIcon}>
                    <Wallet size={24} />
                </div>
                <div className={styles.pendingInfo}>
                    <span className={styles.pendingLabel}>Repasses Pendentes</span>
                    <span className={styles.pendingValue}>{adminView.platformStats.pendingPayouts}</span>
                </div>
                <button className={styles.processButton}>
                    Processar Repasses
                </button>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Criadores Recentes</h2>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Criador</th>
                                <th>Email</th>
                                <th>Receita</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminView.recentCreators.map(creator => (
                                <tr key={creator.id}>
                                    <td className={styles.creatorName}>{creator.name}</td>
                                    <td className={styles.email}>{creator.email}</td>
                                    <td className={styles.revenue}>{creator.revenue}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[creator.status]}`}>
                                            {creator.status === 'active' ? 'Ativo' : 'Pausado'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
