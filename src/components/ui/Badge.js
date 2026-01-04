import styles from './Badge.module.css';

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) {
    const classes = [
        styles.badge,
        styles[variant],
        styles[size],
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classes}>
            {children}
        </span>
    );
}

// Status Badge for Active/Paused states
export function StatusBadge({ status }) {
    const isActive = status === 'active';

    return (
        <Badge variant={isActive ? 'active' : 'paused'}>
            {isActive ? 'Ativo' : 'Pausado'}
        </Badge>
    );
}
