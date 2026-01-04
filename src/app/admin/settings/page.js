'use client';

import { useState, useEffect } from 'react';
import { Settings, Globe, Bell, Shield, Loader2, Check, Save } from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'BoyzClub',
        siteUrl: 'https://boyzclub.com',
        supportEmail: 'suporte@boyzclub.com',
        enableRegistration: true,
        requireEmailVerification: false,
        maintenanceMode: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            if (response.data) {
                setSettings(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            alert('Configurações salvas!');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Loader2 size={32} className={styles.spinner} />
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configurações Gerais</h1>
                <p className={styles.subtitle}>Configurações globais da plataforma</p>
            </div>

            {/* Site Settings */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Globe size={20} />
                    Configurações do Site
                </h2>

                <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                        <label>Nome do Site</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>URL do Site</label>
                        <input
                            type="url"
                            value={settings.siteUrl}
                            onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Email de Suporte</label>
                        <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Access Settings */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Shield size={20} />
                    Controle de Acesso
                </h2>

                <div className={styles.toggleList}>
                    <div className={styles.toggleItem}>
                        <div>
                            <span className={styles.toggleLabel}>Permitir Novos Cadastros</span>
                            <span className={styles.toggleDesc}>Novos criadores podem se registrar na plataforma</span>
                        </div>
                        <button
                            className={`${styles.toggle} ${settings.enableRegistration ? styles.on : ''}`}
                            onClick={() => setSettings({ ...settings, enableRegistration: !settings.enableRegistration })}
                        >
                            <div className={styles.toggleThumb} />
                        </button>
                    </div>

                    <div className={styles.toggleItem}>
                        <div>
                            <span className={styles.toggleLabel}>Verificação de Email</span>
                            <span className={styles.toggleDesc}>Exigir verificação de email no cadastro</span>
                        </div>
                        <button
                            className={`${styles.toggle} ${settings.requireEmailVerification ? styles.on : ''}`}
                            onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                        >
                            <div className={styles.toggleThumb} />
                        </button>
                    </div>

                    <div className={styles.toggleItem}>
                        <div>
                            <span className={styles.toggleLabel}>Modo Manutenção</span>
                            <span className={styles.toggleDesc}>Bloquear acesso à plataforma para manutenção</span>
                        </div>
                        <button
                            className={`${styles.toggle} ${settings.maintenanceMode ? styles.on : ''}`}
                            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                        >
                            <div className={styles.toggleThumb} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Button */}
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
                        Salvar Configurações
                    </>
                )}
            </button>
        </div>
    );
}
