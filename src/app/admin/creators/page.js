'use client';

import { useState } from 'react';
import { Search, LogIn, Ban, Eye, MoreVertical } from 'lucide-react';
import { creators } from '@/utils/mockData';
import { StatusBadge } from '@/components/ui/Badge';
import styles from './page.module.css';

export default function AdminCreatorsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCreators = creators.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImpersonate = (creator) => {
        alert(`Logando como ${creator.name}...`);
        // In real app: would set a session/token to impersonate
    };

    const handleBan = (creator) => {
        if (confirm(`Tem certeza que deseja banir ${creator.name}?`)) {
            alert(`${creator.name} foi banido.`);
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Criadores</h1>
                    <p className={styles.subtitle}>Gerenciamento de todos os criadores da plataforma</p>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.stats}>
                    <span>{filteredCreators.length} criadores</span>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Criador</th>
                            <th>Email</th>
                            <th>Assinantes</th>
                            <th>Receita</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCreators.map(creator => (
                            <tr key={creator.id}>
                                <td>
                                    <div className={styles.creatorCell}>
                                        <div className={styles.avatar}>
                                            {getInitials(creator.name)}
                                        </div>
                                        <div>
                                            <div className={styles.creatorName}>{creator.name}</div>
                                            <div className={styles.username}>@{creator.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.email}>{creator.email}</td>
                                <td>{creator.subscribers}</td>
                                <td className={styles.revenue}>{creator.revenue}</td>
                                <td>
                                    <StatusBadge status={creator.status} />
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleImpersonate(creator)}
                                            title="Logar como este usuário"
                                        >
                                            <LogIn size={16} />
                                        </button>
                                        <button
                                            className={styles.actionButton}
                                            title="Ver detalhes"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.danger}`}
                                            onClick={() => handleBan(creator)}
                                            title="Banir"
                                        >
                                            <Ban size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
