'use client';

import { useState, useEffect } from 'react';
import {
    Trophy, Medal, Crown, Loader2, ArrowUp, TrendingUp
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function RankingPage() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRanking();
    }, []);

    const loadRanking = async () => {
        try {
            const response = await api.get('/stats/ranking');
            if (response.data && response.data.ranking) {
                setRanking(response.data.ranking);
            }
        } catch (error) {
            console.error('Error loading ranking:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 size={48} className={styles.spinner} />
                <p>Carregando ranking...</p>
            </div>
        );
    }

    const top3 = ranking.slice(0, 3);
    const others = ranking.slice(3, 10);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Trophy size={32} className={styles.titleIcon} />
                    <div>
                        <h1 className={styles.title}>Ranking Mensal</h1>
                        <p className={styles.subtitle}>Os Top 10 criadores que mais faturaram este mês</p>
                    </div>
                </div>
            </div>

            {/* Podium (Top 3) */}
            <div className={styles.podiumContainer}>
                {/* 2nd Place */}
                {top3[1] && (
                    <div className={`${styles.podiumItem} ${styles.second}`}>
                        <div className={styles.medalIcon}>
                            <Medal size={32} color="#C0C0C0" />
                        </div>
                        <div className={styles.avatarPlaceholder}>
                            {top3[1].name.charAt(0)}
                        </div>
                        <div className={styles.podiumInfo}>
                            <span className={styles.rankNumber}>#2</span>
                            <h3 className={styles.creatorName}>{top3[1].name}</h3>
                            <span className={styles.revenue}>
                                R$ {parseFloat(top3[1].total).toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                        <div className={styles.podiumBar}></div>
                    </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <div className={`${styles.podiumItem} ${styles.first}`}>
                        <div className={styles.crownIcon}>
                            <Crown size={40} color="#FFD700" fill="#FFD700" />
                        </div>
                        <div className={styles.avatarPlaceholder}>
                            {top3[0].name.charAt(0)}
                        </div>
                        <div className={styles.podiumInfo}>
                            <span className={styles.rankNumber}>#1</span>
                            <h3 className={styles.creatorName}>{top3[0].name}</h3>
                            <span className={styles.revenue}>
                                R$ {parseFloat(top3[0].total).toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                        <div className={styles.podiumBar}></div>
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className={`${styles.podiumItem} ${styles.third}`}>
                        <div className={styles.medalIcon}>
                            <Medal size={32} color="#CD7F32" />
                        </div>
                        <div className={styles.avatarPlaceholder}>
                            {top3[2].name.charAt(0)}
                        </div>
                        <div className={styles.podiumInfo}>
                            <span className={styles.rankNumber}>#3</span>
                            <h3 className={styles.creatorName}>{top3[2].name}</h3>
                            <span className={styles.revenue}>
                                R$ {parseFloat(top3[2].total).toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                        <div className={styles.podiumBar}></div>
                    </div>
                )}
            </div>

            {/* List (4-10) */}
            <div className={styles.listContainer}>
                {others.map((creator, index) => (
                    <div key={creator.id} className={styles.listItem}>
                        <div className={styles.listRank}>#{index + 4}</div>
                        <div className={styles.listInfo}>
                            <div className={styles.listAvatar}>
                                {creator.name.charAt(0)}
                            </div>
                            <span className={styles.listName}>{creator.name}</span>
                        </div>
                        <div className={styles.listRevenue}>
                            <TrendingUp size={16} className={styles.trendIcon} />
                            R$ {parseFloat(creator.total).toFixed(2).replace('.', ',')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
