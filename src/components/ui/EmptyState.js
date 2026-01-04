'use client';

import { Bot, CreditCard, Package, FileText, Inbox } from 'lucide-react';
import styles from './EmptyState.module.css';

/**
 * EmptyState - Placeholder for empty data
 */
export default function EmptyState({
    icon: Icon = Inbox,
    title = 'Nenhum item',
    description = 'Não há dados para exibir',
    action = null
}) {
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                <Icon size={48} className={styles.icon} />
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            {action && (
                <div className={styles.action}>
                    {action}
                </div>
            )}
        </div>
    );
}

/**
 * GhostCard - Placeholder card showing what could be there
 */
export function GhostCard({
    icon: Icon = Package,
    title = 'Adicionar item',
    onClick
}) {
    return (
        <button className={styles.ghostCard} onClick={onClick}>
            <div className={styles.ghostIcon}>
                <Icon size={24} />
            </div>
            <span className={styles.ghostTitle}>{title}</span>
        </button>
    );
}
