'use client';

import styles from './Input.module.css';

export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    helper,
    icon: Icon,
    disabled = false,
    required = false,
    className = '',
    ...props
}) {
    return (
        <div className={`${styles.inputGroup} ${className}`}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <div className={styles.inputWrapper}>
                {Icon && (
                    <div className={styles.iconWrapper}>
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`${styles.input} ${Icon ? styles.hasIcon : ''} ${error ? styles.hasError : ''}`}
                    {...props}
                />
            </div>
            {error && <span className={styles.error}>{error}</span>}
            {helper && !error && <span className={styles.helper}>{helper}</span>}
        </div>
    );
}

export function Textarea({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    error,
    disabled = false,
    required = false,
    className = '',
    ...props
}) {
    return (
        <div className={`${styles.inputGroup} ${className}`}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                required={required}
                className={`${styles.textarea} ${error ? styles.hasError : ''}`}
                {...props}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}

export function Select({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Selecione...',
    error,
    disabled = false,
    required = false,
    className = '',
    ...props
}) {
    return (
        <div className={`${styles.inputGroup} ${className}`}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`${styles.select} ${error ? styles.hasError : ''}`}
                {...props}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}
