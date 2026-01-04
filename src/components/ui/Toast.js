'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X, Check, AlertCircle, Info } from 'lucide-react';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className={styles.container}>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        // Return a no-op function if outside provider (for pages without toast)
        return { showToast: () => { }, addToast: () => { } };
    }
    return {
        showToast: context.addToast,
        addToast: context.addToast
    };
}

function Toast({ message, type, onClose }) {
    const icons = {
        success: Check,
        error: AlertCircle,
        info: Info
    };

    const Icon = icons[type] || Check;

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <div className={styles.iconWrapper}>
                <Icon size={16} />
            </div>
            <span className={styles.message}>{message}</span>
            <button className={styles.closeButton} onClick={onClose}>
                <X size={14} />
            </button>
        </div>
    );
}

export default Toast;
