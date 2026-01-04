'use client';

import styles from './Button.module.css';

/**
 * Button component with two variants:
 * - solid: White background, black text
 * - outline: Transparent background, white text, gray border
 */
export default function Button({
    children,
    variant = 'solid',
    size = 'md',
    fullWidth = false,
    disabled = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) {
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}
