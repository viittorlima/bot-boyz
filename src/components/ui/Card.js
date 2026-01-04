import { Users, DollarSign, Activity, TrendingUp, Pencil, Pause, Play } from 'lucide-react';
import styles from './Card.module.css';

// Generic Card container
export function Card({ children, className = '' }) {
    return (
        <div className={`${styles.card} ${className}`}>
            {children}
        </div>
    );
}

// Stat Card for statistics display
export function StatCard({ title, value, icon: Icon, change, changeType = 'positive' }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{title}</span>
                <div className={styles.cardIcon}>
                    {Icon && <Icon size={20} />}
                </div>
            </div>
            <div className={styles.cardValue}>{value}</div>
            {change && (
                <div className={`${styles.cardChange} ${styles[changeType]}`}>
                    {changeType === 'positive' ? <TrendingUp size={12} /> : null}
                    {change}
                </div>
            )}
        </div>
    );
}

// Creator Card for creator listing
export function CreatorCard({ creator, onEdit, onToggleStatus }) {
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className={styles.creatorCard}>
            <div className={styles.creatorHeader}>
                <div className={styles.creatorAvatar}>
                    {creator.avatar ? (
                        <img src={creator.avatar} alt={creator.name} />
                    ) : (
                        getInitials(creator.name)
                    )}
                </div>
                <div className={styles.creatorInfo}>
                    <h3 className={styles.creatorName}>{creator.name}</h3>
                    <p className={styles.creatorEmail}>{creator.email}</p>
                </div>
                <span className={`${styles.creatorStatus} ${styles[creator.status]}`}>
                    {creator.status === 'active' ? 'Ativo' : 'Pausado'}
                </span>
            </div>

            <div className={styles.creatorStats}>
                <div className={styles.creatorStat}>
                    <div className={styles.creatorStatLabel}>Plataforma</div>
                    <div className={styles.creatorStatValue}>{creator.platform}</div>
                </div>
                <div className={styles.creatorStat}>
                    <div className={styles.creatorStatLabel}>Seguidores</div>
                    <div className={styles.creatorStatValue}>{creator.followers}</div>
                </div>
                <div className={styles.creatorStat}>
                    <div className={styles.creatorStatLabel}>Receita</div>
                    <div className={styles.creatorStatValue}>{creator.revenue}</div>
                </div>
            </div>

            <div className={styles.creatorActions}>
                <button
                    className={`${styles.actionButton} ${styles.edit}`}
                    onClick={() => onEdit(creator)}
                >
                    <Pencil size={14} />
                    Editar
                </button>
                <button
                    className={`${styles.actionButton} ${creator.status === 'active' ? styles.pause : styles.resume}`}
                    onClick={() => onToggleStatus(creator)}
                >
                    {creator.status === 'active' ? (
                        <>
                            <Pause size={14} />
                            Pausar
                        </>
                    ) : (
                        <>
                            <Play size={14} />
                            Retomar
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Card;
