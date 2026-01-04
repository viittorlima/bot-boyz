'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Pause, Play, MoreVertical } from 'lucide-react';
import { creators as initialCreators } from '@/utils/mockData';
import { StatusBadge } from '@/components/ui/Badge';
import CreatorModal from '@/components/ui/CreatorModal';
import styles from './page.module.css';

export default function CreatorsPage() {
    const [creators, setCreators] = useState(initialCreators);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState(null);

    const filteredCreators = creators.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (creator) => {
        setSelectedCreator(creator);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedCreator(null);
        setIsModalOpen(true);
    };

    const handleSave = (creatorData) => {
        if (selectedCreator) {
            setCreators(creators.map(c =>
                c.id === selectedCreator.id ? { ...c, ...creatorData } : c
            ));
        } else {
            const newCreator = {
                id: Date.now(),
                ...creatorData,
                status: 'active',
                subscribers: 0,
                revenue: 'R$ 0,00',
                createdAt: new Date().toISOString().split('T')[0]
            };
            setCreators([newCreator, ...creators]);
        }
        setIsModalOpen(false);
    };

    const handleToggleStatus = (creator) => {
        setCreators(creators.map(c => {
            if (c.id === creator.id) {
                return { ...c, status: c.status === 'active' ? 'paused' : 'active' };
            }
            return c;
        }));
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Criadores</h1>
                    <p className={styles.subtitle}>Gerencie seus criadores cadastrados</p>
                </div>
                <button className={styles.addButton} onClick={handleAddNew}>
                    <Plus size={18} />
                    Novo Criador
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar criador..."
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
                            <th>Username</th>
                            <th>Plataforma</th>
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
                                            {creator.avatar ? (
                                                <img src={creator.avatar} alt={creator.name} />
                                            ) : (
                                                getInitials(creator.name)
                                            )}
                                        </div>
                                        <div>
                                            <div className={styles.creatorName}>{creator.name}</div>
                                            <div className={styles.creatorEmail}>{creator.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.username}>@{creator.username}</span>
                                </td>
                                <td>{creator.platform}</td>
                                <td>{creator.subscribers}</td>
                                <td className={styles.revenue}>{creator.revenue}</td>
                                <td>
                                    <StatusBadge status={creator.status} />
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleEdit(creator)}
                                            title="Editar"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleToggleStatus(creator)}
                                            title={creator.status === 'active' ? 'Pausar' : 'Ativar'}
                                        >
                                            {creator.status === 'active' ? (
                                                <Pause size={16} />
                                            ) : (
                                                <Play size={16} />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CreatorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                creator={selectedCreator}
                onSave={handleSave}
            />
        </div>
    );
}
