'use client';

import { useState, useEffect } from 'react';
import {
    Settings, Globe, Shield, Loader2, Save, MessageCircle,
    FileText, User, Lock, Eye, EyeOff, Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import styles from './page.module.css';

export default function AdminSettingsPage() {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // General settings
    const [settings, setSettings] = useState({
        siteName: 'Boyz Vip',
        siteUrl: 'https://boyzclub.com',
        supportEmail: 'suporte@boyzclub.com',
        platformChannelUsername: '@BoyzVip',
        promotionContactLink: 'https://t.me/suporte',
        supportTelegramLink: 'https://t.me/suporte',
        enableRegistration: true,
        requireEmailVerification: false,
        maintenanceMode: false
    });

    // Legal content
    const [legal, setLegal] = useState({
        termsOfUse: '',
        privacyPolicy: '',
        disclaimer: ''
    });

    // Profile settings
    const [profile, setProfile] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        if (user) {
            setProfile(prev => ({ ...prev, email: user.email || '' }));
        }
    }, [user]);

    const loadSettings = async () => {
        try {
            const [settingsRes, legalRes] = await Promise.all([
                api.get('/admin/settings'),
                api.get('/admin/legal').catch(() => ({ data: {} }))
            ]);

            if (settingsRes.data) {
                setSettings(prev => ({ ...prev, ...settingsRes.data }));
            }
            if (legalRes.data) {
                setLegal(prev => ({ ...prev, ...legalRes.data }));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGeneral = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/admin/settings', settings);
            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveLegal = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/admin/legal', legal);
            setMessage({ type: 'success', text: 'Textos legais salvos com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar textos legais' });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveProfile = async () => {
        if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Update email if changed
            if (profile.email !== user?.email) {
                await api.put('/auth/profile', { email: profile.email });
                updateUser({ email: profile.email });
            }

            // Update password if provided
            if (profile.newPassword && profile.currentPassword) {
                await api.put('/auth/password', {
                    currentPassword: profile.currentPassword,
                    newPassword: profile.newPassword
                });
                setProfile(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }

            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao atualizar perfil' });
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
                <h1 className={styles.title}>Configurações</h1>
                <p className={styles.subtitle}>Gerencie as configurações da plataforma</p>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'general' ? styles.active : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    <Settings size={18} />
                    Geral
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'legal' ? styles.active : ''}`}
                    onClick={() => setActiveTab('legal')}
                >
                    <FileText size={18} />
                    Termos e Privacidade
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <User size={18} />
                    Meu Perfil
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.type === 'success' ? <Check size={18} /> : <Shield size={18} />}
                    {message.text}
                </div>
            )}

            {/* General Tab */}
            {activeTab === 'general' && (
                <>
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

                    {/* Telegram Links */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <MessageCircle size={20} />
                            Links de Telegram
                        </h2>

                        <div className={styles.fieldsGrid}>
                            <div className={styles.field}>
                                <label>@ do Canal de Prévias</label>
                                <input
                                    type="text"
                                    placeholder="@BoyzVip"
                                    value={settings.platformChannelUsername}
                                    onChange={(e) => setSettings({ ...settings, platformChannelUsername: e.target.value })}
                                />
                                <span className={styles.fieldHint}>Aparece no rodapé das mensagens do bot</span>
                            </div>

                            <div className={styles.field}>
                                <label>Link de Suporte Telegram</label>
                                <input
                                    type="url"
                                    placeholder="https://t.me/suporte"
                                    value={settings.supportTelegramLink}
                                    onChange={(e) => setSettings({ ...settings, supportTelegramLink: e.target.value })}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Link para Envio de Divulgação</label>
                                <input
                                    type="url"
                                    placeholder="https://t.me/suporte"
                                    value={settings.promotionContactLink}
                                    onChange={(e) => setSettings({ ...settings, promotionContactLink: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Access Control */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Shield size={20} />
                            Controle de Acesso
                        </h2>

                        <div className={styles.toggleList}>
                            <div className={styles.toggleItem}>
                                <div>
                                    <span className={styles.toggleLabel}>Permitir Novos Cadastros</span>
                                    <span className={styles.toggleDesc}>Novos criadores podem se registrar</span>
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
                                    <span className={styles.toggleLabel}>Modo Manutenção</span>
                                    <span className={styles.toggleDesc}>Bloquear acesso à plataforma</span>
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

                    <button className={styles.saveButton} onClick={handleSaveGeneral} disabled={saving}>
                        {saving ? <Loader2 size={18} className={styles.spinner} /> : <Save size={18} />}
                        Salvar Configurações
                    </button>
                </>
            )}

            {/* Legal Tab */}
            {activeTab === 'legal' && (
                <>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <FileText size={20} />
                            Termos de Uso
                        </h2>
                        <p className={styles.sectionDesc}>
                            Texto que aparecerá na página pública de termos (/termos)
                        </p>
                        <textarea
                            className={styles.largeTextarea}
                            value={legal.termsOfUse}
                            onChange={(e) => setLegal({ ...legal, termsOfUse: e.target.value })}
                            placeholder="Digite os termos de uso da plataforma...

Exemplo:
1. Aceitação dos Termos
Ao acessar e utilizar a plataforma...

2. Descrição do Serviço
A plataforma permite a criadores..."
                            rows={12}
                        />
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <FileText size={20} />
                            Política de Privacidade
                        </h2>
                        <p className={styles.sectionDesc}>
                            Informe como os dados dos usuários são tratados
                        </p>
                        <textarea
                            className={styles.largeTextarea}
                            value={legal.privacyPolicy}
                            onChange={(e) => setLegal({ ...legal, privacyPolicy: e.target.value })}
                            placeholder="Digite a política de privacidade...

Exemplo:
1. Dados Coletados
Coletamos informações necessárias para...

2. Uso dos Dados
Seus dados são utilizados para..."
                            rows={12}
                        />
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Shield size={20} />
                            Isenção de Responsabilidade
                        </h2>
                        <p className={styles.sectionDesc}>
                            Declare a isenção de responsabilidade sobre conteúdo dos criadores
                        </p>
                        <textarea
                            className={styles.largeTextarea}
                            value={legal.disclaimer}
                            onChange={(e) => setLegal({ ...legal, disclaimer: e.target.value })}
                            placeholder="Digite a isenção de responsabilidade...

Exemplo:
A plataforma atua exclusivamente como intermediadora...
Não nos responsabilizamos pelo conteúdo criado..."
                            rows={8}
                        />
                    </div>

                    <button className={styles.saveButton} onClick={handleSaveLegal} disabled={saving}>
                        {saving ? <Loader2 size={18} className={styles.spinner} /> : <Save size={18} />}
                        Salvar Textos Legais
                    </button>
                </>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <User size={20} />
                            Informações do Administrador
                        </h2>

                        <div className={styles.fieldsGrid}>
                            <div className={`${styles.field} ${styles.fullWidth}`}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Lock size={20} />
                            Alterar Senha
                        </h2>
                        <p className={styles.sectionDesc}>
                            Deixe em branco se não quiser alterar a senha
                        </p>

                        <div className={styles.fieldsGrid}>
                            <div className={`${styles.field} ${styles.fullWidth}`}>
                                <label>Senha Atual</label>
                                <div className={styles.passwordField}>
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={profile.currentPassword}
                                        onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                                        placeholder="Digite sua senha atual"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                    >
                                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Nova Senha</label>
                                <div className={styles.passwordField}>
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={profile.newPassword}
                                        onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                                        placeholder="Digite a nova senha"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                    >
                                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Confirmar Nova Senha</label>
                                <div className={styles.passwordField}>
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={profile.confirmPassword}
                                        onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                                        placeholder="Confirme a nova senha"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                    >
                                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className={styles.saveButton} onClick={handleSaveProfile} disabled={saving}>
                        {saving ? <Loader2 size={18} className={styles.spinner} /> : <Save size={18} />}
                        Salvar Perfil
                    </button>
                </>
            )}
        </div>
    );
}
