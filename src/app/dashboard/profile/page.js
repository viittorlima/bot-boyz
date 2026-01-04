'use client';

import { useState, useEffect } from 'react';
import { Eye, Copy, Check, Save, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        username: ''
    });
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                username: user.username || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // In a real app, you'd have an endpoint to update profile
            await authAPI.updateGateway(user.gateway_preference, null);
            updateUser(formData);
            showToast('Perfil atualizado!', 'success');
        } catch (error) {
            showToast('Erro ao salvar', 'error');
        } finally {
            setSaving(false);
        }
    };

    const copyLink = () => {
        const url = `${window.location.origin}/${user?.username || 'meu-link'}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        showToast('Link copiado!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://boyzclub.com'}/${user?.username || 'seu-username'}`;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Minha Página</h1>
                <p className={styles.subtitle}>Configure sua página pública de vendas</p>
            </div>

            <div className={styles.content}>
                {/* Preview Card */}
                <div className={styles.previewSection}>
                    <div className={styles.previewCard}>
                        <div className={styles.previewHeader}>
                            <Eye size={16} />
                            <span>Preview da página</span>
                        </div>

                        <div className={styles.previewContent}>
                            <div className={styles.previewAvatar}>
                                {formData.name?.charAt(0) || 'U'}
                            </div>
                            <div className={styles.previewName}>{formData.name || 'Seu Nome'}</div>
                            <div className={styles.previewBio}>{formData.bio || 'Sua bio aqui...'}</div>
                        </div>

                        <a
                            href={user?.username ? `/${user.username}` : '#'}
                            target="_blank"
                            className={styles.previewButton}
                        >
                            Ver página
                            <ExternalLink size={14} />
                        </a>
                    </div>

                    {/* Public Link */}
                    <div className={styles.linkCard}>
                        <label>Seu link público</label>
                        <div className={styles.linkBox}>
                            <input
                                type="text"
                                value={publicUrl}
                                readOnly
                                className={styles.linkInput}
                            />
                            <button className={styles.copyButton} onClick={copyLink}>
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Configurações do Perfil</h2>

                    <div className={styles.inputGroup}>
                        <label>Nome de exibição</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Seu nome"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Username</label>
                        <div className={styles.usernameWrapper}>
                            <span className={styles.usernamePrefix}>boyzclub.com/</span>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                placeholder="seu-username"
                                className={styles.usernameInput}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Conte um pouco sobre você e seu conteúdo..."
                            className={styles.textarea}
                            rows={4}
                        />
                    </div>

                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className={styles.spinner} />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
