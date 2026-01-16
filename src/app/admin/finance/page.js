'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard, Wallet, Key, Check, Loader2, AlertCircle,
    ExternalLink, Copy, Building, Percent, DollarSign, Info, Shield, Star, Megaphone, Eye, EyeOff
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

// Helper to render password input with toggle
const PasswordInput = ({ value, onChange, placeholder, fieldName, showSecrets, toggleSecret }) => (
    <div className={styles.passwordWrapper}>
        <input
            type={showSecrets[fieldName] ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        <button
            type="button"
            className={styles.eyeButton}
            onClick={() => toggleSecret(fieldName)}
        >
            {showSecrets[fieldName] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
    </div>
);

export default function AdminFinancePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [settings, setSettings] = useState({
        platformFee: 10,
        gateway: 'syncpay',
        // SyncPay
        syncpay_api_key: '',
        syncpay_platform_recipient_id: '',
        syncpay_default_recipient_id: '',
        // ParadisePag
        paradisepag_public_key: '',
        paradisepag_secret_key: ''
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            setSettings(prev => ({ ...prev, ...response.data }));
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
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }
    };

    const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.boyzvip.com'}/api/webhooks`;

    const copyWebhook = (url) => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const [showsecrets, setShowSecrets] = useState({});

    // Helper to render password input with toggle
    const toggleSecret = (field) => {
        setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
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
                <h1 className={styles.title}>Configurações Financeiras</h1>
                <p className={styles.subtitle}>Configure o gateway de pagamento da plataforma para receber as comissões</p>
            </div>

            {/* How it Works */}
            <div className={styles.infoCard}>
                <Info size={20} />
                <div>
                    <h3>Como funciona o recebimento?</h3>
                    <p>
                        Os pagamentos dos clientes vão <strong>direto para a conta do criador</strong>.
                        A plataforma recebe automaticamente sua comissão via <strong>Split de Pagamento</strong>
                        - uma funcionalidade do gateway que divide o valor no momento do pagamento.
                    </p>
                    <p style={{ marginTop: '8px' }}>
                        <strong>Você NÃO precisa de uma conta separada</strong> - o gateway do criador já
                        envia sua parte automaticamente para sua conta configurada abaixo.
                    </p>
                </div>
            </div>

            {/* Platform Fee */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <DollarSign size={20} />
                    Taxa da Plataforma (Split)
                </h2>

                <div className={styles.feeCards}>
                    <div className={styles.feeCard}>
                        <div className={styles.feeCardIcon}>
                            <DollarSign size={24} />
                        </div>
                        <div className={styles.feeCardContent}>
                            <h4>Taxa Fixa</h4>
                            <div className={styles.feeValue}>R$ 0,55</div>
                            <p>Valor fixo cobrado por venda aprovada</p>
                        </div>
                    </div>
                </div>

                <div className={styles.feeNote}>
                    <Info size={16} />
                    <span>A taxa fixa de R$ 0,55 é automaticamente deduzida de cada venda via split de pagamento. O criador recebe o restante do valor diretamente.</span>
                </div>
            </div>

            {/* Gateway Selection */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Building size={20} />
                    Gateway para Receber Comissões
                </h2>
                <p className={styles.sectionDesc}>
                    Escolha onde você quer receber sua parte das vendas (comissão via split)
                </p>

                <div className={styles.gatewayGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {/* SyncPay */}
                    <button
                        className={`${styles.gatewayCard} ${settings.gateway === 'syncpay' ? styles.active : ''}`}
                        onClick={() => setSettings({ ...settings, gateway: 'syncpay' })}
                    >
                        <div className={styles.gatewayHeader}>
                            <Megaphone size={24} />
                            <span>SyncPay</span>
                        </div>
                        <p>PIX Automático. Alta conversão.</p>
                    </button>

                    {/* ParadisePag */}
                    <button
                        className={`${styles.gatewayCard} ${settings.gateway === 'paradisepag' ? styles.active : ''}`}
                        onClick={() => setSettings({ ...settings, gateway: 'paradisepag' })}
                    >
                        <div className={styles.gatewayHeader}>
                            <DollarSign size={24} />
                            <span>ParadisePag</span>
                        </div>
                        <p>Múltiplos meios. Flexível.</p>
                    </button>
                </div>
            </div>

            {/* SyncPay Config */}
            {settings.gateway === 'syncpay' && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Key size={20} />
                        Credenciais SyncPay
                    </h2>
                    <p className={styles.sectionDesc}>
                        Insira suas credenciais da SyncPay para receber os pagamentos via split.
                    </p>

                    <div className={styles.fieldsGrid}>
                        <div className={`${styles.field} ${styles.fullWidth}`}>
                            <label>Chave de API (API Key) *</label>
                            <PasswordInput
                                placeholder="sync_..."
                                value={settings.syncpay_api_key}
                                onChange={(val) => setSettings({ ...settings, syncpay_api_key: val })}
                                fieldName="syncpay_api_key"
                                showSecrets={showsecrets}
                                toggleSecret={toggleSecret}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>ID do Recebedor da Plataforma *</label>
                            <input
                                type="text"
                                placeholder="Plataforma ID"
                                value={settings.syncpay_platform_recipient_id}
                                onChange={(e) => setSettings({ ...settings, syncpay_platform_recipient_id: e.target.value })}
                            />
                            <span className={styles.hint}>ID da sua conta principal para receber o split (R$ 0,55)</span>
                        </div>
                        <div className={styles.field}>
                            <label>ID do Recebedor Padrão</label>
                            <input
                                type="text"
                                placeholder="Default ID"
                                value={settings.syncpay_default_recipient_id}
                                onChange={(e) => setSettings({ ...settings, syncpay_default_recipient_id: e.target.value })}
                            />
                            <span className={styles.hint}>Caso criador não tenha gateway configurado</span>
                        </div>
                    </div>

                    <div className={styles.webhookSection}>
                        <label>URL do Webhook (configure no SyncPay):</label>
                        <div className={styles.webhookBox}>
                            <input type="text" value={`${webhookUrl}/syncpay`} readOnly />
                            <button onClick={() => copyWebhook(`${webhookUrl}/syncpay`)}>
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ParadisePag Config */}
            {settings.gateway === 'paradisepag' && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Key size={20} />
                        Credenciais ParadisePag
                    </h2>

                    <div className={styles.fieldsGrid}>
                        <div className={styles.field}>
                            <label>Chave Pública (Public Key) *</label>
                            <input
                                type="text"
                                placeholder="pk_..."
                                value={settings.paradisepag_public_key}
                                onChange={(e) => setSettings({ ...settings, paradisepag_public_key: e.target.value })}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Chave Secreta (Secret Key) *</label>
                            <PasswordInput
                                placeholder="sk_..."
                                value={settings.paradisepag_secret_key}
                                onChange={(val) => setSettings({ ...settings, paradisepag_secret_key: val })}
                                fieldName="paradisepag_secret_key"
                                showSecrets={showsecrets}
                                toggleSecret={toggleSecret}
                            />
                        </div>
                    </div>

                    <div className={styles.webhookSection}>
                        <label>URL do Webhook (configure no ParadisePag):</label>
                        <div className={styles.webhookBox}>
                            <input type="text" value={`${webhookUrl}/paradisepag`} readOnly />
                            <button onClick={() => copyWebhook(`${webhookUrl}/paradisepag`)}>
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        <Check size={18} />
                        Salvar Configurações
                    </>
                )}
            </button>
        </div>
    );
}
