'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    User,
    Mail,
    Lock,
    Save,
    Loader2,
    Check,
    AlertCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function SettingsPage() {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile form
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.put('/auth/profile', { name, email });
            setMessage({ type: 'success', text: response.data.message });
            await refreshUser();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao atualizar' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem' });
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
            setLoading(false);
            return;
        }

        try {
            const response = await api.put('/auth/password', { currentPassword, newPassword });
            setMessage({ type: 'success', text: response.data.message });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao alterar senha' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configurações da Conta</h1>
                <p className={styles.subtitle}>Gerencie seu perfil e senha</p>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <User size={18} />
                    Perfil
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'password' ? styles.active : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    <Lock size={18} />
                    Senha
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile} className={styles.form}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Informações Pessoais</h2>

                        <div className={styles.field}>
                            <label>
                                <User size={16} />
                                Nome
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>
                                <Mail size={16} />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? (
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
                </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <form onSubmit={handleChangePassword} className={styles.form}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Alterar Senha</h2>

                        <div className={styles.field}>
                            <label>
                                <Lock size={16} />
                                Senha Atual
                            </label>
                            <div className={styles.passwordInput}>
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Digite sua senha atual"
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setShowPasswords(!showPasswords)}
                                >
                                    {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>
                                <Lock size={16} />
                                Nova Senha
                            </label>
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>
                                <Lock size={16} />
                                Confirmar Nova Senha
                            </label>
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Digite novamente"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={18} className={styles.spinner} />
                                Alterando...
                            </>
                        ) : (
                            <>
                                <Lock size={18} />
                                Alterar Senha
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
