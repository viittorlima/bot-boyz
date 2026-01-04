'use client';

import styles from './Tabs.module.css';

export default function Tabs({ tabs, activeTab, onChange }) {
    return (
        <div className={styles.tabs}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.icon && <tab.icon size={16} />}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}

export function TabPanel({ children, isActive }) {
    if (!isActive) return null;
    return <div className={styles.panel}>{children}</div>;
}
