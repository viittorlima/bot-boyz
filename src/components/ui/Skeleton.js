'use client';

import styles from './Skeleton.module.css';

/**
 * Skeleton - Loading placeholder component
 * Dark premium style
 */
export function Skeleton({
    width = '100%',
    height = '20px',
    borderRadius = '8px',
    className = ''
}) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
}

/**
 * SkeletonCard - Card-shaped loading placeholder
 */
export function SkeletonCard({ className = '' }) {
    return (
        <div className={`${styles.skeletonCard} ${className}`}>
            <div className={styles.skeletonHeader}>
                <Skeleton width="48px" height="48px" borderRadius="12px" />
                <Skeleton width="60px" height="20px" />
            </div>
            <Skeleton width="70%" height="20px" />
            <Skeleton width="50%" height="16px" />
            <div className={styles.skeletonFooter}>
                <Skeleton width="80px" height="14px" />
            </div>
        </div>
    );
}

/**
 * SkeletonTable - Table row loading placeholder
 */
export function SkeletonTable({ rows = 5 }) {
    return (
        <div className={styles.skeletonTable}>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className={styles.skeletonRow}>
                    <Skeleton width="120px" height="16px" />
                    <Skeleton width="80px" height="16px" />
                    <Skeleton width="60px" height="16px" />
                    <Skeleton width="100px" height="16px" />
                </div>
            ))}
        </div>
    );
}

/**
 * SkeletonStats - Stats cards loading placeholder
 */
export function SkeletonStats({ count = 4 }) {
    return (
        <div className={styles.skeletonStats}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={styles.skeletonStatCard}>
                    <Skeleton width="100px" height="14px" />
                    <Skeleton width="80px" height="28px" />
                </div>
            ))}
        </div>
    );
}

export default Skeleton;
