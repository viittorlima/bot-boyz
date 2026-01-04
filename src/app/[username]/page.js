'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { User, Bot, ChevronRight, Loader2 } from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function CreatorProfilePage() {
    const params = useParams();
    const username = params.username;

    const [creator, setCreator] = useState(null);
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCreatorData();
    }, [username]);

    const loadCreatorData = async () => {
        try {
            const response = await api.get(`/plans/public/${username}`);
            setCreator(response.data.creator);
            setBots(response.data.bots || []);
        } catch (err) {
            console.error('Error loading creator:', err);
            setError('Criador não encontrado');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 size={32} className={styles.spinner} />
            </div>
        );
    }

    if (error && !creator) {
        return (
            <div className={styles.errorContainer}>
                <h2>Ops!</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.profile}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatarPlaceholder}>
                        <User size={48} />
                    </div>
                </div>

                <h1 className={styles.name}>{creator?.name || username}</h1>
                <p className={styles.bio}>{creator?.bio || 'Criador de conteúdo exclusivo'}</p>
            </div>

            {/* Bots List */}
            <div className={styles.botsSection}>
                <h2 className={styles.sectionTitle}>Grupos VIP Disponíveis</h2>

                {bots.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Bot size={40} className={styles.emptyIcon} />
                        <p>Nenhum grupo VIP disponível</p>
                    </div>
                ) : (
                    <div className={styles.botsList}>
                        {bots.map((bot) => (
                            <Link
                                key={bot.id}
                                href={`/${username}/${bot.username}`}
                                className={styles.botCard}
                            >
                                <div className={styles.botIcon}>
                                    <Bot size={24} />
                                </div>
                                <div className={styles.botInfo}>
                                    <div className={styles.botName}>{bot.name || `@${bot.username}`}</div>
                                    <div className={styles.botMeta}>
                                        {bot.plans?.length || 0} plano{bot.plans?.length !== 1 ? 's' : ''}
                                        {bot.plans?.length > 0 && (
                                            <span> • A partir de R$ {
                                                Math.min(...bot.plans.map(p => parseFloat(p.price)))
                                                    .toFixed(2).replace('.', ',')
                                            }</span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={20} className={styles.botArrow} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
