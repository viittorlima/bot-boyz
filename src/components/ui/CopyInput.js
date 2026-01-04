'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import styles from './CopyInput.module.css';

export default function CopyInput({
    value,
    label,
    helper,
    className = ''
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={`${styles.container} ${className}`}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    value={value}
                    readOnly
                    className={styles.input}
                />
                <button
                    type="button"
                    className={styles.copyButton}
                    onClick={handleCopy}
                >
                    {copied ? (
                        <>
                            <Check size={16} />
                            Copiado
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            Copiar
                        </>
                    )}
                </button>
            </div>
            {helper && <span className={styles.helper}>{helper}</span>}
        </div>
    );
}
