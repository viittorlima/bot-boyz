'use client';

import { useState, useEffect } from 'react';
import { X, User, Package, DollarSign } from 'lucide-react';
import styles from './CreatorModal.module.css';

const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'product', label: 'Produto', icon: Package },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
];

export default function CreatorModal({ isOpen, onClose, creator, onSave }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        platform: 'Telegram',
        channelId: '',
        price: '',
        duration: 30,
        pixKey: '',
        splitPercent: 85
    });

    useEffect(() => {
        if (creator) {
            setFormData({
                name: creator.name || '',
                username: creator.username || '',
                email: creator.email || '',
                platform: creator.platform || 'Telegram',
                channelId: creator.channelId || '',
                price: creator.price?.toString() || '',
                duration: creator.duration || 30,
                pixKey: creator.pixKey || '',
                splitPercent: creator.splitPercent || 85
            });
        } else {
            setFormData({
                name: '',
                username: '',
                email: '',
                platform: 'Telegram',
                channelId: '',
                price: '',
                duration: 30,
                pixKey: '',
                splitPercent: 85
            });
        }
        setActiveTab('profile');
    }, [creator, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            price: parseFloat(formData.price) || 0,
            duration: parseInt(formData.duration) || 30,
            splitPercent: parseInt(formData.splitPercent) || 85
        });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {creator ? 'Editar Criador' : 'Novo Criador'}
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.tabs}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.body}>
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className={styles.tabContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Nome Completo</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nome do criador"
                                        className={styles.input}
                                        required
                                    />
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="username"
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Plataforma</label>
                                        <select
                                            name="platform"
                                            value={formData.platform}
                                            onChange={handleChange}
                                            className={styles.select}
                                        >
                                            <option value="Telegram">Telegram</option>
                                            <option value="OnlyFans">OnlyFans</option>
                                            <option value="Privacy">Privacy</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@exemplo.com"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Product Tab */}
                        {activeTab === 'product' && (
                            <div className={styles.tabContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>ID do Canal VIP (Telegram)</label>
                                    <input
                                        type="text"
                                        name="channelId"
                                        value={formData.channelId}
                                        onChange={handleChange}
                                        placeholder="-1001234567890"
                                        className={styles.input}
                                    />
                                    <span className={styles.helper}>
                                        O ID do grupo/canal privado no Telegram
                                    </span>
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Preço (R$)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="29.90"
                                            step="0.01"
                                            min="0"
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Duração (dias)</label>
                                        <select
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className={styles.select}
                                        >
                                            <option value={7}>7 dias</option>
                                            <option value={15}>15 dias</option>
                                            <option value={30}>30 dias</option>
                                            <option value={90}>90 dias</option>
                                            <option value={365}>1 ano</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Financial Tab */}
                        {activeTab === 'financial' && (
                            <div className={styles.tabContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Chave Pix</label>
                                    <input
                                        type="text"
                                        name="pixKey"
                                        value={formData.pixKey}
                                        onChange={handleChange}
                                        placeholder="CPF, Email, Telefone ou Chave Aleatória"
                                        className={styles.input}
                                    />
                                    <span className={styles.helper}>
                                        Chave Pix para recebimento dos repasses
                                    </span>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Split do Criador (%)</label>
                                    <input
                                        type="number"
                                        name="splitPercent"
                                        value={formData.splitPercent}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        className={styles.input}
                                    />
                                    <span className={styles.helper}>
                                        Porcentagem que o criador recebe de cada venda
                                    </span>
                                </div>

                                <div className={styles.splitPreview}>
                                    <div className={styles.splitItem}>
                                        <span>Criador recebe:</span>
                                        <strong>{formData.splitPercent}%</strong>
                                    </div>
                                    <div className={styles.splitItem}>
                                        <span>Plataforma retém:</span>
                                        <strong>{100 - formData.splitPercent}%</strong>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            {creator ? 'Salvar Alterações' : 'Adicionar Criador'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
